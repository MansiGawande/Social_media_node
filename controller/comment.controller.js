import { request, response } from "express";
import Comment from "../model/comment.model.js";
import User from "../model/user.model.js";
import Profile from "../model/profile.model.js";
import Post from "../model/post.model.js";

export const addCom = async(request,response,next)=>{
    try{
        console.log(request.body)
        const {user_id,post_id,comment} = request.body;

        const userData = await User.findOne({where:{user_id}});
        console.log("userData: ",userData) // user
        if(!userData){
        return response.status(404).json({message:"Sign in for Comment the post"})
        }
        const userId = userData.user_id;
        console.log("User_id: ",user_id);

        if(!post_id){
            return response.status(500).json("Post is not available.")
        }

        const profileData  = await Profile.findOne({where:{user_id:userId}});
        console.log("profileData1: ",profileData) //profile
        if(!profileData){
            return response.status(401).json({message:"Create the Profile for put the Comment on  post."})
        }
        const profileId = profileData.profile_id;
        console.log("Profile_id: ",profileId);


        console.log("Profile_data2",profileData);

        const newComment  = await Comment.create({
            profile_id:profileId,
            post_id,
            comment
        })
        return response.status(200).json({message:"Comment is here: ",data:newComment
            //  ,profile:profileData,
            })    

    }catch(err){
        console.log(err);
    }
}

export const prevCom = async (request, response, next) => {
    try {
      console.log(request.query);
      const { user_id, post_id } = request.query;
  
      const userData = await User.findOne({ where: { user_id } });
      console.log("User Data: ", userData);
      if (!userData) {
        return response.status(404).json({ message: "Sign in to comment on the post." });
      }
  
      if (!post_id) {
        return response.status(400).json({ message: "Post ID is not available." })
      }
    
      const prevComments = await Comment.findAll({
        where: { post_id },
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: ['profile_id', 'name', 'profileImg_URL'], 
          },
        ],
      });
  
      console.log("Existing Comments: ", prevComments);
      if (!prevComments || prevComments.length === 0) {
        return response.status(404).json({ message: "No comments found on this post." });
      }
  
      return response.status(200).json({ message: "Comments retrieved successfully.", comments: prevComments,});
    } catch (err) {
      console.log("Error in fetching data: ", err);
      return response.status(500).json({ message: "Error fetching comments." });
    }
  };
  