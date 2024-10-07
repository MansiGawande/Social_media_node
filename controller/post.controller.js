// import { request, response } from "express";
// import Post from "../model/post.model.js"
// import Profile from "../model/profile.model.js";
// import User from "../model/user.model.js";
// export const createPost = async (request, response) => {
//     try {
//         console.log(request.body.user_id);
//         const { mediaType, description, user_id } = request.body;
//         const media_url = request.file ? request.file.filename : null;
//         const postlhsView = await  Profile.findOne({where:{user_id}});
//         console.log("postlhsView: ",postlhsView)
//         if (!mediaType || !description || !user_id) {
//             return response.status(400).json({ error: "All fields are required" });
//         }
//         // const validMediaTypes = ['image', 'video'];
//         // if (!validMediaTypes.includes(mediaType)) {
//         //     return response.status(400).json({ error: "Invalid media type" });
//         // }

//         if(!postlhsView){
//             return response.status(404).json({message:"Profile not found. Please create a profile to upload posts."})
//         }

//         if (!media_url) {
//             return response.status(400).json({ error: "Media file is required" });
//         }
//         const profile_id = postlhsView.profile_id;
//         if(profile_id) {
//             const newPost = await Post.create({ mediaType, media_url, description, profile_id
//             });
//             return response.status(201).json({
//                 message: "Post uploaded successfully", data: newPost , postlhsView});
//              }

//     } catch (err) {
//         console.error("Error in createPost: ", err);
//         return response.status(500).json({ error: "Internal server problem" });
//     }
// };
//========================================================================================================

// image ko upload hone ke baad hi , sharp se resize karna hoga. naye image file ka path media_url me set karna hoga jo db me save hoga
import { request, response } from "express";
import Post from "../model/post.model.js";
import Profile from "../model/profile.model.js";
import User from "../model/user.model.js";
import sharp from "sharp";
import fs from "fs"

export const createPost = async (request, response) => {
    try {
        console.log(request.body.user_id);
        const { mediaType, description, user_id } = request.body;

        // const media_url = request.file ? request.file.filename : null;
        const media_url = request.file ? request.file.path : null;

        const postlhsView = await Profile.findOne({ where: { user_id } });
        console.log("postlhsView: ", postlhsView);

        if (!mediaType || !description || !user_id) {
            return response.status(400).json({ error: "All fields are required" });
        }
        // const validMediaTypes = ['image', 'video'];
        // if (!validMediaTypes.includes(mediaType)) {
        //     return response.status(400).json({ error: "Invalid media type" });
        // }

        if (!postlhsView) {
            return response.status(404).json({
                message:
                    "Profile not found. Please create a profile to upload posts.",
            });
        }
        if (!media_url) {
            return response.status(400).json({ error: "Media file is required" });
        }

        // Resize image using sharp
        const resizedMediaPath = `PostData/data/resized_${request.file.filename}`;
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

        const profile_id = postlhsView.profile_id;
        if (profile_id) {
            const newPost = await Post.create({
                mediaType,
                media_url: resizedMediaUrl,
                description,
                profile_id,
            });
            return response.status(201).json({
                message: "Post uploaded successfully",
                data: newPost,
                postlhsView,
            });
        }
    } catch (err) {
        console.error("Error in createPost: ", err);
        return response.status(500).json({ error: "Internal server problem" });
    }
};

//=======================================================

export const profileposts = async (request, response, next) => {
    try {
        const { user_id,profile_id} = request.query;
        console.log("user_id, profile_id: ",request.query);
        const userData = await User.findOne({ where: { user_id } });
        
        if (!userData) {
            return response.status(404).json({ error: "Sign in for view the profile" });
        }
        
        const profileData = await Profile.findOne({ where: { profile_id } });
            if (!profileData) {
            return response.status(404).json({ message: "Profile not found" });
        }
        const profileId = profileData.profile_id;
        console.log(profileId);

        const profilepost = await Post.findAll({ where: { profile_id:profileId} })
        if (profilepost) {
            return response.status(200).json({ message: "Profile & npost is here: ", data: profilepost, profile: profileData })
        }
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server Problem." })
    }
}

export const postContent = async (request, response, next) => {
    try {
        console.log(request.query);
        const { user_id } = request.query;
        console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,", request.query);

        const userData = await User.findOne({ where: { user_id } });

        if (!userData) {
            return response
                .status(404)
                .json({ error: "Sign in to view the profile" });
        }
        //select * from posts inner join profiles on  posts.profile_id = profiles.profile_id;

        // SELECT     posts.*,    profiles.profile_id,    profiles.name,    profiles.profileImg_URL FROM posts INNER JOIN profiles ON posts.profile_id = profiles.profile_id ;

        const postData = await Post.findAll({
            include: {
                model: Profile,
                attributes: ["profile_id", "name", "profileImg_URL"],
            },
            attributes: ["post_id", "mediaType", "media_url", "description", "createdAt", "updatedAt"],
        });

        if (postData.length === 0) {
            return response.status(200).json({ message: "No content available" });
        }

        return response.status(200).json({ message: "Content: ", data: postData });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal server problem." });
    }
};
