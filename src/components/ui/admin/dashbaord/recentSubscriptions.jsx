import React from "react";

const RecentSubscriptions = ({ recentSubscriptions = [] }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6 m-4">
      <h2 className="text-lg font-semibold text-gray-800">Recent Subscriptions</h2>
      <p className="text-sm text-gray-500 mb-4">Recent plan subscriptions</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th>User</th>
              <th>Plan</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentSubscriptions.length > 0 ? (
              recentSubscriptions.map((sub, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">
                    <div className="font-medium text-gray-900">
                      {sub?.User?.email || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sub?.User?.role || "N/A"}
                    </div>
                  </td>
                  <td>{sub?.SubscriptionPlan?.plan_name || "N/A"}</td>
                  <td>{sub?.start_date ? new Date(sub.start_date).toLocaleDateString() : "-"}</td>
                  <td>{sub?.end_date ? new Date(sub.end_date).toLocaleDateString() : "-"}</td>
                  <td className="font-semibold">
                    ₹{sub?.SubscriptionPlan?.price || "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No recent subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-teal-600 hover:underline cursor-pointer">
        View all subscriptions
      </div>
    </div>
  );
};

export default RecentSubscriptions;