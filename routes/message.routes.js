import express from "express";
import { addchat ,chatByUser} from "../controller/message.controller.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = "Send/data";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};
const upload = multer({ storage: storage, limits: limits }); // create multer instance

const router = express.Router();

router.post("/addchat", upload.single("media_url"), addchat);
router.get("/chatByUser",chatByUser);
export default router;
