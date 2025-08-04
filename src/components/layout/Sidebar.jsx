import React from 'react';
import AdminSidebar from './sidebars/AdminSidebar';
import StudentSidebar from './sidebars/StudentSidebar';
import TutorSidebar from './sidebars/TutorSidebar';

const Sidebar = ({ userType }) => {
  switch(userType) {
    case 'admin':
      return <AdminSidebar />;
    case 'student':
      return <StudentSidebar />;
    case 'tutor':
      return <TutorSidebar />;
    default:
      return <AdminSidebar />;
  }
};

export default Sidebar;