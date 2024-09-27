import { request, response } from "express";
import User from "../model/user.model.js"
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs"

export const signUp = async(request, response, next) => {
    try{
     console.log(request.body);
     const existingUser = await User.findOne({ where:{username: request.body.username} });
     console.log("existingUser=====================",existingUser);

     if (existingUser) {
          return response.status(400).json({ message: "Account already exists. Please sign in" });
         }
         
   const newUser =  await User.create({
         name: request.body.name,
         username: request.body.username,
         password: request.body.password,
     })
         .then(result => {
             return response.status(200).json({ data: result.dataValues, message: "User successfully created" })
         }).catch(err => {
             console.log(err);
             return response.status(500).json({ error: "Internal sertver problem" });
         })
    }catch(err){
     console.log("Error in user creation");
     return response.status(500).json({error:"Internal server problem"});
    }
 }

export const signIn = async (request, response, next) => {
    console.log("Sign in called");
    const { username, password } = request.body;
    console.log("username:", username, "password:", password);
    try {
        let user = await User.findOne({ where: { username }, raw: true });
        console.log("user: ",user)
        if (user) {
            console.log("User found:", user);
            // Ensure you have a method to compare the password
            const isPasswordValid = await User.checkPassword(password, user.password);

            if (isPasswordValid) {

                const userData = {
                    user_id: user.user_id,
                    name: user.name,
                    username: user.username
                };
                if (!process.env.SECRET_KEY) {
                    console.error("SECRET_KEY is not defined in environment variables.");
                    return response.status(500).json({ error: "Internal server error." });
                }

                // Generate the token here
                const token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7d' });

                return response.status(200).json({ message: "Sign in Success...", data: userData, token });
            } else {
                return response.status(401).json({ error: "Unauthorized User" });
            }
        } else {
            return response.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        console.error("Error during sign in:", err);
        return response.status(500).json({ error: "Internal server problem..." });
    }
};


export const generateToken = (request,response,next)=>{
    const { username } = request.body;
if (!username) {
        return response.status(400).json({ message: "Username is required" });
    }
    const payload = { username };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
    // const token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '7d' });

    
    console.log(`${username} ${token}`);
    return response.status(200).json({ message: "Token created successfully", token });
}


