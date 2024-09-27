import multer from "multer";
import path from "path";
import express from "express";
import { createPost } from "../controller/post.controller.js";

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'PostData/data'; 
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage }); // Create multer instance

const router = express.Router();
router.post("/post", upload.single("media_url"), createPost); 

export default router;
