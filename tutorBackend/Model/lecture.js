 import mongoose from "mongoose"
 const courseLectureSchema = new mongoose.Schema({

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  
})

courseLectureSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const lecture = this;
  
  if (lecture.video?.public_id) {
    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
      resource_type: "video"
    });
  }
  
  next(); // Proceed to actual lecture deletion
});

export default mongoose.model("Lecture",courseLectureSchema)