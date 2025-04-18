import { getCourseC, postCourseC, getCourseLectures, postCourseLectures, deleteCourse, deleteCourseLectures, getAdminCourses } from "../Controller/courseController.js";
import express from "express";
import singleUpload from "../Middleware/multer.js";
import { authorizeSubscribers, isAuthenticate, isAuthorizeAdmin } from "../Middleware/Authenticate.js";

const router = express.Router();

router.route("/getadmincourse").post(isAuthenticate,isAuthorizeAdmin,getAdminCourses);

router.route("/courses").get(getCourseC).post(isAuthenticate, isAuthorizeAdmin, singleUpload,postCourseC);

router.route("/deletecourse/:id").delete(isAuthenticate,isAuthorizeAdmin,deleteCourse)


router.route("/courselectures/:id").get(isAuthenticate,authorizeSubscribers,getCourseLectures).post(isAuthenticate,isAuthorizeAdmin, singleUpload,postCourseLectures)

router.route("/deleteLecture").delete(isAuthenticate,isAuthorizeAdmin, deleteCourseLectures)

export default router;
