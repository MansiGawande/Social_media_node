import { request, response } from "express";
import Profile from "../model/profile.model.js";
import User from "../model/user.model.js";

export const createPro = async (request, response,next) => {
    console.log('Request body:', request.body); 
    console.log('Uploaded file:', request.file); 
  
    const { email, name, bio,user_id } = request.body;
    // const profileImg_URL = request.file ? request.file.path : null; // Get the uploaded file's path
    // const profileImg_URL = request.file ? request.file.path.replace(/\\/g, '/') : null;
    const profileImg_URL = request.file ? request.file.filename : null;

     try {
        let profile = await Profile.findOne({ where: { email } });
         if (profile) {
            return response.status(409).json({ message: "Profile already exists." });
        }
        profile = await Profile.create({
            name,
            email,
            bio,
            user_id,
            profileImg_URL,
        });

        return response.status(201).json({
            message: "Profile created successfully.",
            profile,
        });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ message: "Server error", error: err.message });
    }
};


export const updatePro = async (request, response) => {
    try {
        const { name, email, bio, profile_id } = request.body;
        const profileImg_URL = request.file ? request.file.path : undefined; 
        
        let profile = await Profile.findOne({ where: { profile_id } });
        if (!profile) {
            return response.status(404).json({ message: "Profile not found" });
        }
             const currentEmail = profile.email; 

             const updatedProfile = await Profile.update({
                name,
                email,
                bio,
                profileImg_URL: profileImg_URL || profile.profileImg_URL 
            },
            {
                where: { profile_id }
            });

        if (email && currentEmail !== email) {
            await User.update({ username: email }, { where: { username: currentEmail } });
        }

        if (updatedProfile[0] > 0) {
            return response.status(200).json({ message: "Profile updated successfully", data: updatedProfile });
        } else {
            return response.status(400).json({ message: "No changes made" });
        }
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Internal server problem" });
    }
};

export const viewPro = async (request, response) => {
    try {
        const { user_id } = request.query;
        if (!user_id) {
            return response.status(400).json({ message: "Please login for view the Profile: " });
        }
        const profileFind = await Profile.findOne({ where: { user_id } });
         if (!profileFind) {     
            return response.status(404).json({ message: "Profile not found" });
        }
        return response.status(200).json({ message: "Profile Data:", profile: profileFind });
         } catch (error) {
        console.error('Error fetching profile:', error);
        return response.status(500).json({ message: "An error occurred while fetching the profile." });
    }
};



