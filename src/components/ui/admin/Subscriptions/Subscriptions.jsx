import React, { useState, useEffect } from "react";
import { subscriptionRepository } from "../../../../api/repository/admin/subscriptions.repository";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    plan_type: "",
    user_type: "",
  });

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    plan_name: "",
    price: "",
    duration_days: "",
    contact_limit: "",
    plan_type: "monthly",
    user_type: "student",
    features: [""],
  });

  // Update Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const entriesPerPage = 10;

  // Fetch Subscription Plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subscriptionRepository.getAllPlans();
      const data = res?.data?.plans || [];
      setPlans(data);
      setFilteredPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let result = [...plans];

    // Apply search
    if (searchTerm) {
      result = result.filter((plan) =>
        plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.plan_type) {
      result = result.filter(
        (plan) => plan.plan_type.toLowerCase() === filters.plan_type.toLowerCase()
      );
    }
    if (filters.user_type) {
      result = result.filter(
        (plan) => plan.user_type.toLowerCase() === filters.user_type.toLowerCase()
      );
    }

    setFilteredPlans(result);
    setCurrentPage(1);
  }, [plans, searchTerm, filters]);

  // Create a new plan
  const handleCreatePlan = async () => {
    try {
      const payload = {
        ...newPlan,
        price: Number(newPlan.price),
        duration_days: Number(newPlan.duration_days),
        contact_limit: Number(newPlan.contact_limit),
        features: newPlan.features.filter((f) => f.trim() !== ""),
      };
      await subscriptionRepository.createPlan(payload);
      alert("Plan created successfully");
      setIsCreateModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Failed to create plan");
    }
  };

  // Update a plan
  const handleUpdatePlan = async () => {
    try {
      const payload = {
        ...editPlan,
        price: Number(editPlan.price),
        duration_days: Number(editPlan.duration_days),
        contact_limit: Number(editPlan.contact_limit),
        features: editPlan.features.filter((f) => f.trim() !== ""),
      };
      await subscriptionRepository.updatePlan(editPlan.id, payload);
      alert("Plan updated successfully");
      setIsUpdateModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Failed to update plan");
    }
  };

  // Delete a plan
  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await subscriptionRepository.deletePlan(id);
      alert("Plan deleted successfully");
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredPlans.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Export Plans as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Subscription Plans Report", 14, 16);
    doc.autoTable({
      head: [
        [
          "Plan Name",
          "Price",
          "Duration (Days)",
          "Contact Limit",
          "Plan Type",
          "User Type",
          "Features",
        ],
      ],
      body: filteredPlans.map((plan) => [
        plan?.plan_name || "-",
        plan?.price || "-",
        plan?.duration_days || "-",
        plan?.contact_limit || "-",
        plan?.plan_type || "-",
        plan?.user_type || "-",
        Array.isArray(plan?.features)
          ? plan.features.join(", ")
          : plan?.features || "-",
      ]),
    });
    doc.save("subscription_plans.pdf");
  };

  // Export as Excel
  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPlans.map((plan) => ({
        "Plan Name": plan?.plan_name || "-",
        Price: plan?.price || "-",
        "Duration (Days)": plan?.duration_days || "-",
        "Contact Limit": plan?.contact_limit || "-",
        "Plan Type": plan?.plan_type || "-",
        "User Type": plan?.user_type || "-",
        Features: Array.isArray(plan?.features)
          ? plan.features.join(", ")
          : plan?.features || "-",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plans");
    XLSX.writeFile(workbook, "subscription_plans.xlsx");
  };

  // Export as CSV
  const exportAsCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPlans.map((plan) => ({
        "Plan Name": plan?.plan_name || "-",
        Price: plan?.price || "-",
        "Duration (Days)": plan?.duration_days || "-",
        "Contact Limit": plan?.contact_limit || "-",
        "Plan Type": plan?.plan_type || "-",
        "User Type": plan?.user_type || "-",
        Features: Array.isArray(plan?.features)
          ? plan.features.join(", ")
          : plan?.features || "-",
      }))
    );
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "subscription_plans.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      plan_type: "",
      user_type: "",
    });
    setSearchTerm("");
  };

  // Feature display component
  const FeatureDisplay = ({ features }) => {
    if (!features || !Array.isArray(features)) return "-";
    
    const [showAll, setShowAll] = useState(false);
    const visibleFeatures = showAll ? features : features.slice(0, 5);
    const hasMore = features.length > 5;

    return (
      <div 
        className="relative group"
        onMouseEnter={() => setShowAll(true)}
        onMouseLeave={() => setShowAll(false)}
      >
        <div className="text-sm text-gray-700 max-w-xs truncate">
          {visibleFeatures.join(", ")}
          {hasMore && !showAll && "..."}
        </div>
        
        {hasMore && showAll && (
          <div className="absolute z-10 mt-1 w-full max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-sm text-gray-700">
              {features.join(", ")}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Subscription Plans
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all subscription plans for students and tutors
            </p>
          </div>
        </div> */}

        {/* Combined Controls in One Line */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Plan Type Filter */}
          <div className="w-full md:w-48">
            <select
              value={filters.plan_type}
              onChange={(e) => setFilters({ ...filters, plan_type: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Plan Types</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-Yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* User Type Filter */}
          <div className="w-full md:w-40">
            <select
              value={filters.user_type}
              onChange={(e) => setFilters({ ...filters, user_type: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All Users</option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Reset Button (only shown when filters are active) */}
            {(Object.values(filters).some(Boolean) || searchTerm) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            )}

            {/* Create Plan Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:shadow-md transition-all whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Create
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all whitespace-nowrap">
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <button
                  onClick={exportAsPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Export PDF
                </button>
                <button
                  onClick={exportAsExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Export Excel
                </button>
                <button
                  onClick={exportAsCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto border rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Contacts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="animate-pulse flex justify-center">
                      <div className="h-8 w-8 bg-blue-200 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentEntries.length > 0 ? (
                currentEntries.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {plan.plan_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        ₹{plan.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">
                        {plan.duration_days} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">{plan.contact_limit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {plan.plan_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        {plan.user_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <FeatureDisplay features={plan.features} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditPlan({ ...plan });
                          if (!plan.features) plan.features = [""];
                          setIsUpdateModalOpen(true);
                        }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No plans found</p>
                      <p className="text-sm">
                        {Object.values(filters).some(Boolean) || searchTerm
                          ? "Try adjusting your filters or search"
                          : "Create a new plan to get started"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPlans.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, filteredPlans.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPlans.length}</span> plans
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className={`p-2 border rounded-lg ${currentPage === 1 ? "text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 flex items-center justify-center border rounded-lg ${currentPage === number ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
                >
                  {number}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className={`p-2 border rounded-lg ${currentPage === totalPages ? "text-gray-400 bg-gray-50" : "text-gray-700 hover:bg-gray-100"} transition-colors`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Create Plan */}
      {isCreateModalOpen && (
        <PlanModal
          title="Create New Plan"
          plan={newPlan}
          setPlan={setNewPlan}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreatePlan}
        />
      )}

      {/* Modal for Update Plan */}
      {isUpdateModalOpen && editPlan && (
        <PlanModal
          title="Update Plan"
          plan={editPlan}
          setPlan={setEditPlan}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleUpdatePlan}
        />
      )}
    </div>
  );
};

// Reusable Modal Component for Create/Update
const PlanModal = ({ title, plan, setPlan, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            className="text-white hover:text-blue-100 transition-colors"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              placeholder="Enter plan name"
              value={plan.plan_name}
              onChange={(e) => setPlan({ ...plan, plan_name: e.target.value })}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={plan.price}
                onChange={(e) => setPlan({ ...plan, price: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <input
                type="number"
                placeholder="30"
                value={plan.duration_days}
                onChange={(e) => setPlan({ ...plan, duration_days: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Limit
              </label>
              <input
                type="number"
                placeholder="100"
                value={plan.contact_limit}
                onChange={(e) => setPlan({ ...plan, contact_limit: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Type
              </label>
              <select
                value={plan.plan_type}
                onChange={(e) => setPlan({ ...plan, plan_type: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={plan.user_type}
                onChange={(e) => setPlan({ ...plan, user_type: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features
            </label>
            <div className="space-y-2">
              {plan.features?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const updated = [...plan.features];
                      updated[index] = e.target.value;
                      setPlan({ ...plan, features: updated });
                    }}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = plan.features.filter((_, i) => i !== index);
                      setPlan({ ...plan, features: updated });
                    }}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPlan({ ...plan, features: [...plan.features, ""] })
                }
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Feature
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:shadow-md transition-all"
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Subscriptions;