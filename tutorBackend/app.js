import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudnary from "cloudinary";
import Razorpay from "razorpay";
import nodecorn from "node-cron";

cloudnary.v2.config({
  cloud_name: process.env.API_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

import courseBundle from "./Router/courseRouter.js";
import authenticationBundle from "./Router/authRouter.js";
import errorMiddleware from "./Middleware/error.js";
import paymentBundle from "./Router/paymentRoute.js";
import dashboardBundle from "./Router/Dashboard.js";
import Stash from "./Model/Stats.js";

import { connectServer } from "./server.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Mount all routes
app.use("/api/course", courseBundle);
app.use("/api/auth", authenticationBundle);
app.use("/api/payment", paymentBundle);
app.use("/api/dashboard", dashboardBundle);

// Error middleware should be the last app.use()
app.use(errorMiddleware);

nodecorn.schedule("0 0 0 1 * *", async () => {
  try { 
    await Stash.create({});
  } catch (error) {
    console.log(error);
  }
});

// Initialize the regular server and pass the configured 'app' to it
connectServer(app);