import { request, response } from "express";
import Profile from "../model/profile.model.js";
import Follow from "../model/follow.model.js";
import User from "../model/user.model.js";

export const addFollow = async (request, response, next) => {
  try {
    console.log("Request.body: ", request.body);
    const { followed_id, user_id } = request.body; // followed_id = profile_id

    if (!followed_id) {
      return response.status(400).json({ message: "Profile ID is required." });
    }

    const userData = await User.findOne({ where: { user_id: user_id } });
    console.log("userData: ", userData);

    if (!userData) {
      return response
        .status(404)
        .json({ message: "Sign in to follow the profile." });
    }
    const userId = userData.user_id;
    //==========================================================================
    

    const profileData = await Profile.findOne({ where: { user_id: userId } }); // whose
    console.log("profileData: ", profileData);

    const follower_id = profileData.profile_id; // profileId = follower who

    const followercheck = await Profile.findOne({
      where: { profile_id: follower_id },
    }); // who
    console.log("profileData: ", profileData);

    if (!followercheck) {
      return response.status(404).json({ message: "Follower profile not exist" });
    }

    const follower = followercheck.profile_id;
    //=============================================================================================
    const followedcheck = await Profile.findOne({
      where: { profile_id: followed_id },
    }); // whose
    console.log("profileData: ", profileData);

    if (!followedcheck) {
        return response.status(404).json({ message: "Those profile not exist you want to follow" });
    }

    const existingFollow = await Follow.findOne({
        where: { follower_id: follower_id, followed_id: followed_id }, // follower as user profile
      });

      const followed = followedcheck.profile_id;
      
      if (existingFollow) {
        return response.status(409).json({ message: "You are already following this profile." });
      }

    const follow = await Follow.create({
      follower_id: follower, // who
      followed_id: followed,//whose
      status: 1,
    });

    return response.status(200).json({message: "You are successfully following the profile.",
      data: follow,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal server problem..." });
  }
};

export const unfollow = async (request, response, next) => {
  try {
    console.log("Request.body: ", request.body);
    const { followed_id } = request.body;

    const userData = await User.findOne({ where: { user_id } });
    if (!userData) {
      return response
        .status(404)
        .json({ message: "Sign in to unfollow the profile." });
    }

    if (!followed_id) {
      return response.status(400).json("Profile ID is required.");
    }

    const profileData = await Profile.findOne({ where: { user_id } });
    console.log("profileData: ", profileData); // profile

    if (!profileData) {
      return response
        .status(404)
        .json({ message: "Create a profile to unfollow others." });
    }

    const profile_id = profileData.profile_id;
    console.log("Profile_id: ", profile_id);

    // Update the follow status to unfollow
    const followEntry = await Follow.findOne({
      where: { followed_id, follower_id: profile_id },
    });
    if (!followEntry) {
      return response
        .status(404)
        .json({ message: "You are not following this profile." });
    }

    // Update the status to unfollow
    await followEntry.update({ status: 0 });

    return response
      .status(200)
      .json({ message: "You have unfollowed the profile." });
  } catch (err) {
    console.log(err);
    return response
      .status(500)
      .json({ error: "Internal server problem...", err });
  }
};

export const following = async(request,response,next)=>{
  try{
    const {user_id,profile_id} = request.query;
    console.log(request.query);

    const userData = await User.findOne({where:{user_id:user_id}});
    console.log("userData: ",userData);
    if(!userData){
  return response.status(404).json({message:'Please sign in for view the followers'});
}

const profileData = await Profile.findOne({ where: { profile_id: profile_id } }); // whose
console.log("profileData: ", profileData);
if(!profileData){
  return response.status(404).json({message:"Profile not found."})
}

const follower_id = profileData.profile_id; // profileId = follower who

const followData = await Follow.findAll({
  where: { follower_id: follower_id},
  include:[
    {
      model:Profile,
      as:'profile',
      attributes:['profile_id', 'name', 'profileImg_URL','email'],

    }
  ]
});

if (!followData) {
  return response.status(409).json({ message: "Something went wrong...." });
}
return response.status(200).json({message:"Followers are: ", followers:followData})

}catch(err){
    console.log(err);
    return response.status(500).json({message:"Internal server problem..."})
  }
}

export const chatFollow = async(request,response,next)=>{
  try{
    const {user_id} = request.query;
    console.log(request.query);

    const userData = await User.findOne({where:{user_id:user_id}});
    console.log("userData: ",userData);
    if(!userData){
  return response.status(404).json({message:'Please sign in for view the followers'});
}
  const existpro  = await Profile.findOne({where:{user_id}})
  console.log("existpro: ",existpro);
  if(!existpro){
    return response.status(404).json({message:"Profile not found."})
  } 
  console.log("existpro.profile_id: ",existpro.profile_id);
  const profile_id = existpro.profile_id;

  const profileData = await Profile.findOne({ where: { profile_id: profile_id } }); // whose
  console.log("profileData: ", profileData);
  if(!profileData){
    return response.status(404).json({message:"Profile not found."})
  }

const follower_id = profileData.profile_id; // profileId = follower who

const followData = await Follow.findAll({
  where: { follower_id: follower_id},
  include:[
    {
      model:Profile,
      as:'profile',
      attributes:['profile_id', 'name', 'profileImg_URL','bio'],

    }
  ]
});

if (!followData) {
  return response.status(409).json({ message: "Something went wrong...." });
}
return response.status(200).json({message:"Followers are: ", followers:followData})

}catch(err){
    console.log(err);
    return response.status(500).json({message:"Internal server problem..."})
  }
}
