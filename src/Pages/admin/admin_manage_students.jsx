import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import ManageStudent from '../../components/ui/admin/Manage_Student/ManageStudent';

const AdminManageStudents = () => {
  return (
    <Mainlayout role="admin">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
          Manage Students
        </h1>
        <p className="text-gray-600 mb-6 text-left">
          Welcome back! Here's what's happening with your tutoring business.
        </p>
        <ManageStudent />
      </div>
    </Mainlayout>
  );
};

export default AdminManageStudents;
