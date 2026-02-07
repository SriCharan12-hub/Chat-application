import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useFriendStore = create((set) => ({
  friendRequests: [],
  isLoading: false,
  error: null,

  getFriendRequests: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users/friend-requests");
      set({ friendRequests: res.data.incomingRequests });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch friend requests" });
      console.error("Error fetching friend requests:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFriendStore;
