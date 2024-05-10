import { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/AuthContext";

function ProfileCard() {
  const { user } = useUser();
  const [liveIn, setLiveIn] = useState("");
  const [workAt, setWorkAt] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Successfully logged out");
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");

        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error: " + error);
    }
  };

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
          setLiveIn(data.liveIn);
          setWorkAt(data.workAt);
          setBio(data.bio);
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Logout error: " + error);
      }
    };
    fetchProfile();
  }, [user]);
  return (
    <>
      <div className="card w-[17rem] bg-base-100 shadow-xl m-2 px-8 mt-6">
        <div className="flex flex-col items-start justify-start">
          <div className="text-lg font-semibold flex justify-between items-center w-full">
            <h2>Profile Info</h2>
            <UserInfo />
          </div>
          <div className="flex flex-col justify-start mt-2">
            {liveIn && (
              <div className="flex gap-2">
                <h2 className="font-semibold text-md">Live in </h2>
                <h2 className="text-md">{liveIn}</h2>
              </div>
            )}

            {workAt && (
              <div className="flex gap-2 mt-1">
                <h2 className="font-semibold text-md">Works at </h2>
                <h2 className="text-md">{workAt}</h2>
              </div>
            )}
          </div>
          {bio && (
            <div className="mt-1 leading-tight mb-5 text-sm">
              <h2 className="font-semibold text-md">Bio </h2>
              {bio}
            </div>
          )}
          <button
            className="py-2 px-4 bg-violet-800 text-white rounded-lg ml-auto my-4"
            onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;
