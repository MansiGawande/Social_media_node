import { request, response } from "express";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Message from "../model/message.model.js";

export const addchat = async (request, response, next) => {
    try {
        console.log("Request.body: ", request.body);
        const { reciever_id, content, user_id } = request.body; // followed_id = profile_id

        if (!reciever_id) {
            return response.status(400).json({ message: "Profile ID is required." });
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
        console.log("profileData: ", profileData);

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

        const follow = await Message.create({
            reciever_id: reciever, // who
            sender_id: sender, //whose
            content,
        });
        return response.status(200).json({
            message: "You are successfully following the profile.",
            data: follow,
        });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Internal server problem..." });
    }
};
