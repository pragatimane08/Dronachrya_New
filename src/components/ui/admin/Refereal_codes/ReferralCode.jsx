import React, { useEffect, useState } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { ReferralCodeRepository } from "../../../../api/repository/admin/ReferralCode.repository";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const REWARD_TYPES = [
  { value: "subscription_bonus", label: "Subscription Bonus (extend days)" },
  { value: "contact_view_bonus", label: "Contact View Bonus" },
  { value: "coupon", label: "Coupon Code Reward" },
  { value: "discount", label: "Discount Percent/Value" },
];

const ITEMS_PER_PAGE = 15;
const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "rewarded", label: "Rewarded" },
  { value: "not_rewarded", label: "Not Rewarded" },
];

const ReferralCode = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [rewardingId, setRewardingId] = useState(null);

  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingGenerate, setSubmittingGenerate] = useState(false);
  const [submittingReward, setSubmittingReward] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    status: 'all',
    rewardType: '',
    minReferrals: '',
    maxReferrals: ''
  });

  const [rewardForm, setRewardForm] = useState({
    reward_type: "",
    reward_value: "",
  });

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const data = await ReferralCodeRepository.getAll();
      const flat = data.flatMap((ref) =>
        ref.referredUsers.map((r) => ({
          ...r,
          referrerId: ref.referrerId,
          referrerEmail: ref.referrerEmail,
          referrerName: ref.referrerName,
          referredCount: ref.referredCount,
          referralId: r.referralId,
        }))
      );
      setReferrals(flat);
      setFilteredReferrals(flat);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch referral codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const applyFiltersAndSearch = () => {
    let result = [...referrals];
    
    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter((ref) => {
        return (
          ref.code?.toLowerCase().includes(term) ||
          ref.referrerName?.toLowerCase().includes(term) ||
          ref.referrerEmail?.toLowerCase().includes(term) ||
          ref.name?.toLowerCase().includes(term) ||
          ref.email?.toLowerCase().includes(term) ||
          ref.status?.toLowerCase().includes(term) ||
          (ref.rewardGiven ? "yes" : "no").includes(term) ||
          ref.rewardType?.toLowerCase().includes(term) ||
          ref.rewardValue?.toLowerCase().includes(term) ||
          ref.referredCount?.toString().includes(term)
        );
      });
    }

    // Apply reward status filter
    if (filters.status !== 'all') {
      result = result.filter(ref => 
        filters.status === 'rewarded' ? ref.rewardGiven : !ref.rewardGiven
      );
    }

    // Apply reward type filter
    if (filters.rewardType) {
      result = result.filter(ref => 
        ref.rewardType?.toLowerCase() === filters.rewardType.toLowerCase()
      );
    }

    // Apply min referrals filter
    if (filters.minReferrals) {
      result = result.filter(ref => 
        ref.referredCount >= parseInt(filters.minReferrals)
      );
    }

    // Apply max referrals filter
    if (filters.maxReferrals) {
      result = result.filter(ref => 
        ref.referredCount <= parseInt(filters.maxReferrals)
      );
    }

    setFilteredReferrals(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, referrals, filters]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredReferrals].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredReferrals(sortedData);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      rewardType: '',
      minReferrals: '',
      maxReferrals: ''
    });
    setSearchTerm("");
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setSubmittingGenerate(true);
    try {
      await ReferralCodeRepository.create();
      await fetchReferrals();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create referral code");
    } finally {
      setSubmittingGenerate(false);
    }
  };

  const onRewardFieldChange = (e) => {
    const { name, value } = e.target;
    setRewardForm((prev) => ({ ...prev, [name]: value }));
  };

  const openRewardModal = (id) => {
    setRewardingId(id);
    setRewardForm({ reward_type: "", reward_value: "" });
    setShowRewardModal(true);
  };

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    if (!rewardForm.reward_type || !rewardForm.reward_value) {
      alert("Please select reward type and value.");
      return;
    }
    setSubmittingReward(true);
    try {
      await ReferralCodeRepository.reward(rewardingId, {
        rewardType: rewardForm.reward_type,
        rewardValue: rewardForm.reward_value,
      });
      await fetchReferrals();
      setShowRewardModal(false);
      setRewardingId(null);
    } catch (err) {
      console.error("Error rewarding referral:", err);
      alert("Failed to reward referral.");
    } finally {
      setSubmittingReward(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const generateCSVContent = (data) => {
    const headers = [
      'Code', 'Referrer Name', 'Referrer Email', 'Referred Count', 
      'Referred Email', 'Status', 'Rewarded', 'Reward Type', 
      'Reward Value', 'Referred At'
    ].join(',');
    
    const rows = data.map(ref => [
      ref.code,
      ref.referrerName,
      ref.referrerEmail,
      ref.referredCount,
      ref.email,
      ref.status,
      ref.rewardGiven ? 'Yes' : 'No',
      ref.rewardType || '-',
      ref.rewardValue || '-',
      ref.referredAt ? new Date(ref.referredAt).toLocaleString() : '-'
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
    
    return [headers, ...rows].join('\n');
  };

  const generateExcelFile = (data) => {
    const formattedData = data.map(ref => ({
      'Code': ref.code,
      'Referrer Name': ref.referrerName,
      'Referrer Email': ref.referrerEmail,
      'Referred Count': ref.referredCount,
      'Referred Email': ref.email,
      'Status': ref.status,
      'Rewarded': ref.rewardGiven ? 'Yes' : 'No',
      'Reward Type': ref.rewardType || '-',
      'Reward Value': ref.rewardValue || '-',
      'Referred At': ref.referredAt ? new Date(ref.referredAt).toLocaleString() : '-'
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Referrals');
    return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  };

  const generatePDF = (data) => {
    const doc = new jsPDF({
      orientation: 'landscape'
    });
    
    doc.setFontSize(16);
    doc.text('Referral Codes Report', 14, 15);
    doc.setFontSize(10);
    
    const tableData = data.map(ref => [
      ref.code || '-',
      ref.referrerName || '-',
      ref.referrerEmail || '-',
      ref.referredCount || '0',
      ref.email || '-',
      ref.status || '-',
      ref.rewardGiven ? 'Yes' : 'No',
      ref.rewardType || '-',
      ref.rewardValue || '-',
      ref.referredAt ? new Date(ref.referredAt).toLocaleDateString() : '-'
    ]);
    
    const headers = [
      'Code', 
      'Referrer Name', 
      'Referrer Email', 
      'Referred Count',
      'Referred Email',
      'Status',
      'Rewarded',
      'Reward Type',
      'Reward Value',
      'Referred At'
    ];
    
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 20,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 20 }
    });
    
    return doc;
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSVContent(filteredReferrals);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'referrals.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    const excelData = generateExcelFile(filteredReferrals);
    const blob = new Blob([excelData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'referrals.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    try {
      const pdf = generatePDF(filteredReferrals);
      pdf.save('referrals_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const totalPages = Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE);
  const paginatedReferrals = filteredReferrals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Referral Codes</h1>

        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="relative flex-grow max-w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${showFilters ? 'bg-teal-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} font-semibold px-4 py-2 rounded whitespace-nowrap transition-colors`}
            >
              <Filter size={16} />
              Filters
            </button>
            <div className="relative group">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded whitespace-nowrap">
                Export
              </button>
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <button
                  onClick={handleDownloadCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  Download CSV
                </button>
                <button
                  onClick={handleDownloadExcel}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  Download Excel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  Download PDF
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded whitespace-nowrap"
            >
              + Add Referral
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Reward Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {FILTER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Reward Type</label>
                <select
                  name="rewardType"
                  value={filters.rewardType}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="">All Types</option>
                  {REWARD_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Min Referrals</label>
                <input
                  type="number"
                  name="minReferrals"
                  placeholder="Minimum"
                  value={filters.minReferrals}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Max Referrals</label>
                <input
                  type="number"
                  name="maxReferrals"
                  placeholder="Maximum"
                  value={filters.maxReferrals}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium px-3 py-1 rounded hover:bg-teal-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-x-auto flex-1">
              <div className="min-w-full overflow-hidden">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50 text-gray-600 text-left">
                    <tr>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('code')}
                      >
                        <div className="flex items-center gap-1">
                          Code
                          <SortIcon columnKey="code" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('referrerName')}
                      >
                        <div className="flex items-center gap-1">
                          Referrer Name
                          <SortIcon columnKey="referrerName" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('referrerEmail')}
                      >
                        <div className="flex items-center gap-1">
                          Referrer Email
                          <SortIcon columnKey="referrerEmail" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('referredCount')}
                      >
                        <div className="flex items-center gap-1">
                          Referred Count
                          <SortIcon columnKey="referredCount" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-1">
                          Referred Email
                          <SortIcon columnKey="email" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <SortIcon columnKey="status" />
                        </div>
                      </th>
                      <th className="px-4 py-3 border-b whitespace-nowrap">Rewarded</th>
                      <th className="px-4 py-3 border-b whitespace-nowrap">Reward Type</th>
                      <th className="px-4 py-3 border-b whitespace-nowrap">Reward Value</th>
                      <th 
                        className="px-4 py-3 border-b whitespace-nowrap cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('referredAt')}
                      >
                        <div className="flex items-center gap-1">
                          Referred At
                          <SortIcon columnKey="referredAt" />
                        </div>
                      </th>
                      <th className="px-4 py-3 border-b whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedReferrals.map((ref) => (
                      <tr key={ref.referralId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.code}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.referrerName}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.referrerEmail}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.referredCount}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.email}</td>
                        <td className="px-4 py-3 border-b capitalize whitespace-nowrap text-sm">{ref.status}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">
                          {ref.rewardGiven ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.rewardType || "-"}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">{ref.rewardValue || "-"}</td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">
                          {ref.referredAt && new Date(ref.referredAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 border-b whitespace-nowrap text-sm">
                          {!ref.rewardGiven && (
                            <button
                              onClick={() => openRewardModal(ref.referralId)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                            >
                              Reward
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!paginatedReferrals.length && (
                      <tr>
                        <td colSpan="11" className="px-4 py-4 text-center text-gray-500 border-b">
                          {searchTerm || Object.values(filters).some(f => f !== '' && f !== 'all') 
                            ? "No matching referral codes found." 
                            : "No referral codes found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredReferrals.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredReferrals.length)} of{" "}
                  {filteredReferrals.length} entries
                </div>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === page
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      } whitespace-nowrap`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Referral Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border shadow-md relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h2 className="text-center text-lg font-bold text-blue-900 mb-6">Add Referral</h2>
              <form onSubmit={handleGenerateSubmit} className="space-y-4">
                <p className="text-gray-600">
                  Click <strong>Submit</strong> to generate a new referral code.
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingGenerate}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {submittingGenerate ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reward Modal */}
        {showRewardModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border shadow-md relative">
              <button
                onClick={() => setShowRewardModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h2 className="text-center text-lg font-bold text-blue-900 mb-6">Reward Referral</h2>
              <form onSubmit={handleRewardSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-sm">Reward Type</label>
                  <select
                    name="reward_type"
                    value={rewardForm.reward_type}
                    onChange={onRewardFieldChange}
                    className="w-full border p-2 rounded text-sm"
                    required
                  >
                    <option value="">Select reward type</option>
                    {REWARD_TYPES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Reward Value</label>
                  <input
                    type="text"
                    name="reward_value"
                    placeholder="e.g. 7 Days Extra, 5, 25%, COUPON25"
                    value={rewardForm.reward_value}
                    onChange={onRewardFieldChange}
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowRewardModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReward}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                  >
                    {submittingReward ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCode;