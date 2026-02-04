import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";

dotenv.config();

export const registerUser = async (req,res) => {
    try{
        const {FullName,Email,Password} = req.body;

        if(!FullName || !Email || !Password){
            return res.status(400).json({message:"All fields are required"});
        }

        if (Password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)){
            return res.status(400).json({message:"Invalid email format"});
        }


        const usercheck = await User.findOne({Email});
        if(usercheck){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(Password,10);

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomavatar = `https://avatar.iran.liara.run/public/${idx}.png`   

        const newUser = await User.create({FullName,Email,Password:hashedPassword,profilePic:randomavatar});


        try{
            await upsertStreamUser({id:newUser._id.toString(),name:newUser.FullName,image:newUser.profilePic || ""})
            console.log(`stream user created for ${newUser.FullName}`)
        }
        catch(error){
            console.log("error creating  in createStreamUser",error)
        }

        const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, // prevent xss attack
            secure:process.env.NODE_ENV === "production", // only allow https
            sameSite:"lax" // prevent csrf attack
         })
        return res.status(201).json({message:"User created successfully",user:newUser,token});
    }
    catch(error){
        console.log("error in register user",error);
        res.status(500).json({message:error.message});
    }    
}

export const loginUser = async (req,res) => {
    try{
        const {Email,Password} = req.body;

        if(!Email || !Password){
            return res.status(400).json({message:"All fields are required"});
        }

        const usercheck = await User.findOne({Email});

        if(!usercheck){
            return res.status(400).json({message:"User does not exist"});
        }

        const isPasswordMatch = await bcrypt.compare(Password,usercheck.Password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = jwt.sign({userId:usercheck._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, // prevent xss attack
            secure:process.env.NODE_ENV === "production", // only allow https
            sameSite:"lax" // prevent csrf attack
         })
        return res.status(201).json({message:"User created successfully",user:usercheck,token});
    }
    catch(error){
        console.log("error in register user",error);
        res.status(500).json({message:error.message});
    }    
}


export const logoutUser = async (req,res) => {
    try{
        res.clearCookie("jwt", {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax"
        })    
        return res.status(200).json({message:"User logged out successfully"});
    }
    catch(error){
        console.log("error in logout",error);
        res.status(500).json({message:error.message});
    }    
}

export const onboard = async (req,res) => {
    try{
        const userId = req.user._id;

        const {FullName,bio,nativeLanguage, learningLanguage, location} = req.body;

        if (!FullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:"All fields are required",
                missingFields:[
                    !FullName && "FullName" ,
                    !bio && "bio" ,
                    !nativeLanguage && "nativeLanguage" ,
                    !learningLanguage && "learningLanguage" ,
                    !location && "location" 
                ].filter(Boolean)
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId,{
            FullName: FullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            isOnboarded:true
        },{new:true});

        if(!updatedUser){
            return res.status(400).json({message:"User not found"});
        }

        try{
            await upsertStreamUser({id:updatedUser._id.toString(),name:updatedUser.FullName,image:updatedUser.profilePic || ""})
        }
        catch(error){
            console.log("error in upsertStreamUser",error);
            return res.status(500).json({message:error.message});
        }
        
        return res.status(200).json({success:true,user:updatedUser});
    }
    catch(error){
        console.log("error in onboard",error);
        res.status(500).json({message:error.message});
    }    
}



