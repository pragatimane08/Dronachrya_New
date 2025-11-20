import React, { useEffect, useState } from "react";
import { ReferralsRepository } from "../../../../api/repository/admin/ReferralCode.repository";
import { utils, writeFile } from "xlsx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// PDF Document Component
const ReferralPDF = ({ data }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Referral Program Report</Text>
        <Text style={styles.date}>Generated on: {new Date().toLocaleDateString()}</Text>
        
        {data.flatMap((referrer) =>
          referrer.referredUsers.map((user, idx) => (
            <View key={`${referrer.referrerId}-${idx}`} style={styles.row}>
              <Text style={styles.text}>
                Referrer: {referrer.referrerName} ({referrer.referrerEmail})
              </Text>
              <Text style={styles.text}>Code: {user.code || "—"}</Text>
              <Text style={styles.text}>
                Referred User: {user.name || "—"} ({user.email || "—"})
              </Text>
              <Text style={styles.text}>Status: {user.status}</Text>
              <Text style={styles.text}>
                Reward: {user.rewardGiven ? `${user.rewardType}: ${user.rewardValue}` : "Not given"}
              </Text>
              <Text style={styles.text}>
                Date: {user.referredAt ? new Date(user.referredAt).toLocaleDateString() : "—"}
              </Text>
              <View style={styles.divider} />
            </View>
          ))
        )}
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  date: { fontSize: 10, marginBottom: 20, color: '#666' },
  row: { marginBottom: 15 },
  text: { fontSize: 12, marginBottom: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 }
});

const ReferralCodes = () => {
  const [referralData, setReferralData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingReward, setEditingReward] = useState(null);
  const [rewardForm, setRewardForm] = useState({ rewardType: "", rewardValue: "" });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    rewardGiven: ""
  });

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await ReferralsRepository.getAllReferrals();
        if (response.status) {
          setReferralData(response.data);
          setFilteredData(response.data);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, referralData]);

  const applyFilters = () => {
    let result = [...referralData];

    // Apply search filter
    if (filters.search) {
  const searchTerm = filters.search.toLowerCase();
  result = result
    .map(referrer => {
      const filteredUsers = referrer.referredUsers.filter(user => 
        (user.name?.toLowerCase().includes(searchTerm) || 
         user.email?.toLowerCase().includes(searchTerm)) ||
        (referrer.referrerName?.toLowerCase().includes(searchTerm) ||
         referrer.referrerEmail?.toLowerCase().includes(searchTerm))
      );
      return filteredUsers.length > 0 
        ? { ...referrer, referredUsers: filteredUsers } 
        : null;
    })
    .filter(Boolean); // Remove null entries
}
    // Apply status filter
   // Apply status filter
if (filters.status) {
  result = result
    .map(referrer => {
      const filteredUsers = referrer.referredUsers.filter(
        user => user.status === filters.status
      );
      return filteredUsers.length > 0 
        ? { ...referrer, referredUsers: filteredUsers } 
        : null;
    })
    .filter(Boolean);
}

// Apply reward given filter
if (filters.rewardGiven) {
  const rewardFilter = filters.rewardGiven === "given";
  result = result
    .map(referrer => {
      const filteredUsers = referrer.referredUsers.filter(
        user => user.rewardGiven === rewardFilter
      );
      return filteredUsers.length > 0 
        ? { ...referrer, referredUsers: filteredUsers } 
        : null;
    })
    .filter(Boolean);
}

    setFilteredData(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRewardSubmit = async (referralId) => {
    try {
      const result = await ReferralsRepository.markRewardGiven(referralId, rewardForm);

      if (!result.status) throw new Error(result.message || "Failed to update reward");

      setReferralData((prev) =>
        prev.map((referrer) => ({
          ...referrer,
          referredUsers: referrer.referredUsers.map((user) =>
            user.referralId === referralId
              ? {
                  ...user,
                  rewardGiven: true,
                  rewardType: rewardForm.rewardType,
                  rewardValue: rewardForm.rewardValue,
                }
              : user
          ),
        }))
      );

      setEditingReward(null);
      setRewardForm({ rewardType: "", rewardValue: "" });
      alert("✅ Reward applied successfully!");
    } catch (error) {
      console.error("Error updating reward:", error);
      alert("❌ Failed to apply reward");
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredData.flatMap(referrer => 
      referrer.referredUsers.map(user => ({
        "Referrer Name": referrer.referrerName,
        "Referrer Email": referrer.referrerEmail,
        "Code": user.code || "—",
        "Referred User": user.name || "—",
        "User Email": user.email || "—",
        "Status": user.status,
        "Reward Type": user.rewardType || "—",
        "Reward Value": user.rewardValue || "—",
        "Date": user.referredAt ? new Date(user.referredAt).toLocaleDateString() : "—"
      }))
    );

    const ws = utils.json_to_sheet(dataToExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Referrals");
    writeFile(wb, "referrals.xlsx");
  };

  const exportToCSV = () => {
    const dataToExport = filteredData.flatMap(referrer => 
      referrer.referredUsers.map(user => ({
        "Referrer Name": referrer.referrerName,
        "Referrer Email": referrer.referrerEmail,
        "Code": user.code || "—",
        "Referred User": user.name || "—",
        "User Email": user.email || "—",
        "Status": user.status,
        "Reward Type": user.rewardType || "—",
        "Reward Value": user.rewardValue || "—",
        "Date": user.referredAt ? new Date(user.referredAt).toLocaleDateString() : "—"
      }))
    );

    const csvContent = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map(item => Object.values(item).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "referrals.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-300"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              name="search"
              placeholder="Search by name or email"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 text-sm"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 text-sm"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reward</label>
            <select
              name="rewardGiven"
              className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 text-sm"
              value={filters.rewardGiven}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="given">Given</option>
              <option value="not-given">Not Given</option>
            </select>
          </div>
       <div className="flex items-end">
  <div className="relative">
    <button
      onClick={() => setIsExportOpen((prev) => !prev)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center"
    >
      Export Data
      <svg
        className="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {isExportOpen && (
      <div className="absolute right-0 mt-2 bg-white text-gray-700 shadow-lg rounded z-10 w-40">
        {/* <PDFDownloadLink
          document={<ReferralPDF data={filteredData} />}
          fileName="referrals.pdf"
          className="block px-4 py-2 text-sm hover:bg-gray-100"
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "As PDF")}
        </PDFDownloadLink> */}
{/* 
        <button
          onClick={exportToCSV}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          As CSV
        </button> */}

        <button
          onClick={exportToExcel}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          As Excel
        </button>
      </div>
    )}
  </div>
</div>

        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-gray-600">No referrals found</h3>
          <p className="mt-1 text-gray-400">There are no referrals matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.flatMap((referrer) =>
                referrer.referredUsers.map((user, idx) => (
                  <tr key={`${referrer.referrerId}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-700">{referrer.referrerName}</div>
                          <div className="text-sm text-gray-500">{referrer.referrerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-600">
                        {user.code || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.name || "—"}</div>
                      <div className="text-sm text-gray-400">{user.email || "—"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-50 text-green-600' : 
                          user.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 
                          'bg-gray-50 text-gray-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingReward === user.referralId ? (
                        <div className="space-y-2 w-48">
                          <select
                            className="block w-full pl-3 pr-10 py-2 text-xs border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 rounded"
                            value={rewardForm.rewardType}
                            onChange={(e) =>
                              setRewardForm((prev) => ({
                                ...prev,
                                rewardType: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Reward Type</option>
                            <option value="subscription_bonus">Subscription Bonus</option>
                            <option value="contact_view_bonus">Contact View Bonus</option>
                            <option value="coupon">Coupon</option>
                            <option value="discount">Discount</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Reward Value"
                            className="block w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300"
                            value={rewardForm.rewardValue}
                            onChange={(e) =>
                              setRewardForm((prev) => ({
                                ...prev,
                                rewardValue: e.target.value,
                              }))
                            }
                          />

                          <div className="flex space-x-2 pt-1">
                            <button
                              onClick={() => handleRewardSubmit(user.referralId)}
                              className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReward(null)}
                              className="inline-flex items-center px-2.5 py-1 border border-gray-200 shadow-sm text-xs font-medium rounded text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : user.rewardGiven ? (
                        <div className="flex items-center">
                          <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2 py-0.5 rounded">
                            {user.rewardType}: {user.rewardValue}
                          </span>
                          <button
                            onClick={() => {
                              setEditingReward(user.referralId);
                              setRewardForm({
                                rewardType: user.rewardType || "",
                                rewardValue: user.rewardValue || "",
                              });
                            }}
                            className="ml-2 text-blue-400 hover:text-blue-600"
                          >
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingReward(user.referralId);
                            setRewardForm({ rewardType: "", rewardValue: "" });
                          }}
                          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-300"
                        >
                          Give Reward
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.referredAt
                        ? new Date(user.referredAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralCodes;