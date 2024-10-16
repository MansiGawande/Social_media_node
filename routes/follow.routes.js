import express from "express"
import { addFollow,unfollow,following,chatFollow} from "../controller/follow.controller.js";

const router = express.Router();
router.post("/addFollow",addFollow);
router.delete("/removefollow",unfollow)
router.get("/following",following);
router.get("/chatFollow",chatFollow)

export default router;