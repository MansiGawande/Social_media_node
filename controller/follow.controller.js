
import { request, response } from "express";
import Profile from "../model/profile.model.js";
import Follow from "../model/follow.model.js";
import User from "../model/user.model.js";

export const addFollow = async (request, response, next) => {
    try {
        console.log("Request.body: ", request.body);
        const { followed_id,userId } = request.body;

        const userData = await User.findOne({ where: { user_id:userId } });
        console.log("userData: ", userData);

        if (!userData) {
            return response.status(404).json({ message: "Sign in to follow the profile." });
        }

        const user_id = userData.user_id;
        console.log("UserId----------: ", user_id);

        // Check if followed_id is provided
        if (!followed_id) {
            return response.status(400).json("Profile ID is required.");
        }

        const profileData = await Profile.findOne({ where: { profile_id:followed_id } });
        console.log("profileData: ", profileData); // profile

        if (!profileData) {
            return response.status(404).json({ message: "Create a profile to follow others." });
        }

        const profile_id = profileData.profile_id;
        console.log("Profile_id: ", profile_id);

        // Create follow entry with status
        await Follow.create({
            followed_id,
            status: 1 // Follow status
        });

        return response.status(200).json({ message: "You are successfully following the profile." });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server problem...", err });
    }
};



export const unfollow = async (request, response, next) => {
    try {
        console.log("Request.body: ", request.body);
        const { followed_id } = request.body;

        const userData = await User.findOne({ where: { user_id } });
        if (!userData) {
            return response.status(404).json({ message: "Sign in to unfollow the profile." });
        }

        if (!followed_id) {
            return response.status(400).json("Profile ID is required.");
        }

        const profileData = await Profile.findOne({ where: { user_id } });
        console.log("profileData: ", profileData); // profile

        if (!profileData) {
            return response.status(404).json({ message: "Create a profile to unfollow others." });
        }

        const profile_id = profileData.profile_id;
        console.log("Profile_id: ", profile_id);


        // Update the follow status to unfollow
        const followEntry = await Follow.findOne({ where: { followed_id, follower_id: profile_id } });
        if (!followEntry) {
            return response.status(404).json({ message: "You are not following this profile." });
        }

        // Update the status to unfollow
        await followEntry.update({ status: 0 });

        return response.status(200).json({ message: "You have unfollowed the profile." });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server problem...", err });
    }
};

