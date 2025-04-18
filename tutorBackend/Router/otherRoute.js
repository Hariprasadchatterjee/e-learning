
import express from "express";

import { isAuthenticate } from "../Middleware/Authenticate.js";



const router = express.Router();

router.route("/contactus").post(isAuthenticate, contactUsC);


export default router;