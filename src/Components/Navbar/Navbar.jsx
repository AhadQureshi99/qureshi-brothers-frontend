import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { clearMessages } from "../../features/users/userSlice";
import {
  getAuthUser,
  logout,
  uploadProfilePicture,
} from "../../features/users/userSlice";
import { API_URL } from "../../features/users/userService";
const logo = "/components_logo.png";
import { TiBell } from "react-icons/ti";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { Link } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, success } = useSelector(
    (state) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const lastSuccessRef = useRef(null);
  const lastErrorRef = useRef(null);
  const timeoutsRef = useRef([]);
  const lastToastIdRef = useRef(null);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // fetch notification counts: pending requests + recent admin adds
  const fetchNotifCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const reqs = await fetch("/api/expenses/requests", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .catch(() => ({ requests: [] }));
      const expensesRes = await fetch("/api/expenses/", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .catch(() => ({ expenses: [] }));
      const pending = (reqs.requests || []).length;
      // recent admin adds in last 24 hours
      const recentCut = Date.now() - 24 * 60 * 60 * 1000;
      const recentAdminAdds = (expensesRes.expenses || []).filter((e) => {
        const createdAt = new Date(e.createdAt || e.date).getTime();
        return createdAt >= recentCut && e.createdBy?.role === "admin";
      }).length;
      setNotifCount(pending + recentAdminAdds);
    } catch (err) {
      console.error("notif fetch failed", err);
    }
  };

  useEffect(() => {
    fetchNotifCount();
    const id = setInterval(fetchNotifCount, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, []);

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const token = localStorage.getItem("token");
      const reqsRes = await axios
        .get("/api/expenses/requests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(() => ({ data: { requests: [] } }));
      const expensesRes = await axios
        .get("/api/expenses/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(() => ({ data: { expenses: [] } }));

      const requests = (reqsRes.data?.requests || []).map((r) => ({
        id: r._id,
        kind: "request",
        requestType: r.requestType,
        requestedBy: r.requestedBy,
        payload: r.payload,
        createdAt: r.createdAt,
        expenseId: r.expenseId,
      }));

      // recent admin adds: last 24 hours
      const cut = Date.now() - 24 * 60 * 60 * 1000;
      const recentAdds = (expensesRes.data?.expenses || [])
        .filter((e) => {
          const createdAt = new Date(e.createdAt || e.date).getTime();
          return createdAt >= cut && e.createdBy?.role === "admin";
        })
        .map((e) => ({
          id: e._id,
          kind: "added",
          expenseName: e.expenseName,
          amount: e.amount,
          createdBy: e.createdBy,
          createdAt: e.createdAt || e.date,
        }));

      const items = [...requests, ...recentAdds].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifItems(items);
    } catch (err) {
      console.error("load notifications failed", err);
      toast.error("Failed to load notifications");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleBellClick = async () => {
    const next = !showNotifDropdown;
    setShowNotifDropdown(next);
    if (next) await loadNotifications();
  };

  const handleApproveReject = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/expenses/requests/${requestId}/handle`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Done");
      // refresh both count and dropdown
      fetchNotifCount();
      await loadNotifications();
    } catch (err) {
      console.error("handle request failed", err);
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  useEffect(() => {
    console.log("API_URL:", API_URL);
    console.log("User state:", user);
    console.log("Token:", localStorage.getItem("token"));
    if (user?.profilePicture) {
      console.log("Profile picture URL:", `${API_URL}${user.profilePicture}`);
    }
    if (isAuthenticated && !user) {
      dispatch(getAuthUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Show toasts for success and error messages and clear them afterwards
  useEffect(() => {
    // avoid duplicate toasts (React StrictMode may double-render effects)
    if (success) {
      if (lastSuccessRef.current !== success) {
        // dismiss any existing toasts and clear pending timers so old messages won't appear
        toast.dismiss();
        (timeoutsRef.current || []).forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
        lastSuccessRef.current = null;

        lastSuccessRef.current = success;
        // show short toast (1s) and capture id
        const id = toast.success(success, { duration: 1000 });
        lastToastIdRef.current = id;
        // clear the message in store so it doesn't re-trigger
        dispatch(clearMessages());
        // reset lastSuccessRef after toast disappears
        const t = setTimeout(() => {
          // ensure the specific toast is dismissed (fallback)
          try {
            if (id) toast.dismiss(id);
          } catch (e) {}
          if (lastSuccessRef.current === success) lastSuccessRef.current = null;
          if (lastToastIdRef.current === id) lastToastIdRef.current = null;
        }, 1200);
        timeoutsRef.current.push(t);
      }
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      if (lastErrorRef.current !== error) {
        // dismiss existing toasts and clear timers
        toast.dismiss();
        (timeoutsRef.current || []).forEach((t) => clearTimeout(t));
        timeoutsRef.current = [];
        lastErrorRef.current = null;

        lastErrorRef.current = error;
        const id = toast.error(error, { duration: 1000 });
        lastToastIdRef.current = id;
        dispatch(clearMessages());
        const t = setTimeout(() => {
          try {
            if (id) toast.dismiss(id);
          } catch (e) {}
          if (lastErrorRef.current === error) lastErrorRef.current = null;
          if (lastToastIdRef.current === id) lastToastIdRef.current = null;
        }, 1200);
        timeoutsRef.current.push(t);
      }
    }
  }, [error, dispatch]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      (timeoutsRef.current || []).forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file in handleFileChange:", file);
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        console.log("Invalid file type. Please use JPEG or PNG.");
        setSelectedFile(null);
        setPreviewImage(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.log("File size exceeds 5MB limit.");
        setSelectedFile(null);
        setPreviewImage(null);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    console.log("Upload triggered with selectedFile:", selectedFile);
    if (selectedFile) {
      console.log("File details:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });
      dispatch(uploadProfilePicture(selectedFile)).then((action) => {
        console.log("Dispatch result:", action);
        if (action.meta.requestStatus === "fulfilled") {
          dispatch(getAuthUser());
          setIsModalOpen(false);
          setPreviewImage(null);
          setSelectedFile(null);
        }
      });
    } else {
      console.log("No file to upload");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  // Build profile picture URL safely. The backend may return a full absolute URL
  // (e.g. https://api.cloudandroots.com/Uploads/...) or a relative path. Avoid
  // concatenating API_URL with an already-absolute URL which causes invalid
  // requests.
  const getProfileImageUrl = (profilePicture) => {
    const placeholder = "https://via.placeholder.com/150?text=Profile";
    if (!profilePicture) return placeholder;
    // Always use the full backend URL for profile pictures
    // Remove any leading slashes to avoid double slashes
    const cleanPath = profilePicture.replace(/^\/+/, "");
    return `https://api.cloudandroots.com/uploads/profilePictures/${cleanPath}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-white to-green-700 px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="w-14 h-14" />
        <div>
          <h1 className="text-3xl font-semibold text-black">
            {location.pathname === "/candidates-cv"
              ? "Candidates CV"
              : location.pathname === "/candidate"
              ? "Candidate"
              : location.pathname === "/allied-form"
              ? "Allied Form"
              : location.pathname === "/visa-form"
              ? "Visa Form"
              : location.pathname === "/undertaking-letter"
              ? "Undertaking Letter"
              : location.pathname === "/expense"
              ? "Expense"
              : location.pathname === "/deposit-slip"
              ? "Deposit Slip"
              : location.pathname === "/nbpchallan"
              ? "NBP CHALLAN"
              : location.pathname === "/contract-letter"
              ? "Contract Letter"
              : "Dashboard"}
          </h1>
          <p className="text-sm text-black font-semibold">
            Welcome back! Here's what's happening with your visa processes.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/candidates-cv"
          className="flex items-center gap-2 bg-white text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow hover:shadow-md cursor-pointer"
        >
          <BsFileEarmarkArrowUp className="text-gray-600 font-bold" />
          UPLOAD CV
        </Link>

        <label className="flex items-center gap-2 bg-white text-sm px-3 py-1.5 rounded-md border border-gray-300 shadow hover:shadow-md cursor-pointer">
          <BsFileEarmarkArrowUp className="text-gray-600 font-bold" />
          Report
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "Report")}
          />
        </label>

        <div className="relative bg-white rounded-full px-3 py-3">
          <div onClick={handleBellClick} className="cursor-pointer">
            <TiBell className="text-black text-2xl" />
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifCount}
              </span>
            )}
          </div>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-12 w-96 bg-white rounded shadow-lg border border-gray-300 z-50 p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-gray-500">
                  {notifItems.length} items
                </div>
              </div>
              {notifLoading ? (
                <div className="text-center text-sm text-gray-500">
                  Loading...
                </div>
              ) : notifItems.length === 0 ? (
                <div className="text-sm text-gray-500">No notifications</div>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto">
                  {notifItems.map((item) => (
                    <li
                      key={item.id}
                      className="p-2 border rounded flex justify-between items-start"
                    >
                      <div className="text-sm">
                        {item.kind === "request" ? (
                          <>
                            <div className="font-medium">
                              {item.requestType.toUpperCase()} request
                            </div>
                            <div className="text-xs text-gray-600">
                              From: {item.requestedBy?.username || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-700">
                              Payload: {JSON.stringify(item.payload || {})}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-medium">New Expense added</div>
                            <div className="text-xs text-gray-600">
                              {item.expenseName} —{" "}
                              {Number(item.amount).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">
                              By: {item.createdBy?.username}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {item.kind === "request" ? (
                          <>
                            <button
                              onClick={() =>
                                handleApproveReject(item.id, "approve")
                              }
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleApproveReject(item.id, "reject")
                              }
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              navigate("/expense");
                              setShowNotifDropdown(false);
                            }}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={
                isAuthenticated && user?.profilePicture
                  ? getProfileImageUrl(user.profilePicture)
                  : "https://via.placeholder.com/150?text=Profile"
              }
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
          </label>
          <div className="text-left">
            <p className="text-base font-medium text-white">
              {isAuthenticated && user ? user.username : "Guest"}
            </p>
            <p className="text-xs text-white">
              {isAuthenticated && user ? user.role : "N/A"}
            </p>
          </div>
        </div>

        {isAuthenticated && user?.role === "superadmin" && (
          <div>
            <Link
              to="/super-admin"
              className="ml-4 bg-white text-black px-3 py-1 rounded-md"
            >
              Super Admin
            </Link>
          </div>
        )}

        {isAuthenticated &&
          user?.role !== "superadmin" &&
          user?.permissions && (
            <div>
              <Link
                to="/super-admin"
                className="ml-4 bg-white text-black px-3 py-1 rounded-md"
              >
                Manage
              </Link>
            </div>
          )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Upload Profile Picture
            </h2>
            <input
              type="file"
              accept="image/jpeg,image/png"
              className="mb-4 w-full"
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-md ${
                  selectedFile
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-white text-sm">Uploading...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}
    </div>
  );
};

export default Navbar;
