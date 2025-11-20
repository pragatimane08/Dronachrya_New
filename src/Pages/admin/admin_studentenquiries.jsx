import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import StudentEnquiries from '../../components/ui/admin/StudentEnquiries/StudentEnquiries'

const AdminStudentEnquiries = () => {
  return (
    <Mainlayout role="admin">
      <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
         Student Enquiries
        </h1>
        <p className="text-gray-600 mb-6 text-left">
        Manage and track student registration requests
        </p>
        <StudentEnquiries/>
      </div>
    </Mainlayout>
  );
};

export default AdminStudentEnquiries;