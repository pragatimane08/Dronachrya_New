import React from 'react';
import Admin_Card from '../../components/ui/admin/dashbaord/admin_card';
import Recent_Tutor from '../../components/ui/admin/dashbaord/recent_tutor';
import RecentSubscription from '../../components/ui/admin/dashbaord/recentSubscriptions';
import Mainlayout from '../../components/layout/MainLayout';

const AdminDashboard = () => {
  return (
    <Mainlayout role="admin">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
         Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>

        {/* Admin_Card Card */}
        <Admin_Card />

        {/* Recent Tutors Card */}
        <Recent_Tutor />
        {/* Recent Subscriptions Card */}
        <RecentSubscription />
      </div>
    </Mainlayout>
  );
};

export default AdminDashboard;
