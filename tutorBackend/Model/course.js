import mongoose from "mongoose";
import Lecture from "../Model/lecture.js"


const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please enter course title"],
    minLength: [6, "title must be at least 6 characters"],
    maxLength: [80, "title must be at least 80 characters"],
  },
  description: {
    type: String,
    required: [true, "please enter your email"],
    minLength: [20, "description must be at least 20 characters"],
  },
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },

  lectures:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Lecture"
    }
  ],
  
  views: {
    type: Number,
    default: 0,
  },
  numOfVideos: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre("deleteOne",{document:true, query:false}, async function (next) {
  try {
    const course = this;
    
    // 1. Remove course from all users' playlists
    await mongoose.model('User').updateMany(
      { 'playlist.course': course._id },
      { $pull: { playlist: { course: course._id } } }
    );

       // 2. Delete all associated lectures (this will trigger their pre-delete hooks)
       await Lecture.deleteMany({ _id: { $in: course.lectures } });
    
       next();
  } catch (error) {
    
  }
})

export default mongoose.model("Course", courseSchema);
