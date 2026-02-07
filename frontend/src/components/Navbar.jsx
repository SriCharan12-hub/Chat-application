import { useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout.js";
import ThemeSelector from "./ThemeSelector";
import { BellIcon, ShipWheelIcon, LogOut } from "lucide-react";
import { getImageSrc } from "../lib/utilis";

import { Link } from "react-router";

const Navbar = () => {
  const location = useLocation();
  const { authUser } = useAuthUser();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation, isPending, error } = useLogout();

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <nav className="bg-base-200 b0order-b border-base-300 sticky top-0 z-30 h-16 flex   items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/*Logo - only in the chat page */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Chatbox
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="size-5 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={getImageSrc(authUser?.profilePic)} alt="User Avatar" />
            </div>
          </div>

          {/*Logout Button*/}
          {/*Logout Button*/}
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => document.getElementById("logout_modal").showModal()}
          >
            <LogOut className="size-6 text-base-content opacity-70" />
          </button>

          {/* Logout Confirmation Modal */}
          <dialog id="logout_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Logout</h3>
              <p className="py-4">Are you sure you want to log out?</p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn mr-2">Cancel</button>
                  <button className="btn btn-error" onClick={handleLogout}>
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
