import express from "express"
import { addchat } from "../controller/message.controller.js";
const router = express.Router();
router.post("/addchat",addchat);
export default router;