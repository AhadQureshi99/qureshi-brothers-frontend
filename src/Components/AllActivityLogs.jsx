import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "../utils/apiBaseUrl";

const AllActivityLogs = () => {
  const navigate = useNavigate();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/activity-logs/recent?limit=100`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            withCredentials: true,
          },
        );
        setActivityLogs(res.data);
      } catch (err) {
        setError("Failed to load activity logs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllLogs();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-[25%] bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft className="text-xl text-gray-700" />
          </button>
          <h2 className="text-2xl font-bold">All Recent Activities</h2>
        </div>

        {loading ? (
          <div className="text-gray-500 text-center py-10">
            Loading activities...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            {activityLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-10">
                No activity logs found.
              </div>
            ) : (
              <div className="grid gap-4">
                {activityLogs.map((log, idx) => (
                  <div
                    key={log._id || idx}
                    className="bg-gradient-to-b from-green-50 to-white rounded-lg p-4 shadow border border-gray-100 hover:shadow-lg transition flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-800 mb-1">
                        {log.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {log.userId && (
                        <div className="text-xs text-gray-400 mt-1">
                          User: {log.userId.name || log.userId.email || "N/A"}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0 md:ml-4 flex gap-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        {log.entityType}
                      </span>
                      {log.action && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {log.action}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllActivityLogs;
