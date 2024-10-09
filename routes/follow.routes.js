import express from "express"
import { addFollow,unfollow } from "../controller/follow.controller.js";

const router = express.Router();
router.post("/addFollow",addFollow);
router.delete("/removefollow",unfollow)
export default router;