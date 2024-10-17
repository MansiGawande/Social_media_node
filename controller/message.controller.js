import { request, response } from "express";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Message from "../model/message.model.js";
import sharp from "sharp";
import fs from "fs"

export const addchat = async (request, response, next) => {
  try {
    console.log(request.body);

    const {reciever_id, content, user_id } = request.body; // followed_id = profile_id
    const media_url = request.file ? request.file.path : null;
    console.log("Request body: ",request.body)

    if (!reciever_id) {
      return response.status(400).json({ message: "reciever_id  is required." });
    }
    const userData = await User.findOne({ where: { user_id: user_id } });
    console.log("userData: ", userData);  

    if (!userData) {
      return response
        .status(404)
        .json({ message: "Sign in to chat with others." });
    }
    const userId = userData.user_id;

    const existpro = await Profile.findOne({ where: { user_id: userId } });
    console.log("existpro: ", existpro);
    if (!existpro) {
      return response.status(404).json({ message: "Profile not found." });
    }
    console.log("existpro.profile_id: ", existpro.profile_id);
    const senderUser = existpro.profile_id;

    //==========================================================================

    const followercheck = await Profile.findOne({
      where: { profile_id: senderUser },
    }); // who

    if (!followercheck) {
      return response.status(404).json({ message: "sender profile not exist" });
    }
    const sender = followercheck.profile_id; //sender final
    //===============================================================================

    const profileData = await Profile.findOne({
      where: { profile_id: reciever_id },
    });
    console.log("profileData: ", profileData);

    if (!profileData) {
      return response
        .status(404)
        .json({ message: "Reciever profile not found" });
    }
    const reciever = profileData.profile_id; // profileId = follower_id who

    //=============================================================================================

           // Resize image using sharp
           const resizedMediaPath = `Send/data/resized_${request.file.filename}`;
           const metadata = await sharp(media_url).metadata();
           const newHeight = 400;
           const newWidth = Math.round((metadata.width / metadata.height) * newHeight);
   
           await sharp(media_url)
               .resize(newWidth, newHeight)
               .toFile(resizedMediaPath);
   
           // Delete the original uploaded file if needed (optional)
           fs.access(media_url, fs.constants.F_OK, (err) => {
               if (!err) {
                   // File exists, proceed with deletion
                   fs.unlink(media_url, (err) => {
                       if (err) {
                           console.error(`Failed to delete the original file: ${media_url}`, err);
                       } else {
                           console.log(`Original file deleted: ${media_url}`);
                       }
                   });
               }
           });
   
           // Set media_url to the path of the resized image
           const resizedMediaUrl = `resized_${request.file.filename}`;

    const follow = await Message.create({
      reciever_id: reciever, // who
      sender_id: sender, //whose
      content,
      media_url:resizedMediaUrl
    });
    if(follow){
      console.log("Follow data: ",follow);
    }
    return response.status(200).json({
      message: "You are successfully following the profile.",
      data: follow,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal server problem..." });
  }
};




//=================correct below========================================

// import { request, response } from "express";
// import User from "../model/user.model.js";
// import Profile from "../model/profile.model.js";
// import Message from "../model/message.model.js";

// export const addchat = async (request, response, next) => {
//   try {
//     console.log("Request.body: ", request.body);
//     const { reciever_id, content, user_id } = request.body; // followed_id = profile_id

//     if (!reciever_id) {
//       return response.status(400).json({ message: "Profile ID is required." });
//     }
//     const userData = await User.findOne({ where: { user_id: user_id } });
//     console.log("userData: ", userData);

//     if (!userData) {
//       return response
//         .status(404)
//         .json({ message: "Sign in to chat with others." });
//     }
//     const userId = userData.user_id;

//     const existpro = await Profile.findOne({ where: { user_id: userId } });
//     console.log("existpro: ", existpro);
//     if (!existpro) {
//       return response.status(404).json({ message: "Profile not found." });
//     }
//     console.log("existpro.profile_id: ", existpro.profile_id);
//     const senderUser = existpro.profile_id;

//     //==========================================================================

//     const followercheck = await Profile.findOne({
//       where: { profile_id: senderUser },
//     }); // who

//     if (!followercheck) {
//       return response.status(404).json({ message: "sender profile not exist" });
//     }
//     const sender = followercheck.profile_id; //sender final
//     //===============================================================================

//     const profileData = await Profile.findOne({
//       where: { profile_id: reciever_id },
//     });
//     console.log("profileData: ", profileData);

//     if (!profileData) {
//       return response
//         .status(404)
//         .json({ message: "Reciever profile not found" });
//     }
//     const reciever = profileData.profile_id; // profileId = follower_id who

//     //=============================================================================================

//     const follow = await Message.create({
//       reciever_id: reciever, // who
//       sender_id: sender, //whose
//       content,
//     });
//     if(follow){
//       console.log("Follow data: ",follow);
//     }
//     return response.status(200).json({
//       message: "You are successfully following the profile.",
//       data: follow,
//     });
//   } catch (err) {
//     console.error(err);
//     return response.status(500).json({ error: "Internal server problem..." });
//   }
// };
