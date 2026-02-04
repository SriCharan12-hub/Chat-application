import {StreamChat} from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

if (!api_key || !api_secret) {
    console.log("Missing Stream API key or secret");
}


const streamclient = StreamChat.getInstance(api_key,api_secret);    

export const upsertStreamUser = async (userData) => {
    try{
        await streamclient.upsertUsers([userData]);
        return userData;
    }
    catch(error){
        console.log("error in createStreamUser",error);
        
    }
}

export const generateStreamToken = async (userId) => {
    try{
        const userIdStr = userId.toString();
        const token = streamclient.createToken(userIdStr);
        return token;
    }
    catch(error){
        console.log("error in generateStreamToken",error);
    }
}