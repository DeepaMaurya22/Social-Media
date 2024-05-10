import { Link, useLocation } from "react-router-dom";
import { RiHome3Line } from "react-icons/ri";
import {
  MdOutlineAddPhotoAlternate,
  MdOutlinePeopleAlt,
  MdOutlineChat,
} from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

function LeftSide() {
  const [activeTab, setActiveTab] = useState("");
  const location = useLocation();
  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = navItems.find((item) => item.path === currentPath);
    setActiveTab(matchingTab ? matchingTab.key : "");
  }, [location]);

  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <RiHome3Line className="text-2xl mr-2" />,
      path: "/",
    },
    {
      key: "createPost",
      label: "Create Post",
      icon: <MdOutlineAddPhotoAlternate className="text-2xl mr-2" />,
      path: "/create-post",
    },
    {
      key: "profile",
      label: "My Profile",
      icon: <IoPersonOutline className="text-2xl mr-2" />,
      path: "/profile",
    },
    {
      key: "profiles",
      label: "All Profiles",
      icon: <MdOutlinePeopleAlt className="text-2xl mr-2" />,
      path: "/profiles",
    },
    {
      key: "messages",
      label: "Messages",
      icon: <MdOutlineChat className="text-2xl mr-2" />,
      path: "/chat",
    },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="py-7 w-[18rem] min-h-full bg-base-100 text-lg flex flex-col gap-5 px-5 border shadow-r-2xl">
          <div className="m-4 text-2xl font-bold">Social</div>
          {navItems.map((item) => (
            <li
              key={item.key}
              className={`${
                activeTab === item.key ? "bg-violet-600 text-white" : ""
              } hover:bg-violet-100 hover:text-violet-900 rounded-lg p-2 transition-all ease-in-out duration-400`}
              onClick={() => handleNavClick(item.key)}
            >
              <Link to={item.path} className="flex p-1">
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftSide;
