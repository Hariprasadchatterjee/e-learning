// import Queue from "bull";
// import { sendEmail } from "../Utils/sendEmail.js";
// import User from "../Model/user.js";

// const emailQueue = new Queue('course-notifications', {
//   redis: {
//     host: '127.0.0.1',
//     port: 3000,
//   }
// });

// // Process jobs
// emailQueue.process(async (job) => {
//   const { courseId, courseTitle } = job.data;
  
//   const users = await User.find({ 'playlist.course': courseId });
  
//   await Promise.all(
//     users.map(user =>
//       sendEmail({
//         to: user.email,
//         subject: `Course Update: ${courseTitle}`,
//         html: `<p>The course <b>${courseTitle}</b> was removed.</p>`
//       }).catch(console.error)
//     )
//   );
// });

// export default emailQueue;