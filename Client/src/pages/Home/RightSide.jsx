// import RecentFollowers from "../../components/RecentFollowers";
import ProfileCard from "../../components/Home/ProfileCard";
// import SearchItem from "../../components/SearchItem";
function RightSide() {
  return (
    <div className="h-screen bg-white">
      <div className="min-w-[19rem] bg-white flex flex-col justify-center items-center pt-5">
        {/* <SearchItem /> */}
        <ProfileCard />
        {/* <RecentFollowers /> */}
      </div>
    </div>
  );
}

export default RightSide;
