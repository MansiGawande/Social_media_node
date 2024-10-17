import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express from "express";
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import uploadPostRouter from "./routes/post.routes.js";
import cors from 'cors';
import "./model/association.model.js"
import path from "path";
import { fileURLToPath } from "url";
import likesRouter from "./routes/likes.routes.js"
import commentRouter from "./routes/comment.routes.js"
import followRouter from "./routes/follow.routes.js"
import chatRouter from "./routes/message.routes.js"

const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/images', express.static(path.join(__dirname, 'ProfileImage/image')));

app.use('/ProfileImage', express.static('ProfileImage'));
app.use('/PostData',express.static('PostData'));
app.use('/Send',express.static('Send'))

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
dotenv.config();
// console.log("SECRET_KEY:", process.env.SECRET_KEY); 

app.use("/user",userRouter);
app.use("/profile",profileRouter);
app.use("/post",uploadPostRouter);
app.use("/likes",likesRouter);
app.use("/comment",commentRouter);
app.use ("/follow",followRouter);
app.use("/chat",chatRouter)


app.listen(3001,()=>{
    console.log("server started on port 3001");
})
