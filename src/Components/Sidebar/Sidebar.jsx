import React from "react";
import { useSelector } from "react-redux";
import { GoHome, GoPeople } from "react-icons/go";
import { LuFileCheck, LuGraduationCap } from "react-icons/lu";
import { FaFileArrowUp } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { PiCurrencyDollarSimpleBold } from "react-icons/pi";
import { MdOutlineSettings } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const baseStyle =
    "flex items-center gap-3 px-5 py-3 rounded-md cursor-pointer transition-all select-none";

  const { user } = useSelector((state) => state.user);

  // Helper to determine if the current user may see a path
  const canAccess = (path) => {
    if (!user) return false;
    if (user.role === "superadmin") return true;
    if (!Array.isArray(user.permittedPages)) return false;
    const perms = user.permittedPages.map((p) => (p || "").toLowerCase());
    return perms.includes((path || "").toLowerCase());
  };

  // Checks if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full min-h-screen bg-white p-4">
      {/* Dashboard */}
      {canAccess("/dashboard") && (
        <Link
          to="/dashboard"
          className={`${baseStyle} ${
            isActive("/")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <GoHome size={20} />
          <span className="text-sm font-semibold">Dashboard</span>
        </Link>
      )}

      {/* Candidates */}
      {canAccess("/candidate") && (
        <Link
          to="/candidate"
          className={`${baseStyle} mt-2 ${
            isActive("/Candidate")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <GoPeople size={20} />
          <span className="text-sm font-semibold">Candidates</span>
        </Link>
      )}

      {/* Visa Process */}
      {canAccess("/visa-form") && (
        <Link
          to="/visa-form"
          className={`${baseStyle} mt-2 ${
            isActive("/visa-form")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <LuFileCheck size={20} />
          <span className="text-sm font-semibold">Visa Form</span>
        </Link>
      )}

      {/* NAVTTC Test */}
      {canAccess("/nbpchallan") && (
        <Link
          to="/nbpchallan"
          className={`${baseStyle} mt-2 ${
            isActive("/nbpchallan")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <LuGraduationCap size={20} />
          <span className="text-sm font-semibold">NBP CHALLAN</span>
        </Link>
      )}

      {/* Protector Process */}
      {canAccess("/candidates-cv") && (
        <Link
          to="/candidates-cv"
          className={`${baseStyle} mt-2 ${
            isActive("/candidates-cv")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <FaFileArrowUp size={20} />
          <span className="text-sm font-semibold">Candidates CV</span>
        </Link>
      )}

      {/* Expenses */}
      {canAccess("/expense") && (
        <Link
          to="/expense"
          className={`${baseStyle} mt-2 ${
            isActive("/expense")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <PiCurrencyDollarSimpleBold size={20} />
          <span className="text-sm font-semibold">Expenses</span>
        </Link>
      )}

      {/* Report */}
      {canAccess("/report") && (
        <div
          className={`${baseStyle} mt-2 ${
            isActive("/report")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <FaFileAlt size={20} />
          <span className="text-sm font-semibold">Report</span>
        </div>
      )}

      {/* Settings */}
      {canAccess("/settings") && (
        <div
          className={`${baseStyle} mt-2 ${
            isActive("/settings")
              ? "bg-green-700 text-white"
              : "bg-green-100 text-black"
          }`}
        >
          <MdOutlineSettings size={20} />
          <span className="text-sm font-semibold">Settings</span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
