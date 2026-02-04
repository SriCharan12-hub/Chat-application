import { generateStreamToken } from "../lib/stream.js"

export const getStreamTokencontroller = async (req,res) => {
    try{
        const token = await generateStreamToken(req.user._id);
        return res.status(200).json({token});
    }
    catch(error){
        console.log("error in getStreamToken",error);
        return res.status(500).json({message:error.message});
    }
}