import { request, response } from "express";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Post from "../model/post.model.js";
import Likes from "../model/likes.model.js";

export const likes = async(request,response,next)=>{
    try{
        console.log(request.body)
        const {user_id} = request.body;

        const userData = await User.findOne({where:{user_id}});
        console.log("userData: ",userData) // user
        if(!userData){
            return response.status(404).json({message:"Sign in for Like the post"})
        }
        const userId = userData.user_id;
        console.log("User_id: ",user_id);

        const profileData = await Profile.findOne({where:{user_id:userId}});
        console.log("profileData: ",profileData) //profile
        if(!profileData){
            return response.status(500).json({message:"Create the Profile for Like the post."})
        }
        const profile_id = profileData.profile_id;
        console.log("profile_id: ",profile_id);

        const postData = await Post.findOne({where:{profile_id}})
        console.log("postData: ",postData) //post
        if(!postData){
            console.log("Post is required for Like")
        }
        const postId = postData.post_id;
        console.log("post_id",postId);

        if(userId && postId){
           await  Likes.create({
                user_id:userId,
                post_id:postId,
            })
        return response.status(200).json({message:"you are successfully like the post..."})    
        }
     }catch(err){
        console.log(err);
        return response.status(500).json({error:"Internal server problem...",err})
    }
}