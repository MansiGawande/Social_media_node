import express from "express"
import { addFollow,unfollow,following } from "../controller/follow.controller.js";

const router = express.Router();
router.post("/addFollow",addFollow);
router.delete("/removefollow",unfollow)
router.get("/following",following);

export default router;