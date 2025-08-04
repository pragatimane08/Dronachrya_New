import React from "react";

const RecentSubscriptions = () => {
  const subscriptions = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Tutor",
      plan: "Gold Plan",
      startDate: "4/15/2025",
      endDate: "7/15/2025",
      amount: "₹5,000",
    },
    {
      name: "Priya Sharma",
      role: "Tutor",
      plan: "Silver Plan",
      startDate: "5/1/2025",
      endDate: "6/1/2025",
      amount: "₹3,000",
    },
    {
      name: "Neha Gupta",
      role: "Student",
      plan: "Basic Plan",
      startDate: "4/20/2025",
      endDate: "Lifetime",
      amount: "₹500",
    },
  ];

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
            {subscriptions.map((sub, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">
                  <div className="font-medium text-gray-900">{sub.name}</div>
                  <div className="text-xs text-gray-500">{sub.role}</div>
                </td>
                <td>{sub.plan}</td>
                <td>{sub.startDate}</td>
                <td>{sub.endDate}</td>
                <td className="font-semibold">{sub.amount}</td>
              </tr>
            ))}
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
