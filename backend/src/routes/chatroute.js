import express from "express";
import { protectedRoute } from "../middleware/middleware.js";
import { getStreamTokencontroller } from "../controller/chatcontroller.js";


const route = express.Router();


route.get("/token",protectedRoute,getStreamTokencontroller)

export default route;