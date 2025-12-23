import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createAdmin as apiCreateAdmin } from "../../features/users/userService";
import axios from "axios";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const SuperAdmin = () => {
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user?.role !== "superadmin") return;
    // fetch pending expense requests
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const r = await axios.get("/api/expenses/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(r.data?.requests || []);
      } catch (err) {
        console.error("fetch requests failed", err);
      }
    };
    fetchRequests();
  }, [user]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCreateAdmin(
        form.username,
        form.email,
        form.password
      );
      toast.success(res.data.message || "Admin created");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleApproveReject = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/expenses/requests/${requestId}/handle`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Handled");
      // refresh requests list
      const r = await axios.get("/api/expenses/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(r.data?.requests || []);
    } catch (err) {
      console.error("handle request failed", err);
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // Allow access if user is superadmin or has any permissions
  if (user?.role !== "superadmin" && !user?.permissions) {
    return (
      <div className="p-6">
        Access denied. You do not have permission to access this page.
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h2 className="text-2xl font-semibold mb-4">Super Admin Panel</h2>

      {/* Show admin section if superadmin or has permission */}
      {user?.role === "superadmin" && (
        <section className="mb-6">
          <h3 className="font-semibold">Create Admin</h3>
          <form onSubmit={handleCreateAdmin} className="space-y-2">
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
              className="border p-2 w-full"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="border p-2 w-full"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              type="password"
              className="border p-2 w-full"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Admin
            </button>
          </form>
        </section>
      )}

      {/* Show access links to pages user has permission for */}
      <section className="mb-6">
        <h3 className="font-semibold mb-4">Available Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Initial Registration */}
          {user?.permissions?.candidateManagement?.initialRegistration
            ?.view && (
            <Link
              to="/admin/candidate-management/initial-registration"
              className="p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition"
            >
              <h4 className="font-semibold text-blue-900">
                Initial Registration
              </h4>
              <p className="text-sm text-blue-700">
                View and manage candidates
              </p>
            </Link>
          )}

          {/* Manage Users */}
          {user?.permissions?.adminArea?.manageUsers?.view && (
            <Link
              to="/admin/manage-users"
              className="p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition"
            >
              <h4 className="font-semibold text-green-900">Manage Users</h4>
              <p className="text-sm text-green-700">
                Create and manage admin users
              </p>
            </Link>
          )}

          {/* Manage Roles */}
          {user?.permissions?.adminArea?.manageRole?.view && (
            <Link
              to="/admin/manage-role"
              className="p-4 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition"
            >
              <h4 className="font-semibold text-purple-900">Manage Roles</h4>
              <p className="text-sm text-purple-700">
                Configure roles and permissions
              </p>
            </Link>
          )}

          {/* Configuration */}
          {user?.permissions?.configuration?.configuration?.view && (
            <Link
              to="/admin/configuration"
              className="p-4 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100 transition"
            >
              <h4 className="font-semibold text-yellow-900">Configuration</h4>
              <p className="text-sm text-yellow-700">
                Manage system configuration
              </p>
            </Link>
          )}

          {/* Accounting & Finance */}
          {user?.permissions?.accountingFinance?.accountingFinance?.view && (
            <Link
              to="/admin/accounting"
              className="p-4 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 transition"
            >
              <h4 className="font-semibold text-indigo-900">
                Accounting & Finance
              </h4>
              <p className="text-sm text-indigo-700">Financial management</p>
            </Link>
          )}

          {/* Employer Management */}
          {user?.permissions?.employerManagement?.employerManagement?.view && (
            <Link
              to="/admin/employer-management"
              className="p-4 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition"
            >
              <h4 className="font-semibold text-red-900">
                Employer Management
              </h4>
              <p className="text-sm text-red-700">Manage employers and jobs</p>
            </Link>
          )}
        </div>
      </section>

      {/* Show expense requests if superadmin */}
      {user?.role === "superadmin" && (
        <section>
          <h3 className="font-semibold mb-3">Pending Expense Requests</h3>
          <div className="border p-3 max-h-72 overflow-auto">
            {requests.length === 0 ? (
              <div className="text-sm text-gray-500">No pending requests</div>
            ) : (
              <ul className="space-y-2">
                {requests.map((rq) => (
                  <li
                    key={rq._id}
                    className="border p-2 rounded flex justify-between items-start"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {rq.requestType.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600">
                        By: {rq.requestedBy?.username || "Unknown"} (
                        {rq.requestedBy?.email || ""})
                      </div>
                      <div className="text-xs text-gray-700 mt-2">
                        Payload: {JSON.stringify(rq.payload || {})}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: {rq.status}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApproveReject(rq._id, "approve")}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveReject(rq._id, "reject")}
                        className="px-2 py-1 bg-red-600 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> User roles and permissions are managed in the{" "}
          <a
            href="/admin/manage-role"
            className="underline font-semibold hover:text-blue-900"
          >
            Manage Roles & Users
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
};

export default SuperAdmin;
