import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  CameraIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  LoaderIcon,
} from "lucide-react";
import { useState } from "react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { isLoading, authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formstate, setFormstate] = useState({
    FullName: authUser?.FullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile completed. Please login again.");
      logoutMutation();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomavatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormstate({ ...formstate, profilePic: randomavatar });
    toast.success("Random Avatar Generated");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formstate.bio.trim()) {
      return toast.error("Bio cannot be empty");
    }
    if (!formstate.FullName.trim()) {
      return toast.error("FullName cannot be empty");
    }
    if (!formstate.location.trim()) {
      return toast.error("location cannot be empty");
    }
    onboardingMutation(formstate);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*Profile Pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Image preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formstate.profilePic ? (
                  <img
                    src={formstate.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className=" flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN*/}
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-accent"
                  type="button"
                  onClick={handleRandomAvatar}
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/*FUll name*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={formstate.FullName}
                onChange={(e) =>
                  setFormstate({ ...formstate, FullName: e.target.value })
                }
              />
            </div>

            {/*Bio*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                placeholder="Bio"
                className="textarea textarea-bordered w-full"
                value={formstate.bio}
                onChange={(e) =>
                  setFormstate({ ...formstate, bio: e.target.value })
                }
              ></textarea>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/*Native Language*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formstate.nativeLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select Native Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/*Learning Language*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formstate.learningLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select Learning Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/*Location*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  placeholder="Location"
                  className="input input-bordered w-full pl-10"
                  value={formstate.location}
                  onChange={(e) =>
                    setFormstate({ ...formstate, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/*Submit BTN*/}
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs"
                disabled={isPending}
              >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className=" animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
