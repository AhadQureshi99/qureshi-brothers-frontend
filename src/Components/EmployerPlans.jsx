import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import AdminNavbar from "./AdminNavbar/AdminNavbar";

const EmployerPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    validForDays: "",
    maxJobsAllowed: "",
    supportsFeaturedJobs: true,
    allowedNumberOfFeaturedJobs: "",
    featuredJobAmount: "",
    featuredEmployerAmount: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/employer-plans/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(response.data.plans);
    } catch (error) {
      toast.error("Failed to fetch employer plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = e.nativeEvent.submitter.value; // 'save' or 'saveAndClose'
    try {
      const token = localStorage.getItem("token");
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount),
        validForDays: parseInt(formData.validForDays),
        maxJobsAllowed: parseInt(formData.maxJobsAllowed),
        allowedNumberOfFeaturedJobs: parseInt(
          formData.allowedNumberOfFeaturedJobs
        ),
        featuredJobAmount: parseFloat(formData.featuredJobAmount),
        featuredEmployerAmount: parseFloat(formData.featuredEmployerAmount),
      };

      if (editingPlan) {
        await axios.put(`/api/employer-plans/${editingPlan._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employer plan updated successfully");
      } else {
        await axios.post("/api/employer-plans/", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employer plan created successfully");
      }

      fetchPlans();

      if (action === "saveAndClose") {
        setShowForm(false);
        setEditingPlan(null);
        resetForm();
      } else {
        // For 'save', reset form only if adding new plan
        if (!editingPlan) {
          resetForm();
        }
        // For editing, keep the form open with current data
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save employer plan"
      );
      console.error(error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      amount: plan.amount.toString(),
      validForDays: plan.validForDays.toString(),
      maxJobsAllowed: plan.maxJobsAllowed.toString(),
      supportsFeaturedJobs: plan.supportsFeaturedJobs,
      allowedNumberOfFeaturedJobs: plan.allowedNumberOfFeaturedJobs.toString(),
      featuredJobAmount: plan.featuredJobAmount.toString(),
      featuredEmployerAmount: plan.featuredEmployerAmount.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employer plan?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/employer-plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employer plan deleted successfully");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete employer plan");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      validForDays: "",
      maxJobsAllowed: "",
      supportsFeaturedJobs: true,
      allowedNumberOfFeaturedJobs: "",
      featuredJobAmount: "",
      featuredEmployerAmount: "",
    });
  };

  const handleNew = () => {
    setEditingPlan(null);
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Manage Employer Plans</h1>

      {!showForm ? (
        <>
          <div className="mb-4">
            <button
              onClick={handleNew}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Max Jobs Allowed</th>
                  <th className="px-4 py-2 border">
                    Allowed Number Of Featured Job
                  </th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{plan.name}</td>
                    <td className="px-4 py-2 border">
                      {plan.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border">
                      {plan.maxJobsAllowed === -1
                        ? "Unlimited"
                        : plan.maxJobsAllowed}
                    </td>
                    <td className="px-4 py-2 border">
                      {plan.allowedNumberOfFeaturedJobs === -1
                        ? "Unlimited"
                        : plan.allowedNumberOfFeaturedJobs}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {editingPlan ? "Edit Employer Plan" : "Add/Edit Detail"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Plan Name : *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Plan Amount :
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Valid For (In days) :
                </label>
                <input
                  type="number"
                  name="validForDays"
                  value={formData.validForDays}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Maximum Jobs Allowed :
                </label>
                <input
                  type="number"
                  name="maxJobsAllowed"
                  value={formData.maxJobsAllowed}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
                <small className="text-gray-500">
                  [Maximum No of jobs, employer can post.-1 for unlimited]
                </small>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  <input
                    type="checkbox"
                    name="supportsFeaturedJobs"
                    checked={!formData.supportsFeaturedJobs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        supportsFeaturedJobs: !e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  This Plan Doesn't Support to mark a job/employer as a feature
                  job/employer
                </label>
                <small className="text-gray-500 block">
                  (If Checked, User will not be able to mark their job as
                  featured job/feature employer)
                </small>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Allowed Number Of Featured Job :
                </label>
                <input
                  type="number"
                  name="allowedNumberOfFeaturedJobs"
                  value={formData.allowedNumberOfFeaturedJobs}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
                <small className="text-gray-500">
                  [Employer will be able to mark his/her job as featured job
                  under this limitation.-1 for unlimited]
                </small>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Featured Job Amount :
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="featuredJobAmount"
                  value={formData.featuredJobAmount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
                <small className="text-gray-500">
                  (If employer exceed his/her limit of featured job request this
                  amount will be charge to the employer account.)
                </small>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Featured Employer Amount :
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="featuredEmployerAmount"
                  value={formData.featuredEmployerAmount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
                <small className="text-gray-500">
                  (This Amount will be charge if employer wants to mark him as a
                  featured employer)
                </small>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                value="save"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="submit"
                value="saveAndClose"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save & Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployerPlans;
