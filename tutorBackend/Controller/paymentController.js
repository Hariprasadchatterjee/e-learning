import { razorpay } from "../app.js";
import asyncError from "../Middleware/AsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import User from "../Model/user.js"
import Payment from "../Model/Payment.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createSubscription=asyncError(async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();

  try{
  const user = await User.findById(req.user._id).session(session);
  if (!user) {
    throw new ErrorHandler("User not found", 404);
  }

  if (user.role==="admin") {
    throw new ErrorHandler("Admin cant't buy subscription")
  }
  const plan_id=process.env.RAZORPAY_PLAN_ID;

  
 const subscription= await razorpay.subscriptions.create({
  plan_id,
  customer_notify: 1,
  quantity: 1,
  total_count: 12,
 
})

console.log("Subscription created:", subscription.id);


user.subscription.id=subscription.id;
user.subscription.status=subscription.status;

await user.save({ session });
await session.commitTransaction();

res.status(201).json({
  success:true,
  subscriptionId:subscription.id,
});
  }catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorHandler(error.message, 500);
  }
  finally {
    session.endSession();
  }
})

export const paymentverification = asyncError(async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
    
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification fields"
      });
    }

    const user = await User.findById(req.user._id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      throw new ErrorHandler("User not found", 404);
    }

    const body = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);
    }

    // Fixed create with session by using array
    await Payment.create([{
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    }], { session });

    user.subscription.status = "active";
    user.subscription.id = razorpay_subscription_id;
    await user.save({ session });
    await session.commitTransaction();

    res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ErrorHandler(error.message, 500);
  } finally {
    session.endSession();
  }
});



export const cancelSubscription = asyncError(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Starting cancellation for user:", req.user._id);
    
    const user = await User.findById(req.user._id).session(session);
    console.log("User found:", user);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("User subscription ID:", user.subscription.id);
    
    if (!user.subscription.id || !user.subscription.status) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "No active subscription found"
      });
    }

    const subscription_id = user.subscription.id;
    let refund = false;

     // ✅ Check Razorpay subscription status first
     const razorpaySubscription = await razorpay.subscriptions.fetch(subscription_id);

     // If already cancelled, just update DB (no need to call cancel again)
     if (razorpaySubscription.status === "cancelled") {
       await Payment.deleteOne({ razorpay_subscription_id: subscription_id }).session(session);
       user.subscription.id = undefined;
       user.subscription.status = undefined;
       await user.save({ session });
       await session.commitTransaction();
       session.endSession();
 
       return res.status(200).json({
         success: true,
         message: "Subscription was already cancelled. Database updated."
       });
     }


    // Cancel Razorpay subscription
    try {
      console.log("Attempting Razorpay cancellation");
      await razorpay.subscriptions.cancel(subscription_id);
    } catch (razorpayError) {
      console.error("Razorpay cancel error:", razorpayError);
      await session.abortTransaction();
      session.endSession();
      return res.status(502).json({
        success: false,
        message: "Failed to cancel with payment provider",
        error: razorpayError.message
      });
    }

    const payment = await Payment.findOne({
      razorpay_subscription_id: subscription_id,
      user: user._id
    }).session(session);

    console.log("Payment record found:", payment);
    
    if (!payment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Payment record not found"
      });
    }

    // Calculate refund eligibility
    const gap = Date.now() - new Date(payment.createdAt).getTime();
    const refundTime = (process.env.REFUND_DAYS || 7) * 24 * 60 * 60 * 1000;
    
    console.log("Refund time calculation:", { gap, refundTime });

    if (gap < refundTime) {
      try {
        console.log("Attempting refund");
        await razorpay.payments.refund(payment.razorpay_payment_id);
        refund = true;
      } catch (refundError) {
        console.error("Refund failed:", refundError);
        // Continue without refund
      }
    }

    // Update records
    await payment.deleteOne({ session });
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: refund 
        ? "Subscription canceled. Refund initiated." 
        : "Subscription canceled. No refund issued."
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Subscription cancellation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during cancellation",
      error: error.message
    });
  }
});

export const getRazorPayKey=asyncError(async(req,res,next)=>{
  res.status(200).json({ success:true, api_key:process.env.RAZORPAY_API_KEY})
})