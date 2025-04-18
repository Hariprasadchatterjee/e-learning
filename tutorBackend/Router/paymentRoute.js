
import express from "express";

import { isAuthenticate } from "../Middleware/Authenticate.js";
import { createSubscription, getRazorPayKey, cancelSubscription, paymentverification } from "../Controller/paymentController.js";

const router = express.Router();

router.route("/subscribe").get(isAuthenticate,createSubscription);

router.route("/paymentverification").post(isAuthenticate,paymentverification);

router.route("/getrazorpaykey").get(getRazorPayKey);

router.route("/subscribe/cancel").delete(isAuthenticate, cancelSubscription);


export default router;
