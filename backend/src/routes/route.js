import express from "express";
import  { registerUser,loginUser,logoutUser,onboard } from "../controller/authcontroller.js";

import { protectedRoute } from "../middleware/middleware.js";

const route = express.Router();

route.post('/register',registerUser)
route.post('/login',loginUser)
route.post('/logout',logoutUser)

route.post('/onboarding',protectedRoute,onboard)


route.get('/me',protectedRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user})
})
export default route;

