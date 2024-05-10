import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/AuthContext";
import PostSide from "./PostSide";
import RightSide from "./RightSide";
import { useEffect } from "react";

function Home() {
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
        <div className="flex justify-between bg-slate-50">
          <div className="flex-1 ml-[1.5rem] lg:mr-[20rem] ">
            <PostSide />
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

export default Home;
