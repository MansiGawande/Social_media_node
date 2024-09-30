
import express from "express";
import { likes } from "../controller/likes.controller.js";
const router = express.Router();
router.post("/likes",likes);
export default router;