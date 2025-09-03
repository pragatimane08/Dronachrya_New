// import React, { useEffect, useState } from "react";
// import Mainlayout from "../../components/layout/MainLayout";
// import Admin_Card from "../../components/ui/admin/dashbaord/admin_card";
// import Recent_Tutor from "../../components/ui/admin/dashbaord/recent_tutor";
// import RecentSubscription from "../../components/ui/admin/dashbaord/recentSubscriptions";
// import { getDashboardSummary } from "../../api/repository/admin/dashboard.repository";

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const data = await getDashboardSummary();
//         setDashboardData(data);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to load dashboard data.");
//       }
//     };

//     fetchDashboard();
//   }, []);

//   if (error) {
//     return (
//       <Mainlayout role="admin">
//         <div className="p-10 text-red-600 font-semibold text-center">
//           {error}
//         </div>
//       </Mainlayout>
//     );
//   }

//   if (!dashboardData) {
//     return (
//       <Mainlayout role="admin">
//         <div className="p-10 text-gray-600 font-medium text-center">
//           Loading dashboard...
//         </div>
//       </Mainlayout>
//     );
//   }

//   return (
//     <Mainlayout role="admin">
//       <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-600 mb-6 text-left">
//           Welcome back! Here's what's happening with your tutoring business.
//         </p>

//         {/* Admin Cards */}
//         <Admin_Card
//           totalStudents={dashboardData.totalStudents}
//           totalTutors={dashboardData.totalTutors}
//           totalEnquiries={dashboardData.totalEnquiries}
//           totalSubscriptions={dashboardData.totalSubscriptions}
//         />

//         {/* Recent Tutors */}
//         <Recent_Tutor
//           recentTutors={dashboardData.recentTutors}
//           recentStudents={dashboardData.recentStudents}
//         />

//         {/* Recent Subscriptions */}
//         <RecentSubscription
//           recentSubscriptions={dashboardData.recentSubscriptions}
//         />
//       </div>
//     </Mainlayout>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import Mainlayout from "../../components/layout/MainLayout";
import Admin_Card from "../../components/ui/admin/dashbaord/admin_card";
import Recent_Tutor from "../../components/ui/admin/dashbaord/recent_tutor";
import RecentSubscription from "../../components/ui/admin/dashbaord/recentSubscriptions";
import RecentStudents from "../../components/ui/admin/dashbaord/RecentStudents";
import { getDashboardSummary } from "../../api/repository/admin/dashboard.repository";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [showAllTutors, setShowAllTutors] = useState(false); // toggle state

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardSummary();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return (
      <Mainlayout role="admin">
        <div className="p-10 text-red-600 font-semibold text-center">
          {error}
        </div>
      </Mainlayout>
    );
  }

  if (!dashboardData) {
    return (
      <Mainlayout role="admin">
        <div className="p-10 text-gray-600 font-medium text-center">
          Loading dashboard...
        </div>
      </Mainlayout>
    );
  }

  return (
    <Mainlayout role="admin">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>

        {/* Admin Cards */}
        <Admin_Card
          totalStudents={dashboardData.totalStudents}
          totalTutors={dashboardData.totalTutors}
          totalEnquiries={dashboardData.totalEnquiries}
          totalSubscriptions={dashboardData.totalSubscriptions}
        />

        {/* Tutors & Students in same row */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Recent or Full Tutors Table */}
          {!showAllTutors ? (
            <Recent_Tutor
              recentTutors={dashboardData.recentTutors}
              onViewAll={setShowAllTutors} // pass toggle function
            />
          ) : (
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">All Tutors</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Subjects</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentTutors.map((tutor, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-2 font-medium">{tutor.name}</td>
                      <td className="py-2 px-2">{tutor.subjects?.join(", ")}</td>
                      <td className="py-2 px-2">{tutor.profile_status}</td>
                      <td className="py-2 px-2">{new Date(tutor.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => setShowAllTutors(false)}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Show recent
              </button>
            </div>
          )}

          {/* Recent Students */}
          <RecentStudents recentStudents={dashboardData.recentStudents} />
        </div>

        {/* Recent Subscriptions */}
        <div className="mt-6">
          <RecentSubscription
            recentSubscriptions={dashboardData.recentSubscriptions}
          />
        </div>
      </div>
    </Mainlayout>
  );
};

export default AdminDashboard;
