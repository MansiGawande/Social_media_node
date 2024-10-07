import express from "express";
import { addCom, prevCom } from "../controller/comment.controller.js";
const router = express.Router();
router.post("/addcom",addCom);
router.get("/prevCom",prevCom)

export default router;