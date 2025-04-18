import {  registerC, loginC, logoutC, profileC, changePassword, updateProfile, updateProfilePicture,forgetPassword, resetPassword, addToPlaylist, removeFromPlaylist, getAllUsers, changeUserRole, deleteUser, deleteMyProfile } from "../Controller/Authentication.js";
import express from "express";
import { isAuthenticate, isAuthorizeAdmin } from "../Middleware/Authenticate.js";
import singleUpload from "../Middleware/multer.js";

const router = express.Router();

router.route("/login").post(loginC)
router.route("/register").post(singleUpload,registerC)
router.route("/logout").post(logoutC)

router.route("/me").get(isAuthenticate,profileC)
router.route("/deleteme").delete(isAuthenticate,deleteMyProfile)
router.route("/changepassword").put(isAuthenticate,changePassword)
router.route("/updateprofile").put(isAuthenticate,updateProfile)
router.route("/upProPic").put(singleUpload,isAuthenticate,updateProfilePicture)

router.route("/forgetpassword").post(forgetPassword)
router.route("/resetpassword/:token").put(resetPassword)

//Add to Playlist
router.route("/addtoplaylist").post(isAuthenticate,addToPlaylist)
router.route("/removefromplaylist").delete(isAuthenticate,removeFromPlaylist)

//get all users
router.route("/admin/getalluser").get(isAuthenticate, isAuthorizeAdmin, getAllUsers)
router.route("/admin/user/:id").patch(isAuthenticate, isAuthorizeAdmin, changeUserRole)
router.route("/admin/deleteuser/:id").delete(isAuthenticate, isAuthorizeAdmin, deleteUser)

export default router;