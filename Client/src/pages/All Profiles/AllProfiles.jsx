import { useEffect, useState } from "react";
import Post from "../../components/All Profiles/Post";
import SearchItem from "../../components/SearchItem";

function AllProfiles() {
  const [userCount, setUserCount] = useState(0);
  const [userprofile, setUserProfile] = useState([]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/all-profiles`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        // console.log(data);
        setUserProfile(data);
        // console.log(data.length);
        setUserCount(data.length);
      } catch (error) {
        console.error("Error fetching follower count:", error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <div className="ml-5 mt-5">
      <div className="text-2xl font-semibold">All Profiles</div>
      <SearchItem />
      <div className="flex flex-wrap gap-5 justify-center">
        {userprofile.map((profile) => (
          <Post key={profile._id} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export default AllProfiles;
