import ProfileCard from "../../components/Profile/ProfileCard";
import SearchItem from "../../components/SearchItem";
import RecentFollowers from "../../components/RecentFollowers";

function RightSide() {
  return (
    <div className="h-screen bg-white">
      <div className="min-w-[19rem] bg-white flex flex-col justify-center items-center">
        <SearchItem />
        <ProfileCard />
        <RecentFollowers />
      </div>
    </div>
  );
}

export default RightSide;
