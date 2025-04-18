import Notification from "../Model/notify.js";
import User from "../Model/user.js";
import { sendEmail } from "../Utils/sendEmail.js";

export const notifyUsers = async (courseId, courseTitle) => {
  const users = await User.find({ 'playlist.course': courseId });
  
  // Create database records
  await Notification.insertMany(
    users.map(user => ({
      userId: user._id,
      courseId,
      message: `Course "${courseTitle}" was removed`
    }))
  );
  
  // Then send emails
  await Promise.all(users.map(user => 
    sendEmail(user.email, `Course Removed`, `"${courseTitle}" was deleted`)
  ));
};