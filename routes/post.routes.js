import multer from "multer";
import path from "path";
import express from "express";
import { createPost, postContent, profileposts} from "../controller/post.controller.js";
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
     ,limits: limits }); // create multer instance

const router = express.Router();
router.post("/uploadps", upload.single("media_url"), createPost);
router.get("/profileposts",profileposts); //others
router.get("/postContent",postContent); 

export default router;
