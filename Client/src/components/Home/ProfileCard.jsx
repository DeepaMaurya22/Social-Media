import { Link } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import RecentFollowers from "../RecentFollowers";

function ProfileCard() {
  const { user } = useUser();
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPage, setCoverPage] = useState(null);
  const [error, setError] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = user.username;
        const response = await fetch(
          `http://localhost:3000/api/users/profile/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFollowerCount(data.follower.length);
          setFollowingCount(data.following.length);
          setCoverPage(data.coverPage);
          setProfilePic(data.profilePic);
        } else {
          setError("Failed to fetch follower count");
        }
      } catch (error) {
        console.error("Error fetching follower count:", error);
        setError("An error occurred while fetching follower count");
      }
    };
    fetchProfile();
  }, [user, shouldRefetch]);

  const triggerRefetch = () => {
    setShouldRefetch((prev) => !prev); // Toggle to trigger `useEffect`
  };

  return (
    <div>
      <div className="card w-[17rem] bg-base-100 shadow-md m-2">
        <figure>
          <img
            src={
              coverPage ||
              "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890458/coverImages/f1kyhyghkblg3ggaoagv.jpg"
            }
            alt="Image"
            className="h-[7rem] w-full max-w-md object-cover"
          />
        </figure>
        <img
          src={
            profilePic ||
            "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890456/profilePics/bruzxwebz2nvve6jhjzn.jpg"
          }
          alt="Image"
          className="w-20 rounded-full top-[4.5rem] left-[6rem] absolute border shadow-md"
        />
        <div className="flex flex-col items-center justify-center mt-11">
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-xs">{user.email}</div>
          <hr className="m-2 bg-black" />
          <div className="flex items-center justify-center gap-2 mb-4 border-y-2 p-3 border-slate-200 w-3/4 mx-2">
            <div className="text-center border-r-2 border-slate-200 pr-5">
              {error ? (
                <span style={{ color: "red" }}>{error}</span>
              ) : (
                <>
                  <h3 className="text-md">
                    {followerCount !== null ? followerCount : "-"}
                  </h3>
                  <h3 className="text-slate-500 text-sm">Followers</h3>
                </>
              )}
            </div>
            <div className="text-center pl-4">
              <h3 className="text-md">
                {followingCount !== null ? followingCount : "-"}
              </h3>
              <h3 className="text-slate-500 text-sm">Following</h3>
            </div>
          </div>
          <div className="mb-3">
            <Link to="/profile" className="link link-hover font-normal">
              My Profile
            </Link>
          </div>
        </div>
      </div>
      <RecentFollowers refetch={triggerRefetch} />
    </div>
  );
}

export default ProfileCard;
