import React, { useEffect, useState } from "react";
import { useUser } from "../../context/AuthContext";

function Conversation({ data, currentUserId }) {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const otherUserId = data.members.find((id) => id !== currentUserId);
    // console.log("otherUserId");
    // console.log(otherUserId);

    try {
      const getUserData = async (req, res) => {
        const response = await fetch(
          `http://localhost:3000/api/users/${otherUserId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        setUserData(data);
      };
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, [data, currentUserId]);
  return (
    <div>
      <div className="rounded-full flex gap-5 items-center">
        <img
          src={userData?.profilePic}
          alt="Pic"
          className="rounded-full bg-gray-700 w-14 h-14"
        />
        <div>
          <div className="text-lg font-semibold">{userData?.name}</div>
          <div className="text-sm">Online</div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Conversation;
