import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import LeftSide from "../Home/LeftSide";
import ProfileSide from "./ProfileSide";
import RightSide from "./RightSide";
import { useEffect } from "react";

function Profile() {
  const { user, isUserLoading } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/login");
    }
  }, [user, isUserLoading, navigate]);
  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return null;
  }
  return (
    <div>
      {user ? (
        <div className="flex justify-between items-center bg-slate-50">
          <div className=" md:ml-[1.5rem] lg:mr-[22rem] m-3 w-full">
            <ProfileSide />
          </div>
          <div className="lg:block hidden fixed top-0 right-0 h-full overflow-y-auto custom-scrollbar">
            <RightSide />
          </div>
        </div>
      ) : (
        "..."
      )}
    </div>
  );
}

export default Profile;
