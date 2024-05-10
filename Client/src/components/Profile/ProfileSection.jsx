import { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext";
import Post from "../Home/Post";
import { Link } from "react-router-dom";

function ProfileSection() {
  const { user } = useUser();
  const [follower, setFollower] = useState(null);
  const [following, setFollowing] = useState(null);
  const [postCount, setPostCount] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPage, setCoverPage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFollowerFollowing = async (req, res) => {
      const username = user.username;
      const response = await fetch(
        `http://localhost:3000/api/users/profile/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setFollower(data.follower?.length);
      setFollowing(data.following?.length);
      setCoverPage(data.coverPage);
      setProfilePic(data.profilePic);
    };
    fetchFollowerFollowing();
  }, [user]);

  useEffect(() => {
    const fetchUserPost = async (req, res) => {
      const id = user._id;
      const response = await fetch(
        `http://localhost:3000/api/posts/post/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      // console.log(data.posts);
      setPosts(data.posts);
      setPostCount(data.postCount);
      // console.log(posts);
    };
    fetchUserPost();
  }, [user]);

  return (
    <div className="w-full align-middle">
      <div className="card w-full min-w-full bg-base-100 shadow-md mt-3 overflow-hidden">
        <div
          className="w-full h-[15rem] bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              coverPage ||
              "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890458/coverImages/f1kyhyghkblg3ggaoagv.jpg"
            })`,
          }}
        ></div>
        <img
          src={
            profilePic ||
            "https://res.cloudinary.com/dnrt42dyu/image/upload/v1714890456/profilePics/bruzxwebz2nvve6jhjzn.jpg"
          }
          alt={"Image"}
          className="w-24 rounded-full top-[12rem] right-[50%] translate-x-1/2 absolute border-2 shadow-md"
        />
        <div className="flex flex-col items-center justify-center mt-14">
          <div className="text-lg font-semibold">{user.name}</div>
          {/* <div className="text-sm font-semibold">{user.username}</div> */}
          <div className="text-xs">{user.email}</div>
          <hr className="m-2 bg-black" />
          <div className="flex items-center justify-evenly gap-2 mb-4 border-y-2 p-4 border-slate-200  w-3/4 mx-2">
            <div className="text-center border-r-2 border-slate-200  pr-10">
              <h3 className="text-lg">{follower}</h3>
              <h3 className="text-slate-500 text-sm">Followers</h3>
            </div>
            <div className="pl-4 text-center border-r-2 border-slate-200  pr-10">
              <h3 className="text-lg">{following}</h3>
              <h3 className="text-slate-500 text-sm">Following</h3>
            </div>
            <div className="text-center pl-10">
              <h3 className="text-lg">{postCount}</h3>
              <h3 className="text-slate-500 text-sm">Posts</h3>
            </div>
          </div>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post._id}>
          <Post post={post} />
        </div>
      ))}
      {posts.length == 0 && (
        <div className="p-14 text-center">
          <h2 className="text-2xl mb-5">No Posts Yet</h2>
          <Link
            to="/"
            className="link bg-violet-800 text-white px-5 py-3 rounded-lg"
          >
            Home Page
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
