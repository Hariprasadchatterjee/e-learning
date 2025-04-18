import asyncError from "../Middleware/AsyncError.js";
import Course from "../Model/course.js";
import User from "../Model/user.js";
import getDataUri from "../Utils/dataUri.js";
import ErrorHandler from "../Utils/errorHandler.js";
import { sendEmail } from "../Utils/sendEmail.js";
import { sendToken } from "../Utils/sendToken.js";
import crypto from "crypto"
import cloudinary from "cloudinary"
import Stash from "../Model/Stats.js"
import Payment from "../Model/Payment.js";
import { log } from "console";
import mongoose from "mongoose";

export const registerC = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;
  console.log(req.body);
  
  if (!name || !email || !password || !file) return next(new ErrorHandler("all fields are required", 400));
  
  let user = await User.findOne({ email });
  // console.log(myUser);

  if (user) return next(new ErrorHandler("User Already Exists", 409));
  
    const fileUri = getDataUri(file);
    // Upload file to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type:"image",})

  user = new User({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  });

  await user.save()
   sendToken(res, user, "Register Successfully Done", 201);
  

});

export const loginC = asyncError(async(req,res,next)=>{
  const {email,password} = req.body;
  if ( !email || !password) {
    return next(new ErrorHandler("all fields are required", 400));
  }
  const myUser = await User.findOne({email}).select("+password");
  if (!myUser) {
    return next(new ErrorHandler("User Credentials are Invalid",422))
  }
  const isMatchPassword =await  myUser.comparePassword(password)
  if (!isMatchPassword) {
    return next(new ErrorHandler("User Credentials are Invalid",422))
  }
  sendToken(res, myUser, "login Successfully Done", 200);
})

export const logoutC= asyncError(async(req,res,next)=>{
  res.status(200).clearCookie("token", {httpOnly: true,secure: true,
    sameSite:"none"}).json({
    success:true,
    message:"logout Successfully"
  })
})

export const profileC= asyncError(async(req,res,next)=>{
  const userID = req.user._id;
  const user =await User.findById(userID)
  
  res.status(200).json({
    success:true,
    user,
  })
})

export const deleteMyProfile = asyncError(async (req, res, next) => {
  const userID = req.user._id;
  const user = await User.findById(userID);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  try {
    // If the user has an avatar, delete it from Cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        .catch(error => console.error("Cloudinary deletion error:", error));
    }

    await user.deleteOne();

    res.status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,  // Recommended for security
        secure: process.env.NODE_ENV === 'production' || true  // HTTPS in production
      })
      .json({
        success: true,
        message: "Account deleted successfully",
      });
  } catch (error) {
    return next(new ErrorHandler("Error during account deletion", 500));
  }
});

export const changePassword= asyncError(async(req,res,next)=>{
  const {oldpassword,newpassword} = req.body
  if ( !oldpassword || !newpassword) {
    return next(new ErrorHandler("all fields are required", 400));
  }
  // const userID =  req.user._id;
  const user =await User.findById(req.user._id).select("+password")

  const isMatchPassword =await user.comparePassword(oldpassword)
  if (!isMatchPassword) {
    return next(new ErrorHandler("Incorrect Oldpassword",422))
  }

  user.password = newpassword;
  await user.save()
  
  res.status(200).json({
    success:true,
    message:"password change successfully",
  })
})

export const updateProfile = asyncError(async (req, res, next) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Please enter a valid email address", 400));
  }

  // Check if email exists (excluding current user)
  const existingUser = await User.findOne({ 
    email,
    _id: { $ne: req.user._id } // More efficient than comparing strings later
  });

  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 409));
  }

  // Find and update user
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update fields
  user.name = name;
  user.email = email;

  // Save with validation
  try {
    await user.save({ validateBeforeSave: true });
    
    // Remove sensitive data before sending response
    user.password = undefined;
    user.__v = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (saveError) {
    return next(new ErrorHandler("Failed to update profile", 500));
  }
});

export const updateProfilePicture = asyncError(async (req, res, next) => {
  // Find the user by ID
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if a file was uploaded
  const file = req.file;
  if (!file) {
    return next(new ErrorHandler("File not found", 404));
  }

  try {
    // Convert the file to a data URI
    const fileUri = getDataUri(file);

    // Upload the file to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

    // If the user already has an avatar, delete the old one from Cloudinary
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    // Update the user's avatar
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    // Save the updated user document
    await user.save();

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return next(new ErrorHandler("Error updating profile picture", 500));
  }
});

export const forgetPassword= asyncError(async(req,res,next)=>{
 const {email} = req.body;
 const user = await User.findOne({email}).select("+password");
 console.log(user);
 
 if (!user) {
  return next(new ErrorHandler("user not found",400))
 }
 const createToken = await user.getToken();
 await user.save();
  // send token via email
  const url=`${process.env.FRONTEND_URL}/resetpassword/${createToken}`
  const message = `Click on thee link to reset password ${url}. If you have not request than ignore it`
  sendEmail(user.email,"course bundler reset password",message)

  res.status(200).json({
    success:true,
    message:"reset token has been sent to user"
  })
})

export const resetPassword= asyncError(async(req,res,next)=>{
 const {token} = req.params;

 const resetPasswordToken=await crypto.createHash("sha256").update(token).digest("hex");

 const user=await User.findOne({
  resetPasswordToken,
  resetPasswordExpires:{
    $gt:Date.now()
  }
 })

 if (!user) {
  return next(new ErrorHandler("token is Invalid or expired",400))
 }
 user.password=req.body.password;
 user.resetPasswordExpires=null;
 user.resetPasswordToken=null;
 await user.save()
  
  res.status(200).json({
    success:true,
    message:"password change successfully"
  })
})

export const addToPlaylist= asyncError(async(req,res,next)=>{
 const {courseId} = req.query;
 const user = await User.findById(req.user._id);
 const course = await Course.findById(courseId);
 if (!course) {
  return next(new ErrorHandler("course not found in this id",400))
 }
 const isExsistItem = user.playlist.find( (item)=>item.course.toString()===course._id.toString())
 if(isExsistItem) return next(new ErrorHandler("course is already exists",400))

 user.playlist.push({
  course:course._id,
  poster:course.poster.url,
 })

 await user.save()
  
  res.status(200).json({
    success:true,
    message:"added to playlist successfully"
  })
})

export const removeFromPlaylist= asyncError(async(req,res,next)=>{
 const {courseId} = req.query;
 const user = await User.findById(req.user._id);
 const course = await Course.findById(courseId);
 if (!course) {
  return next(new ErrorHandler(`course not found in this id ${courseId}`,400))
 }
 user.playlist = user.playlist.filter( (item)=>item.course.toString()!==course._id.toString())

 await user.save()
  
  res.status(200).json({
    success:true,
    message:"remove from playlist successfully"
  })
})

export const getAllUsers= asyncError(async(req,res,next)=>{
 
 const users = await User.find().select("-playlist");
 
 if (!users) {
  return next(new ErrorHandler("users not found "))
 }

  res.status(200).json({
    success:true,
    users
  })
})

export const changeUserRole = asyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log("Role id", id);
  

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found with this ID", 404));
    }

    // Toggle the user's role
    user.role = user.role === "admin" ? "user" : "admin";

    // Save the updated user document
    await user.save();

    // Send a success response with the updated user
    res.status(200).json({
      success: true,
      message: "User role changed successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return next(new ErrorHandler("Error changing user role", 500));
  }
});

export const deleteUser = asyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log("delete id", id);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Find the user by ID
    const user = await User.findById(id).session(session);
    if (!user) {
      return next(new ErrorHandler("User not found with this ID", 404));
    }

    if (user.avatar && user.avatar.public_id) {
      try {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }


    
    // cancel subscription
    if (user.subscription?.id) {
      try {
        const subscription = await razorpay.subscriptions.fetch(user.subscription.id);

        if (subscription.status === "active") {
          await razorpay.subscriptions.cancel(user.subscription.id);

          const payment = await Payment.findOne({
            razorpay_subscription_id: user.subscription.id,
          }).session(session);

          if (payment) {
            const refundPeriod = 7 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
            const isWithinRefundPeriod = ( Date.now() - payment.createdAt ) < refundPeriod;
            if (isWithinRefundPeriod) {
              await razorpay.payments.refund(payment.razorpay_payment_id);
            }
          }
        }
      }
      catch (subscriptionError) {
        console.error('Subscription cancellation failed:', subscriptionError);
        throw new ErrorHandler("Failed to cancel subscription", 500);
      }
    }


    await user.deleteOne({session});
    await Payment.deleteMany({ user: id }).session(session);

    await session.commitTransaction();

    // Send a success response with the updated user
    res.status(200).json({
      success: true,
      message: "User Deleted successfully",
      
    });
  } catch (error) {
    // Handle any errors that occur during the process
    await session.abortTransaction();
    session.endSession();
    return next(new ErrorHandler("Error deleting user role", 500));
  }
  finally {
    session.endSession();
  }
});

User.watch().on("change",async()=>{
  const stash = await Stash.find({}).sort({createdAt:"desc"}).limit(1);

  const subscription = await User.find({"subscription.status":"active"});
  const userList = await User.countDocuments();

  stash[0].subscriptions = subscription.length;
  stash[0].users = userList;
  stash[0].createdAt = new Date(Date.now())

  await stash[0].save();
})
