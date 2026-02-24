import { LANGUAGE_TO_FLAG } from "../constants";
import { getImageSrc } from "../lib/utilis";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFriend } from "../lib/api";
import { toast } from "react-hot-toast";
import { UserMinusIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation, isPending } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed successfully");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  return (
    <div className="card bg-base-200 hover:shadow-md transition-all duration-200 group">
      <div className="card-body p-4 relative">
        <button
          className="absolute top-2 right-2 btn btn-ghost btn-xs btn-circle text-error"
          onClick={() => removeFriendMutation(friend._id)}
          disabled={isPending}
          title="Remove Friend"
        >
          {isPending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <UserMinusIcon className="size-4" />
          )}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={getImageSrc(friend.profilePic)} alt={friend.FullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.FullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${language} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
