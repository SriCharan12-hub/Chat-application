import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import { toast } from "react-hot-toast";
import { NAME_REGEX, LOCATION_REGEX } from "../lib/utilis";
import { CameraIcon, LoaderIcon, ShipWheelIcon, X } from "lucide-react";
import { LANGUAGES } from "../constants";

const EditProfileModal = ({ authUser, onClose }) => {
  const queryClient = useQueryClient();
  const [previewImg, setPreviewImg] = useState(authUser?.profilePic || "");
  const [formstate, setFormstate] = useState({
    FullName: authUser?.FullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: null, // Only set if changed
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormstate({ ...formstate, profilePic: reader.result });
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formstate.bio.trim()) return toast.error("Bio cannot be empty");
    if (!NAME_REGEX.test(formstate.FullName))
      return toast.error("Full Name must contain only alphabets and spaces");
    if (!LOCATION_REGEX.test(formstate.location))
      return toast.error(
        "Location must contain only alphabets, spaces and commas",
      );

    updateProfileMutation(formstate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-base-200 w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost"
          >
            <X className="size-5" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden relative group">
                {previewImg ? (
                  <img
                    src={previewImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
                <label
                  htmlFor="edit-profile-upload"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <CameraIcon className="size-8 text-white" />
                </label>
                <input
                  type="file"
                  id="edit-profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm opacity-70">Click to change image</p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formstate.FullName}
                onChange={(e) =>
                  setFormstate({ ...formstate, FullName: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={formstate.bio}
                onChange={(e) =>
                  setFormstate({ ...formstate, bio: e.target.value })
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formstate.nativeLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      nativeLanguage: e.target.value,
                    })
                  }
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formstate.learningLanguage}
                  onChange={(e) =>
                    setFormstate({
                      ...formstate,
                      learningLanguage: e.target.value,
                    })
                  }
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formstate.location}
                onChange={(e) =>
                  setFormstate({ ...formstate, location: e.target.value })
                }
              />
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
