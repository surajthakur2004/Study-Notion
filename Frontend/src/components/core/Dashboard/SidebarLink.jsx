import React from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { matchPath, NavLink, useLocation } from "react-router-dom";

function SidebarLink({ link }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const Icon = Icons[link.icon];

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
      className={`flex px-8 py-2 text-sm font-medium 
    ${
      matchRoute(link.path)
        ? "border-l-4 border-yellow-50 text-yellow-50 bg-yellow-800"
        : "bg-opacity-0 text-richblack-300"
    } transition-all duration-100`}
    >
      <div className="flex items-center gap-x-2">
        <Icon className="text-lg" />
        <span>{link.name}</span>
      </div>
    </NavLink>
  );
}

export default SidebarLink;
