
import express from "express";
import { addlikes, removeLike } from "../controller/likes.controller.js";
const router = express.Router();
router.post("/addlikes",addlikes);
router.delete("/removeLike",removeLike)
export default router;