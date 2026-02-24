import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
// import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/pageLoader";

const CallPage = () => {
  const { id: callId } = useParams();
  const { authUser, isLoading } = useAuthUser();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing call client...");
        const user = {
          id: authUser._id,
          name: authUser.FullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        console.log("joined call successfully");
        setCall(callInstance);
        setClient(videoClient);
      } catch (error) {
        console.log("Error joining call", error);
        toast.error("Error joining call");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <div className="absolute top-4 left-4 z-50">
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-circle btn-ghost bg-base-100/50 hover:bg-base-100"
                >
                  <ArrowLeft className="size-6" />
                </button>
              </div>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Call not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;

export const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/");
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};
