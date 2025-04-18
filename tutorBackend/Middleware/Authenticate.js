import jwt from "jsonwebtoken"
import asyncError from "./AsyncError.js";
import ErrorHandler from "../Utils/errorHandler.js";
import User from "../Model/user.js";

export const isAuthenticate = asyncError(async (req,res,next)=>{
  const {token} =req.cookies;
  console.log("ht",token);
  
  if (!token) return next(new ErrorHandler("user permission is denied",401))

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    
    next()
})

export const isAuthorizeAdmin = asyncError(async (req,res,next)=>{
  
    if(req.user.role !== "admin") return next(new ErrorHandler("user unauthirize for access",403))
    next()
})

export const authorizeSubscribers = asyncError(async (req,res,next)=>{
  
    if(req.user.subscription.status !== "active" || req.user.role === "admin") return next(new ErrorHandler("only subscriber and user can unauthirize to access lecture",403))
    next()
})

