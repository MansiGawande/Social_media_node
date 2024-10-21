import { request, response } from "express";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Message from "../model/message.model.js";
import sharp from "sharp";
import fs from "fs";
import { Op } from "sequelize";

export const addchat = async (request, response, next) => {
  try {
    // console.log('request.body:------------------------------------------------------',request.body);

    console.log(request.body);
    const { reciever_id, content, user_id } = request.body; // followed_id = profile_id
    const media_url = request.file ? request.file.path : null;
    const name = request.file ? request.file.originalname : null; //  get media_name from

    console.log("Uploaded file:", request.file);

    if (!reciever_id) {
      return response
        .status(400)
        .json({ message: "reciever_id  is required." });
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
    if (media_url) {
      // Resize image using sharp
      const resizedMediaPath = `Send/data/resized_${request.file.filename}`;
      const metadata = await sharp(media_url).metadata();
      const newHeight = 400;
      const newWidth = Math.round(
        (metadata.width / metadata.height) * newHeight
      );

      await sharp(media_url)
        .resize(newWidth, newHeight)
        .toFile(resizedMediaPath);

      // Delete the original uploaded file if needed 
      fs.access(media_url, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, proceed with deletion
          fs.unlink(media_url, (err) => {
            if (err) {
              console.error(
                `Failed to delete the original file: ${media_url}`,
                err
              );
            } else {
              console.log(`Original file deleted: ${media_url}`);
            }
          });
        }
      }); //correct
   // Set media_url to the path of the resized image
      const resizedMediaUrl = `resized_${request.file.filename}`;
      const follow = await Message.create({
        reciever_id: reciever, // who
        sender_id: sender, //whose
        content,
        media_url: resizedMediaUrl,
        name: name || null, // media_name
      });
      if (follow) {
        console.log("Follow data: ", follow);

        const messageToEmit = {
          sender_id: follow.sender_id,
          reciever_id: follow.reciever_id,
          content: follow.content,
          media_url: follow.media_url,
          createdAt: follow.createdAt,
        };
  
        request.app.get('io').emit('newMessage', messageToEmit);
  
        return response.status(200).json({
          message: "Message sent successfully.",
          data: follow
        });
  
      }
      return response.status(200).json({
        message: "You are successfully following the profile.",
        data: follow
      });
    }
    let resizedMediaUrl = null;
    const follow = await Message.create({
      reciever_id: reciever, // who
      sender_id: sender, //whose
      content,
      media_url: resizedMediaUrl,
      name: name || null, // media_name
    });
    if (follow) {
      console.log("Follow data: ", follow);
    }
    return response.status(200).json({
      message: "You are sending the media",
      data: follow,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal server problem..." });
  }
};

//SELECT * from messages where( sender_id = 1 AND reciever_id = 2) OR ( sender_id = 2 AND reciever_id = 1);
export const chatByUser = async(request,response,next)=>{
  console.log(request.query);
  // track random signin & click chat
  try{
    const { reciever_id,  user_id } = request.query; // followed_id = profile_id

  if (!reciever_id) {
    return response
      .status(400)
      .json({ message: "reciever_id  is required." });
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
    return response.status(404).json({ message: "Sender Profile not Found." });
  }
  console.log("sender profile_id: ", existpro.profile_id);
  const senderUser = existpro.profile_id;
  //==========================================================================

  const chat = await Message.findAll({ where: {
[Op.or]: [
        { reciever_id: reciever_id, sender_id: senderUser },
        { reciever_id: senderUser, sender_id: reciever_id }
      ]
    }
  });  return response.status(200).json({message:"BY Profile chat Get",data:chat})
  }catch(err){
    console.log(err);
    return response.status(500).json({error:"Internal server Problem...."})
  }
}

