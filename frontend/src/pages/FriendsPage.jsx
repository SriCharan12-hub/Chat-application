import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import PageLoader from "../components/pageLoader";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {friends?.length > 0 ? (
        friends.map((friend) => <FriendCard key={friend._id} friend={friend} />)
      ) : (
        <div className="col-span-full flex justify-center">
          <NoFriendsFound />
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
