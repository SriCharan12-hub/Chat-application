import axiosInstance from "./axios";

export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/register", signupData);
  return res.data;
};

export const verifyEmail = async (verificationData) => {
  const res = await axiosInstance.post("/auth/verify-email", verificationData);
  return res.data;
};

export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};

export const verifyMFA = async (mfaData) => {
  const res = await axiosInstance.post("/auth/verify-mfa", mfaData);
  return res.data;
};

export const logout = async (logoutData) => {
  const res = await axiosInstance.post("/auth/logout", logoutData);
  return res.data;
};

export const loginWithGoogle = async (credential) => {
  const res = await axiosInstance.post("/auth/google", { credential });
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("error fetching auth user", error);
    return null;
  }
};

export const completeOnboarding = async (onboardingData) => {
  const res = await axiosInstance.put("/auth/onboard", onboardingData);
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await axiosInstance.put("/auth/update-profile", profileData);
  return res.data;
};

export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  console.log(res);
  return res.data;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get(`/users/friend-requests`);
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`,
  );
  return res.data;
};

export const rejectFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(
    `/users/friend-request/${requestId}/reject`,
  );
  return res.data;
};

export const removeFriend = async (friendId) => {
  const res = await axiosInstance.delete(`/users/friend/${friendId}`);
  return res.data;
};

export async function getStreamToken() {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}
