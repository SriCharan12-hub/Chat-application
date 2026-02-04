import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import {
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  Thread,
  Chat,
} from "stream-chat-react";
import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import CallButton from "../components/CallButton";
import ChatLoader from "../components/ChatLoader";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // run only when user available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing chat client...");

        const client = StreamChat.getInstance(
          import.meta.env.VITE_STREAM_API_KEY,
        );
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.FullName,
            image: authUser.profilePic,
          },
          tokenData.token,
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        // you and me
        // if i start the chat => channelId : [myId,yourId]
        // if you start the chat => channelId : [yourId,myId]
        // so we need to sort the channelId to make it unique

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChannel(currChannel);
        setChatClient(client);
      } catch (error) {
        console.log("Error initializing chat client", error);
        toast.error("Error initializing chat client");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      navigate(`/call/${channel.id}`);
    }
  };

  if (loading || !chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-3 left-4 z-50 btn btn-ghost btn-circle"
            >
              <ArrowLeft className="size-6" />
            </button>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
