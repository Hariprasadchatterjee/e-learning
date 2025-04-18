import asyncError from "../Middleware/AsyncError.js";
import Course from "../Model/course.js";
import User from "../Model/user.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import Lecture from "../Model/lecture.js";
import getDataUri from "../Utils/dataUri.js";
import ErrorHandler from "../Utils/errorHandler.js";
import Stash from "../Model/Stats.js"
import { notifyUsers } from "./NotifyUser.js";
// import emailQueue from "../Utils/emailQueue.js";

export const getAdminCourses = asyncError(async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  
  const courses = await Course.find({ createdBy: userId })
    .populate("createdBy", "name email avatar")
    .populate("lectures") // Populate lectures
    .sort({ createdAt: -1 });
    
  if (!courses) {
    return next(new ErrorHandler("No courses found", 404));
  }
  
  res.status(200).json({ success: true, courses });
});

export const getAdminLectures = asyncError(async (req, res, next) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId).populate("lectures");
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }
  const lectures = course.lectures.map((lecture) => ({
    id: lecture._id,
    title: lecture.title,
    description: lecture.description,
    video: lecture.video.url,
  }));
  res.status(200).json({ success: true, lectures });
});




export const getCourseC = asyncError(async (req, res, next) => {
  const { title = "", category = "" } = req.query;

  // Input validation (optional but recommended)
  if (typeof title !== "string" || typeof category !== "string") {
    return next(new ErrorHandler("Invalid query parameters", 400));
  }

  // Optimized query construction
  const query = {};
  
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  try {
    const courses = await Course.find(query)
    .populate({
      path: "createdBy",
      select: "name email avatar", // Include additional fields like avatar
    })
      .select("-lectures -__v") // Exclude lectures and version key
      .lean(); // Convert to plain JS objects for performance

    if (!courses.length) {
      return res.status(200).json({ 
        success: true, 
        message: "No courses found", 
        courses: [] 
      });
    }

    res.status(200).json({ 
      success: true, 
      count: courses.length, 
      courses 
    });
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
});

export const postCourseC = asyncError(async (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category ) {
    return next(new ErrorHandler("all fields are required", 400));
  }

  // get the user whoe create this course
  const userId = req.user._id;

  const file = req.file;
  console.log(file);
  const fileUri= getDataUri(file)
  console.log(fileUri);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)
  
  
  const myCourse = new Course({
    title,
    description,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    category,
    
  });

  myCourse.createdBy=userId;
  await myCourse.save();
  res.status(201).json({ success: true,message:"course added successfully", course: myCourse });
});

export const getCourseLectures = asyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate("lectures");
  if (!course) {
    return next(new ErrorHandler("course not found", 400));
  }
  course.views+=1;
  await course.save()
  res.status(200).json({ success: true, courseLectures: course.lectures });
});


export const postCourseLectures = asyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const courseId = req.params.id;
  const file = req.file;

  // === 1. Input Validation ===
  if (!title || !description) {
    return next(new ErrorHandler("Title and description are required", 400));
  }

  if (!file) {
    return next(new ErrorHandler("Please upload a video file", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorHandler("Invalid course ID", 400));
  }

  // === 2. Cloudinary Upload (with Error Handling) ===
  let cloudinaryResult;
  try {
    const fileUri = getDataUri(file);
    cloudinaryResult = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type: "video",
    });
  } catch (cloudinaryError) {
    return next(new ErrorHandler("Failed to upload video to Cloudinary", 500));
  }

  // === 3. Database Operations (Transaction-Safe) ===
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the course exists
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      throw new ErrorHandler("Course not found", 404);
    }

    // Create the lecture (linked to the course)
    const lecture = await Lecture.create(
      [
        {
          title,
          description,
          video: {
            public_id: cloudinaryResult.public_id,
            url: cloudinaryResult.secure_url,
          },
          course: courseId, // Optional: Reference to the course
        },
      ],
      { session }
    );

    // Add lecture to the course
    course.lectures.push(lecture[0]._id);
    course.numOfVideos = course.lectures.length;
    await course.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      lecture: lecture[0],
    });
  } catch (error) {
    // Rollback on failure
    await session.abortTransaction();
    next(new ErrorHandler(error.message, 500));
  } finally {
    session.endSession();
  }
});



export const deleteCourse = asyncError(async (req, res, next) => {
  try {
    // Step 1: Validate the courseId
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      return next(new ErrorHandler("Invalid courseId", 400));
    }
    console.log("delete course id", req.params.id);
    

    // Step 2: Find the course
    const course = await Course.findById(req.params.id);
    console.log("my course", course);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Step 3: Delete the poster from Cloudinary (if it exists)
    if (course.poster && course.poster.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(course.poster.public_id);
        console.log(`Deleted poster from Cloudinary: ${course.poster.public_id}`);
      } catch (cloudinaryError) {
        console.error("Error deleting poster from Cloudinary:", cloudinaryError);
        return next(new ErrorHandler("Failed to delete poster from Cloudinary", 500));
      }
    }

    // Step 4: Get lecture IDs
    const lectureIds = course.lectures;
    console.log("my lecture ids", lectureIds);

    // Step 5: Fetch lectures and delete videos from Cloudinary
    const lectures = await Lecture.find({ _id: { $in: lectureIds } });

    for (const lecture of lectures) {
      if (lecture.video && lecture.video.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
            resource_type: "video",
          });
          console.log(`Deleted video from Cloudinary: ${lecture.video.public_id}`);
        } catch (cloudinaryError) {
          console.error("Error deleting video from Cloudinary:", cloudinaryError);
          return next(new ErrorHandler("Failed to delete video from Cloudinary", 500));
        }
      }
    }

    // Step 6: Delete lectures from the database
    await Lecture.deleteMany({ _id: { $in: lectureIds } });

    // Step 7: Delete the entire course document
    await course.deleteOne(); // or await course.deleteOne();
    await notifyUsers(course._id, course.title); // Notify users about the deletion

     // Add to queue (fast response)
    //  emailQueue.add({
    //   courseId: course._id,
    //   courseTitle: course.title
    // }); 


    // Step 8: Send success response
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    next(new ErrorHandler("Internal Server Error", 500));
  }
});

export const deleteCourseLectures = asyncError(async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.query;
    console.log("Deleting lecture - courseId:", courseId, "lectureId:", lectureId);

    // Step 1: Validate courseId and lectureId
    if (!courseId || !lectureId) {
      return next(new ErrorHandler("courseId and lectureId are required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
      return next(new ErrorHandler("Invalid courseId or lectureId", 400));
    }

    // Step 2: Find the course and verify the lecture belongs to it
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Check if lectureId exists in course.lectures[]
    const lectureExistsInCourse = course.lectures.some(
      (lecId) => lecId.toString() === lectureId.toString()
    );

    if (!lectureExistsInCourse) {
      return next(new ErrorHandler("Lecture not found in this course", 404));
    }

    // Step 3: Find the lecture (to check Cloudinary deletion)
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return next(new ErrorHandler("Lecture not found", 404));
    }

    // Step 4: Delete video from Cloudinary (if exists)
    if (lecture.video?.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
          resource_type: "video",
        });
        console.log("Cloudinary video deleted:", lecture.video.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
        // Proceed even if Cloudinary fails (optional: return error)
      }
    }

    // Step 5: Remove lecture from course & delete from DB (transaction-safe)
    course.lectures = course.lectures.filter(
      (lecId) => lecId.toString() !== lectureId.toString()
    );

    // Perform both operations in parallel (optional: use transactions for atomicity)
    await Promise.all([
      Lecture.deleteOne({ _id: lectureId }),
      course.save(),
    ]);

    res.status(200).json({ success: true, message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCourseLectures:", error);
    next(new ErrorHandler(error.message || "Internal Server Error", 500));
  }
});


Course.watch().on("change",async()=>{
   const stash = await Stash.find({}).sort({createdAt:"desc"}).limit(1);

   const courses = await Course.find({});
   let totalViews = 0;

   for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
   }

   stash[0].views = totalViews;
   stash[0].createdAt = new Date(Date.now())
   await stash[0].save();
})


