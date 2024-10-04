

// backend pe upload ke waqt image ko resize karna hoga. Yeh ensure karega ki apne backend se aayi hui image fix size me ho without css ui par show ho ske  npm i sharp .sharp  images ko resize, compress aur format conversion karne ki suvidha deta hai.
import multer from "multer";
import path from "path";
import express from "express";
import { createPost, postContent, profileposts } from "../controller/post.controller.js";
import fs from 'fs';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'PostData/data'; 

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        } //valid
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});
const limits = {
    fileSize: 1024 * 1024 * 5
  };
  
const upload = multer({ storage: storage
     ,limits: limits
     }); 

const router = express.Router();
router.post("/uploadps", upload.single("media_url"), createPost);
router.get("/profileposts",profileposts);
router.get("/postContent",postContent)

export default router;