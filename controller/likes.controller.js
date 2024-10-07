import { request, response } from "express";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Post from "../model/post.model.js";
import Likes from "../model/likes.model.js";

export const addlikes = async(request,response,next)=>{
    try{
        console.log(request.body)
        const {user_id,post_id} = request.body;

        const userData = await User.findOne({where:{user_id}});
        console.log("userData: ",userData) // user
        if(!userData){
            return response.status(404).json({message:"Sign in for Like the post"})
        }
    const userId = userData.user_id;
    console.log("User_id: ",userId);
        if(!post_id){
            return response.status(500).json("Post is not available.")
        }

         const profileData = await Profile.findOne({where:{user_id:userId}});
        console.log("profileData: ",profileData) //profile
        if(!profileData){
            return response.status(500).json({message:"Create the Profile for Like the post."})
        }
        const profile_id = profileData.profile_id;
        console.log("profile_id: ",profile_id);

           await Likes.create({
            profile_id,
            post_id,
            })
        return response.status(200).json({message:"you are successfully like the post..."})    
        
     }catch(err){
        console.log(err);
        return response.status(500).json({error:"Internal server problem...",err})
    }
}

export const removeLike  = async(req,res,next)=>{
        try {
            const { user_id, post_id } = req.body;
    
            const userData = await User.findOne({ where: { user_id } });
            if (!userData) {
                return res.status(404).json({ message: "User not found. Please sign in." });
            }
    
            const profileData = await Profile.findOne({ where: { user_id } });
            if (!profileData) {
                return res.status(400).json({ message: "Create a profile to unlike a post." });
            }
    
            const profile_id = profileData.profile_id;
    
            // Find the like record to remove
            const likeToRemove = await Likes.findOne({ where: { profile_id, post_id } });
            if (!likeToRemove) {
                return res.status(404).json({ message: "Like not found." });
            }
    
            await likeToRemove.destroy();
    
            return res.status(200).json({ message: "You have successfully unliked the post." });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server problem.", err });
        }
    };
    