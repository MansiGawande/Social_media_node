import Post from "../model/post.model.js"
export const createPost = async (request, response) => {
    try {
        const { mediaType, description, user_id } = request.body;
        const media_url = request.file ? request.file.path : null;

        if (!media_url) {
            return response.status(400).json({ error: "Media file is required" });
        }
     const newPost = await Post.create({ mediaType, media_url, description, user_id });

        return response.status(201).json({
            message: "Post uploaded successfully", data: newPost });
    } catch (err) {
        console.error("Error in createPost: ", err);
        return response.status(500).json({ error: "Internal server problem" });
    }
};
