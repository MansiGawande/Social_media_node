import { request, response } from "express";
import Profile from "../model/profile.model.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";

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
//=============================================================

export const selfProfile = async (request, response, next) => {
    try {
        const { user_id } = request.query
        console.log("selfProfile--------------------",request.query);
        const profileData = await Profile.findOne({ where: { user_id} });
        if (!user_id) {
            return response.status(404).json({ error: "Sign in for view the profile" });
        }
        if (!profileData) {
            return response.status(404).json({ message: "Profile not found" });
        }
        console.log("profileData ***********************: ",profileData)
        const profile_id = profileData.profile_id;
        console.log(profile_id);

        const profilepost = await Post.findAll({ where: { profile_id } })
        if (profilepost) {
            return response.status(200).json({ message: "Profile & npost is here: ", data: profilepost, profile: profileData })
        }
        // if(!profilepost){
        //     return response.status(404).json({ message: "No Post Available", data: profilepost, profile: profileData })

        // }
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server Problem." })
    }
}
//======================cooreect above===================


export const allProfies = async (request, response) => {
    try {
        const { user_id } = request.query;
        if (!user_id) {
            console,log("User is required")
        }
        const userData = await User.findOne({ where: { user_id} });
        console.log("userData: ", userData);

        if (!userData) {
            return response.status(404).json({ message: "Sign in to View the profile." });
        }

        // const userId = userData.user_id;
        // console.log("UserId----------: ", userId);

        const profileFind = await Profile.findAll();
         if (!profileFind) {     
            return response.status(404).json({ message: "Profiles not found" });
        }
        return response.status(200).json({ message: "Profile Data:", profile: profileFind });
         } catch (error) {
        console.error('Error fetching profile:', error);
        return response.status(500).json({ message: "An error occurred while fetching the profile." });
    }
};



