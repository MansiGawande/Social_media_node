import { request, response } from "express";
import Post from "../model/post.model.js"
import Profile from "../model/profile.model.js";
export const createPost = async (request, response) => {
    try {
        console.log(request.body.user_id);
        const { mediaType, description, user_id } = request.body;
        const media_url = request.file ? request.file.filename : null;
        const postlhsView = await  Profile.findOne({where:{user_id}});
        console.log("postlhsView: ",postlhsView)
        if (!mediaType || !description || !user_id) {
            return response.status(400).json({ error: "All fields are required" });
        }
        // const validMediaTypes = ['image', 'video'];
        // if (!validMediaTypes.includes(mediaType)) {
        //     return response.status(400).json({ error: "Invalid media type" });
        // }

        if(!postlhsView){
            return response.status(404).json({message:"Profile not found. Please create a profile to upload posts."})
        }

        if (!media_url) {
            return response.status(400).json({ error: "Media file is required" });
        }
        const profile_id = postlhsView.profile_id;
        if(profile_id) {
            const newPost = await Post.create({ mediaType, media_url, description, profile_id
            });
            return response.status(201).json({
                message: "Post uploaded successfully", data: newPost , postlhsView});
             }

    } catch (err) {
        console.error("Error in createPost: ", err);
        return response.status(500).json({ error: "Internal server problem" });
    }
};

export const profileposts = async(request,response,next)=>{
try{
    console.log(request.query);
    const {user_id} = request.query
    const profileData = await Profile.findOne({where:{user_id}});
    if(!user_id){
        return response.status(404).json({ error: "Sign in for view the profile" });
    }
    if (!profileData) {     
        return response.status(404).json({ message: "Profile not found" });
    }
    const profile_id = profileData.profile_id;
    console.log(profile_id);

    const profilepost = await Post.findAll({where:{profile_id}})
    if(profilepost){
        return response.status(200).json({message:"Profile & npost is here: ",data:profilepost,profile:profileData})
    }
}catch(err){
    console.log(err);
    return response.status(500).json({error : "Internal server Problem."})
}
}