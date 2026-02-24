import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize, Minimize } from "lucide-react";
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chatContainerRef = useRef(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // run only when user available
  });

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!chatContainerRef.current) return;

    if (!document.fullscreenElement) {
      chatContainerRef.current.requestFullscreen().catch((err) => {
        toast.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

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
    <div
      className={`w-full ${isFullScreen ? "h-screen bg-base-100" : "h-[93vh]"} overflow-hidden`}
      ref={chatContainerRef}
    >
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <div className="flex flex-col h-full w-full relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-3 left-4 z-50 btn btn-ghost btn-circle"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div className="absolute top-1 right-16 z-50 flex gap-2">
              <button
                onClick={toggleFullScreen}
                className="btn btn-ghost btn-circle"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullScreen ? (
                  <Minimize className="size-6" />
                ) : (
                  <Maximize className="size-6" />
                )}
              </button>
            </div>
            <CallButton handleVideoCall={handleVideoCall} />
            <div className="flex-1 flex flex-col min-h-0">
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
