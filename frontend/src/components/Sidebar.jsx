import { Link, useLocation } from "react-router";
import { useEffect } from "react";
import { getImageSrc } from "../lib/utilis";
import useAuthUser from "../hooks/useAuthUser";
import useFriendStore from "../store/useFriendStore";
import {
  ShipWheelIcon,
  HomeIcon,
  BellIcon,
  UserIcon,
  BotIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { friendRequests, getFriendRequests } = useFriendStore();
  const location = useLocation();

  const currentPath = location.pathname;

  useEffect(() => {
    if (authUser) {
      getFriendRequests();
    }
  }, [getFriendRequests, authUser]);

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <BotIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Chatbox
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""}`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`}
        >
          <UserIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""}`}
        >
          <div className="relative">
            <BellIcon className="size-5 text-base-content opacity-70" />
            {friendRequests.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 size-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {friendRequests.length}
              </span>
            )}
          </div>
          <span>Notifications</span>
        </Link>
      </nav>

      {/*USer profile Section*/}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={getImageSrc(authUser?.profilePic)} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.FullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
