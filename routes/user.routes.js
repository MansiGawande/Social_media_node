import express from "express";
import { body } from "express-validator";
import { signUp ,signIn, generateToken} from "../controller/user.controller.js";

const router = express.Router();
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required..")
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters long'),
    body("username")
      .isEmail()
      .withMessage("please enter a valid email"),
     body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isAlphanumeric()
      .withMessage("password should alphanumeric")
      .isLength({ min: 8 })
      .withMessage("Password must be longer than 6 characters."),
  ],
  signUp
);
router.post("/signin", signIn);
router.post("/generate-token", generateToken);


export default router;
