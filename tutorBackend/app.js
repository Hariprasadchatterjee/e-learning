import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudnary from "cloudinary";
import Razorpay from "razorpay";
import nodecorn from "node-cron";


cloudnary.v2.config({
  cloud_name:process.env.API_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_API_SECRET, // Replace with your Razorpay Key Secret
});



import courseBundle from "./Router/courseRouter.js";
import authenticationBundle from "./Router/authRouter.js";
import errorMiddleware from "./Middleware/error.js";
import paymentBundle from "./Router/paymentRoute.js"
import dashboardBundle from "./Router/Dashboard.js"
import Stash from "./Model/Stats.js"
import { isValidToken } from "./Utils/isValidtoken.js";

nodecorn.schedule("0 0 0 1 * *",async()=>{
  try { 
    await Stash.create({})
  } catch (error) {
    console.log(error);
    
  }
})

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())



app.get("/api/check-auth", (req, res) => {
  const { token } = req.cookies;

  console.log("Token from cookies:", token); // Debugging: Log the token

  if (!token) {
    // If no token is found in cookies, the user is not logged in
    return res.status(401).json({ isLoggedIn: false, message: "No token found" });
  }

  try {
    // Validate the token using a function `isValidToken`
    if (isValidToken(token)) {
      // If the token is valid, the user is logged in
      return res.status(200).json({ isLoggedIn: true });
    } else {
      // If the token is invalid, the user is not logged in
      return res.status(401).json({ isLoggedIn: false, message: "Invalid token" });
    }
  } catch (error) {
    // Handle any errors that occur during token validation
    console.error("Token validation error:", error);
    return res.status(500).json({ isLoggedIn: false, message: "Internal server error" });
  }
});

app.use("/api/course", courseBundle);
app.use("/api/auth", authenticationBundle);
app.use("/api/payment", paymentBundle);
app.use("/api/dashboard", dashboardBundle);

app.use(errorMiddleware);



console.log("MongoDB URL:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("MongoDB connected successfully");
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT || 8000}`);
  });
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
