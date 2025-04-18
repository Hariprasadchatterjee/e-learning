
import express from "express";

import { isAuthenticate, isAuthorizeAdmin } from "../Middleware/Authenticate.js";
import { dashBoardStats } from "../Controller/Stash.js";


const router = express.Router();

router.route("/dashboardstats").get(isAuthenticate,isAuthorizeAdmin, dashBoardStats);


export default router;