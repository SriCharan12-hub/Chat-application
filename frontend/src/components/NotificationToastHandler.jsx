import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStreamToken, getFriendRequests } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

const NotificationToastHandler = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const chatClientRef = useRef(null);
  const prevIncomingCountRef = useRef(0);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Polling for friend requests every 10 seconds
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
    refetchInterval: 10000,
  });

  // Handle Friend Request Notification
  useEffect(() => {
    if (friendRequests?.incomingRequests) {
      const currentCount = friendRequests.incomingRequests.length;
      if (currentCount > prevIncomingCountRef.current) {
        // Find the new request(s)
        const newRequests = friendRequests.incomingRequests.slice(
          prevIncomingCountRef.current,
        );
        newRequests.forEach((req) => {
          toast.success(`New friend request from ${req.sender.FullName}`, {
            duration: 4000,
            icon: "👋",
          });
        });
      }
      prevIncomingCountRef.current = currentCount;
    }
  }, [friendRequests]);

  // Handle Stream Chat Message Notification
  useEffect(() => {
    const initStream = async () => {
      if (!tokenData?.token || !authUser || chatClientRef.current) return;

      try {
        const client = StreamChat.getInstance(
          import.meta.env.VITE_STREAM_API_KEY,
        );

        // Connect user if not already connected
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.FullName,
              image: authUser.profilePic,
            },
            tokenData.token,
          );
        }

        chatClientRef.current = client;

        // Listen for new messages globally
        client.on("notification.message_new", (event) => {
          // Don't show toast if we are already in the chat page for this channel
          const isChatPage = window.location.pathname.includes(
            `/chat/${event.message.user.id}`,
          );

          if (!isChatPage && event.message.user.id !== authUser._id) {
            toast.success(
              `New message from ${event.message.user.name}: ${event.message.text.substring(0, 30)}${event.message.text.length > 30 ? "..." : ""}`,
              {
                duration: 4000,
                icon: "💬",
              },
            );
            // Also invalidate appropriate queries
            queryClient.invalidateQueries({ queryKey: ["friends"] });
          }
        });
      } catch (error) {
        console.error("Error in NotificationToastHandler Stream setup:", error);
      }
    };

    initStream();

    return () => {
      // We don't necessarily want to disconnect here if this is global,
      // but we should clean up listeners if the component unmounts.
      if (chatClientRef.current) {
        chatClientRef.current.off("notification.message_new");
      }
    };
  }, [tokenData, authUser, queryClient]);

  return null; // This component doesn't render anything
};

export default NotificationToastHandler;
