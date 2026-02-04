import User from "../model/User.js";
import FriendRequest from "../model/FriendRequest.js";

export const getRecommendedUsers = async (req,res) => {
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and:[{_id:{$ne:currentUserId}},{_id:{$nin:currentUser.friends}}]
        }) 
        return res.status(200).json(recommendedUsers)
    }
    catch(error){
        console.log("error in getRecommendedUsers",error)
        return res.status(500).json({message:error.message})
    }
}

export const getMyFriends = async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select("friends").populate("friends","FullName profilePic nativeLanguage learningLanguage location")
        return res.status(200).json(user.friends )
    }
    catch(error){
        console.log("error in getMyFriends",error)
        return res.status(500).json({message:error.message})
    }
}

export const sendFriendRequest = async (req,res) => {
    try{
        const myId = req.user.id;
        const { id:recipientId } = req.params;
        
        if (myId === recipientId){
            return res.status(400).json({message:"You cannot send a friend request to yourself"})
        }

        const  recipient= await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"recipient not found"})
        }

        if (recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        const existingFriendRequest = await FriendRequest.findOne({$or:[{sender:myId,recipient:recipientId},{sender:recipientId,recipient:myId}]})
        if (existingFriendRequest){
            return res.status(400).json({message:"You have already sent a friend request to this user"})
        }

        const friendRequest = await FriendRequest.create({sender:myId,recipient:recipientId})
        return res.status(200).json(friendRequest)
    }
    catch(error){
        console.log("error in sendFriendRequest",error)
        return res.status(500).json({message:error.message})
    }
}

export const  acceptFriendRequest = async (req,res) => {
    try{
        
        const { id:requestId } = req.params;
        
     
        const  friendrequest = await FriendRequest.findById(requestId);
        if(!friendrequest){
            return res.status(404).json({message:"Friend request not found"})
        }

        if (friendrequest.recipient.toString() !== req.user.id){
            return res.status(401).json({message:"you are not authorized to accept this friend request "})
        }

        if (friendrequest.status === "accepted") {
            return res.status(400).json({ message: "Friend request already accepted" });
        }

        friendrequest.status = "accepted";
        await friendrequest.save();

        //add each user to the others friend array
        await User.findByIdAndUpdate(friendrequest.sender, { $addToSet: { friends: friendrequest.recipient } });
        await User.findByIdAndUpdate(friendrequest.recipient, { $addToSet: { friends: friendrequest.sender } });

        return res.status(200).json({ message: "Friend request accepted" });

    //     const existingFriendRequest = await FriendRequest.findOne({$or:[{sender:myId,recipient:recipientId},{sender:recipientId,recipient:myId}]})
    //     if (!existingFriendRequest){
    //         return res.status(404).json({message:"Friend request not found"})
    //     }

    //     const friendRequest = await FriendRequest.create({sender:myId,recipient:recipientId})
    //     return res.status(200).json(friendRequest)
    // }
    }
    catch(error){
        console.log("error in acceptFriendRequest",error)
        return res.status(500).json({message:error.message})
    }
}

export const getFriendRequests = async (req,res) => {
    try{
        const incomingRequests = await FriendRequest.find({recipient:req.user.id,status:"pending"}).populate("sender","FullName profilePic nativeLanguage learningLanguage")
        const acceptedRequests = await FriendRequest.find({recipient:req.user.id,status:"accepted"}).populate("sender","FullName profilePic ")
        return res.status(200).json({incomingRequests,acceptedRequests})
    }
    catch(error){
        console.log("error in getFriendRequests",error)
        return res.status(500).json({message:error.message})
    }
    
}

export const getOutgoingFriendRequests = async (req,res) => {
    try{
        const outgoingRequests = await FriendRequest.find({sender:req.user.id,status:"pending"}).populate("recipient","FullName profilePic nativeLanguage learningLanguage")
        return res.status(200).json(outgoingRequests)
    }
    catch(error){
        console.log("error in getOutgoingFriendRequests",error)
        return res.status(500).json({message:error.message})
    }
    
}




