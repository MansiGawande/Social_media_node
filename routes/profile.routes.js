import express from "express";
import { createPro, updatePro, viewPro } from "../controller/profile.controller.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = 'ProfileImage/image/';

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        } //valid
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
         // Store as unique filename
    }
    });
const limits = {
    fileSize: 1024 * 1024 * 5  // Limit file size to 5MB
};
const upload = multer({ storage: storage , limits: limits });
const router = express.Router();

// Route to create a profile
router.post("/createPro", upload.single("profileImg_URL"), createPro); 
router.put("/updatePro", upload.single("profileImg_URL"), updatePro);
router.get("/viewPro",viewPro) //  extra
export default router;
