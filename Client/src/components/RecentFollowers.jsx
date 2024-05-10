import React, { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";

function Following({ refetch }) {
  const { user } = useUser();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowingMap, setIsFollowingMap] = useState({}); // A map to track if the current user follows each follower

  useEffect(() => {
    const fetchFollowers = async () => {
      const response = await fetch(
        `http://localhost:3000/api/users/followerfollowing/${user._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFollowers(data.followers);
        setFollowing(data.following);

        // Create a map to check if current user is following each follower
        const followingIds = data.following.map((followee) => followee._id);
        const isFollowingMap = {};

        data.followers.forEach((follower) => {
          isFollowingMap[follower._id] = followingIds.includes(follower._id);
        });

        setIsFollowingMap(isFollowingMap); // Set the map in state
      } else {
        console.error("Failed to fetch followers/following.");
      }
    };

    if (user) {
      fetchFollowers(); // Fetch the data when user is available
    }
  }, [user]); // Depend on `user` to fetch data when it changes

  const handleFollowUnfollow = async (followerId) => {
    const response = await fetch(
      `http://localhost:3000/api/users/follow/${followerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();

      if (isFollowingMap[followerId]) {
        setFollowing((prev) => prev.filter((id) => id !== followerId)); // Unfollow
      } else {
        setFollowing((prev) => [...prev, followerId]); // Follow
      }

      setIsFollowingMap((prev) => ({
        ...prev,
        [followerId]: !isFollowingMap[followerId], // Toggle following status
      }));
      refetch();
    } else {
      console.error("Error with follow/unfollow action.");
    }
  };

  return (
    <div>
      <div className="overflow-x-auto mt-3 p-2">
        <table className="table">
          <thead>
            <tr>
              <th>Recently Followed</th>
            </tr>
          </thead>
          <tbody>
            {followers.map((follower) => (
              <tr key={follower._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        {follower.name}
                      </div>
                      <div className="text-xs opacity-50">{follower.email}</div>
                    </div>
                  </div>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs px-3 bg-violet-600 text-white"
                    onClick={() => handleFollowUnfollow(follower._id)}
                  >
                    {isFollowingMap[follower._id] ? "Unfollow" : "Follow"}
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Following;
