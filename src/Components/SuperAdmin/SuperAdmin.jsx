import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  createAdmin as apiCreateAdmin,
  updateUserPermissions as apiUpdatePermissions,
  getAllUsers,
} from "../../features/users/userService";
import axios from "axios";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

const SuperAdmin = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [selected, setSelected] = useState(null);
  const [permittedPages, setPermittedPages] = useState([]);

  useEffect(() => {
    if (user?.role !== "superadmin") return;
    // fetch all users
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data?.users || []);
      } catch (err) {
        console.error("fetch users error", err);
      }
    };
    fetchUsers();
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

  const [requests, setRequests] = useState([]);

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
      // refresh list to include new admin
      try {
        const refreshed = await getAllUsers();
        setUsers(refreshed.data?.users || []);
      } catch (err) {
        console.error("refresh after createAdmin failed", err);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const handleUpdatePermissions = async (userId) => {
    try {
      const res = await apiUpdatePermissions(userId, permittedPages);
      toast.success(res.data.message || "Permissions updated");
      // refresh list to reflect updated permissions
      try {
        const refreshed = await getAllUsers();
        setUsers(refreshed.data?.users || []);
      } catch (err) {
        console.error("refresh after updatePermissions failed", err);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating permissions");
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

  if (user?.role !== "superadmin") {
    return <div className="p-6">Access denied.</div>;
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h2 className="text-2xl font-semibold mb-4">Super Admin Panel</h2>

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

      <section>
        <h3 className="font-semibold mb-2">Manage Users & Permissions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ul className="border p-2 max-h-64 overflow-auto">
              {users.map((u) => (
                <li
                  key={u._id}
                  className={`p-2 cursor-pointer ${
                    selected === u._id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setSelected(u._id);
                    setPermittedPages(u.permittedPages || []);
                  }}
                >
                  <div className="font-medium">
                    {u.username}{" "}
                    <span className="text-xs text-gray-500">({u.role})</span>
                  </div>
                  <div className="text-xs text-gray-600">{u.email}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {selected ? (
              <div className="border p-2">
                <h4 className="font-medium mb-2">Edit Permissions</h4>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={permittedPages.includes("/dashboard")}
                    onChange={(e) => {
                      const next = permittedPages.includes("/dashboard")
                        ? permittedPages.filter((p) => p !== "/dashboard")
                        : [...permittedPages, "/dashboard"];
                      setPermittedPages(next);
                    }}
                  />{" "}
                  Dashboard
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={permittedPages.includes("/expense")}
                    onChange={(e) => {
                      const next = permittedPages.includes("/expense")
                        ? permittedPages.filter((p) => p !== "/expense")
                        : [...permittedPages, "/expense"];
                      setPermittedPages(next);
                    }}
                  />{" "}
                  Expense
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={permittedPages.includes("/candidates-cv")}
                    onChange={(e) => {
                      const next = permittedPages.includes("/candidates-cv")
                        ? permittedPages.filter((p) => p !== "/candidates-cv")
                        : [...permittedPages, "/candidates-cv"];
                      setPermittedPages(next);
                    }}
                  />{" "}
                  Candidates CV
                </label>
                <div className="mt-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleUpdatePermissions(selected)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="border p-2">
                Select a user to edit permissions
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold mb-2">Pending Expense Requests</h3>
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
    </div>
  );
};

export default SuperAdmin;
