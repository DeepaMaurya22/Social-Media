import { Outlet } from "react-router-dom";
import LeftSide from "../pages/Home/LeftSide";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="fixed top-0 left-0 w-72 h-full overflow-y-auto bg-base-100 shadow-lg z-10 hidden md:block">
        <LeftSide />
      </div>
      <div className="flex-1 ml-72 transition-margin duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
