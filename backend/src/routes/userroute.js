import express from "express";
import { protectedRoute } from "../middleware/middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendRequests,
  getOutgoingFriendRequests,
} from "../controller/UserController.js";
const route = express.Router();

route.use(protectedRoute);

route.get("/", getRecommendedUsers);
route.get("/friends", getMyFriends);
route.post("/friend-request/:id", sendFriendRequest);
route.put("/friend-request/:id/accept", acceptFriendRequest);
route.put("/friend-request/:id/reject", rejectFriendRequest);
route.delete("/friend/:id", removeFriend);
// route.put("/friend-request/:id/accept",acceptFriendRequest)
route.get("/friend-requests", getFriendRequests);
route.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default route;
