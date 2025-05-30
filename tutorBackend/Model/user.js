import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minLength: [6, "password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscription: {
    id: String,
    status: String,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  playlist: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      poster: String,
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
};

userSchema.pre("save",async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  
  this.password = await bcrypt.hash(this.password,10)
   return next();
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password,this.password)
};

userSchema.methods.getToken=  function () {
  const resetToken =  crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex")
  
  this.resetPasswordExpires=new Date(Date.now()+1000*60*15)

  return resetToken;
}



export default mongoose.model("User", userSchema);
