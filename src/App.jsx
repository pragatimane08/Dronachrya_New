import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./Protected_Route";

// Component Imports
import Home from "./components/ui/home/home1";
import HelpCenter from "./components/ui/home/HelpCenter";
import Login from "./components/ui/home/Login";
import ForgotPassword from "./components/ui/home/ForgotPassword";
import StudentReg from "./components/ui/home/StudentReg";
import TutorReg from "./components/ui/home/TutorReg";
import Explorecategory_Home from "./components/ui/home/ExploreCategories";
import Student_Plan from "./components/ui/home/Student_plan";
import Tutor_Plan from "./components/ui/home/Tutor_Plan";
import Book_Demo_StudentReg from "./components/ui/home/Book_Demo_StudentReg";
import BookDemoReg from "./components/ui/home/BookDemoReg";

import AdminDashboard from "./Pages/admin/admin_dashboard";
import AdminManageTutor from "./Pages/admin/admin_manage_tutor";
import AdminManageStudents from "./Pages/admin/admin_manage_students";
import AdminSubscription from "./Pages/admin/admin_subscriptions";
import AdminCouponOffers from "./Pages/admin/admin_coupons_offers";
import AdminReferralCode from "./Pages/admin/admin_referralcode";
import AdminRegistration from "./components/ui/admin/Registration/AdminRegistration";
import AdminLogin from "./components/ui/admin/Registration/AdminLogin";
import ManageTutor from "./components/ui/admin/Manage_Tutor/ManageTutors";
import AdminSendNotifications from "./Pages/admin/admin_sendnotifications";
import AdminAnalysis from "./Pages/admin/admin_analytics";
import AdminInvoices from "./Pages/admin/admin_invoices";
import AdminForgotPassword from "./components/ui/admin/Registration/ForgotPassword";

import TutorDashboard from "./Pages/tutor/tutor_dashboard";
import Profile_show from "./Pages/tutor/TutorProfileShow";
import LocationForm from "./components/ui/Tutor/Registration/LocationForm";
import CreateProfileTutor1 from "./components/ui/Tutor/Registration/CreateProfile_tutor1";
import CreateProfileTutor2 from "./components/ui/Tutor/Registration/CreateProfile_tutor2";
import SubscriptionPlans_Tutor from "./components/ui/Tutor/Registration/SubscriptionPlan_tutor";
import My_Classes_Tutor from "./Pages/tutor/My_Classes_Tutor";
import Message_Tutor from "./Pages/tutor/Message_Tutor";
import My_Plan_Tutor from "./Pages/tutor/My_Plan_Tutor";
import Tutor_message from "./components/ui/Tutor/Messages_Tutor/Message";
import Tutor_Invoice from "./Pages/tutor/Tutor_Invoice";
import MyClasses_tutor_main from "./components/ui/Tutor/MyClasses_Tutor/MyClasses_tutor_main";
import AddClassForm_Tutor from "./components/ui/Tutor/MyClasses_Tutor/AddClassForm_tutor";
import MyPlanUpgrader_Tutor from "./components/ui/Tutor/TutorAccount/MyPlan/MyPlan_Tutor";
import View_All_Enquiries from "./Pages/tutor/View_All_Enquiries";
import EnuiryList_tutor from "./components/ui/Tutor/Enquiries/AllEnquiriesPage";
import Student_Card_Filter from "./components/ui/Tutor/FindStudent/StudentCard";
import FilterSidebar from "./components/ui/Tutor/FindStudent/FilterSidebar";
import Filter_Student from "./Pages/tutor/Student_Filter_Tutor";
import FindStudentShow from "./components/ui/Tutor/FindStudent/FindStudentShow";
import MyPlanTutorFile from "./components/ui/Tutor/TutorAccount/MyPlan/MyPlan_Tutor";
import UpgradePlanTutor from "./components/ui/Tutor/TutorAccount/MyPlan/Upgrade_now_tutor";
import ReferTutor from "./Pages/tutor/ReferTutor";
import ReferTutor_file from "./components/ui/Tutor/ReferTutor/ReferralDashboard";
import ReferalSignUp from "./Pages/tutor/ReferalSignUp";
import SubscriptionDaysRemainingTutor from "./components/ui/Tutor/dashbaord/SubscriptionDaysRemainingTutor";
import TutorReferralCodeStep from "./components/ui/Tutor/Registration/TutorReferralCodeStep";

import StudentDashboard from "./Pages/student/student_dashboard";
import Student_BillingHistory from "./Pages/student/BillingHistory";
import LocationSelector from "./components/ui/Student_Front_End/Registration/LocationSelector";
import SubscriptionPlans_Student from "./components/ui/Student_Front_End/Registration/SubscriptionPlans";
import ModeSelectionForm from "./components/ui/Student_Front_End/Registration/ModeSelectionForm";
import Student_MessageDashboard from "./Pages/student/MessageDashboard";
import Student_Classes from "./Pages/student/Classes";
import Student_BookMark from "./Pages/student/Bookmark";
import Message_Student from "./components/ui/Student/Messages_Student/Message";
import Student_Filter from "./Pages/tutor/Student_Filter_Tutor";
import Student_Profile_show from "./Pages/student/profile_show";
import Whole_Profile_student from "./Pages/student/profile_show";
import My_Bookmark_Student_Folder from "./components/ui/Student/Bookmark/Bookmark";
import BookMark from "./components/ui/Student/Bookmark/Bookmark";
import MyPlanUpgrader_Student from "./components/ui/Student/account/Billing_History/MyPlan_Student";
import EnquiryForm_Student from "./components/ui/Student/dashbaord/EnquiryForm_Student";
import Upgrade_Plan_Student from "./components/ui/Student/account/Billing_History/Upgrade_Plan";
import Student_invoice from "./Pages/student/Student_invoice";
import Student_Referal from "./Pages/student/student_referal";
import RefralDashbaord_student from "./components/ui/Student/ReferStudent/ReferralDashboard_Student";
import MyClasses_Student from "./components/ui/Student/MyClasses_Student/MyClasses_student";
import AddClassForm_Student from "./components/ui/Student/MyClasses_Student/AddClassForm_student";
import StudentReferralCodeStep from "./components/ui/Student_Front_End/Registration/ReferralCodeStep";

import "aos/dist/aos.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ExploreCategories from "./components/ui/home/ExploreCategories";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-White">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home1" element={<Home />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/studentreg" element={<StudentReg />} />
          <Route path="/tutorreg" element={<TutorReg />} />
          <Route path="/explore-categories" element={<ExploreCategories />} />
          <Route path="/explorecategory_home" element={<Explorecategory_Home />} />
          <Route path="/student-plan" element={<Student_Plan />} />
          <Route path="/tutor-plan" element={<Tutor_Plan />} />
          <Route path="/book-demo-studentreg" element={<Book_Demo_StudentReg />} />
          <Route path="/book-demo" element={<BookDemoReg />} />

          {/* Admin Login/Register */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-registration" element={<AdminRegistration />} />
          <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />

          {/* ✅ Protected Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/manage_tutor" element={<ProtectedRoute allowedRoles={["admin"]}><ManageTutor /></ProtectedRoute>} />
          <Route path="/admin_manage_tutor" element={<ProtectedRoute allowedRoles={["admin"]}><AdminManageTutor /></ProtectedRoute>} />
          <Route path="/admin_manage_students" element={<ProtectedRoute allowedRoles={["admin"]}><AdminManageStudents /></ProtectedRoute>} />
          <Route path="/admin_subscriptions" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSubscription /></ProtectedRoute>} />
          <Route path="/admin_coupon_offers" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCouponOffers /></ProtectedRoute>} />
          <Route path="/admin_referral_code" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReferralCode /></ProtectedRoute>} />
          <Route path="/admin_send_notifications" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSendNotifications /></ProtectedRoute>} />
          <Route path="/admin_analysis" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAnalysis /></ProtectedRoute>} />
          <Route path="/admin_invoices" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInvoices /></ProtectedRoute>} />

          {/* ✅ Protected Tutor Routes */}
          <Route path="/tutor-dashboard" element={<ProtectedRoute allowedRoles={["tutor"]}><TutorDashboard /></ProtectedRoute>} />
          <Route path="/tutor-profile" element={<ProtectedRoute allowedRoles={["tutor"]}><Profile_show /></ProtectedRoute>} />
          <Route path="/tutor-profile-show" element={<ProtectedRoute allowedRoles={["tutor"]}><Profile_show /></ProtectedRoute>} />
          <Route path="/location-form" element={<ProtectedRoute allowedRoles={["tutor"]}><LocationForm /></ProtectedRoute>} />
          <Route path="/create-profile-tutor1" element={<ProtectedRoute allowedRoles={["tutor"]}><CreateProfileTutor1 /></ProtectedRoute>} />
          <Route path="/create-profile-tutor2" element={<ProtectedRoute allowedRoles={["tutor"]}><CreateProfileTutor2 /></ProtectedRoute>} />
          <Route path="/subscriptionplan_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><SubscriptionPlans_Tutor /></ProtectedRoute>} />
          <Route path="/my_classes_tutor_main" element={<ProtectedRoute allowedRoles={["tutor"]}><MyClasses_tutor_main /></ProtectedRoute>} />
          <Route path="/my_classes_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><My_Classes_Tutor /></ProtectedRoute>} />
          <Route path="/add-class-form-tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><AddClassForm_Tutor /></ProtectedRoute>} />
          <Route path="/message_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><Message_Tutor /></ProtectedRoute>} />
          <Route path="/my_plan_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><My_Plan_Tutor /></ProtectedRoute>} />
          <Route path="/tutor_message" element={<ProtectedRoute allowedRoles={["tutor"]}><Tutor_message /></ProtectedRoute>} />
          <Route path="/tutor_invoice" element={<ProtectedRoute allowedRoles={["tutor"]}><Tutor_Invoice /></ProtectedRoute>} />
          <Route path="/myplanupgrade_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><MyPlanUpgrader_Tutor /></ProtectedRoute>} />
          <Route path="/view_all_enquires" element={<ProtectedRoute allowedRoles={["tutor"]}><View_All_Enquiries /></ProtectedRoute>} />
          <Route path="/enquiry_list_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><EnuiryList_tutor /></ProtectedRoute>} />
          <Route path="/filter_student" element={<ProtectedRoute allowedRoles={["tutor"]}><Filter_Student /></ProtectedRoute>} />
          <Route path="/findstudent_show" element={<ProtectedRoute allowedRoles={["tutor"]}><FindStudentShow /></ProtectedRoute>} />
          <Route path="/filterSidebar" element={<ProtectedRoute allowedRoles={["tutor"]}><FilterSidebar /></ProtectedRoute>} />
          <Route path="/student_card_filter" element={<ProtectedRoute allowedRoles={["tutor"]}><Student_Card_Filter /></ProtectedRoute>} />
          <Route path="/myplantutor_file" element={<ProtectedRoute allowedRoles={["tutor"]}><MyPlanTutorFile /></ProtectedRoute>} />
          <Route path="/upgradeplan_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><UpgradePlanTutor /></ProtectedRoute>} />
          <Route path="/refer_tutor" element={<ProtectedRoute allowedRoles={["tutor"]}><ReferTutor /></ProtectedRoute>} />
          <Route path="/refer_tutor_file" element={<ProtectedRoute allowedRoles={["tutor"]}><ReferTutor_file /></ProtectedRoute>} />
          <Route path="/referal_signup" element={<ProtectedRoute allowedRoles={["tutor"]}><ReferalSignUp /></ProtectedRoute>} />
          <Route path="/subscriptiondaysremainingtutor" element={<ProtectedRoute allowedRoles={["tutor"]}><SubscriptionDaysRemainingTutor /></ProtectedRoute>} />
          <Route path="/student_filter" element={<ProtectedRoute allowedRoles={["tutor"]}><Student_Filter /></ProtectedRoute>} />
          <Route path="/tutor_referral_code" element={<ProtectedRoute allowedRoles={["tutor"]}><TutorReferralCodeStep /></ProtectedRoute>} />


          {/* ✅ Protected Student Routes */}
          <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student_classes" element={<ProtectedRoute allowedRoles={["student"]}><Student_Classes /></ProtectedRoute>} />
          <Route path="/student_billing_history" element={<ProtectedRoute allowedRoles={["student"]}><Student_BillingHistory /></ProtectedRoute>} />
          <Route path="/student_profile_show" element={<ProtectedRoute allowedRoles={["student"]}><Student_Profile_show /></ProtectedRoute>} />
          <Route path="/student_message_dashboard" element={<ProtectedRoute allowedRoles={["student"]}><Student_MessageDashboard /></ProtectedRoute>} />
          <Route path="/student_bookmark" element={<ProtectedRoute allowedRoles={["student"]}><Student_BookMark /></ProtectedRoute>} />
          <Route path="/bookmark" element={<ProtectedRoute allowedRoles={["student"]}><BookMark /></ProtectedRoute>} />
          <Route path="/my_bookmark_student_folder" element={<ProtectedRoute allowedRoles={["student"]}><My_Bookmark_Student_Folder /></ProtectedRoute>} />
          <Route path="/message_stud" element={<ProtectedRoute allowedRoles={["student"]}><Message_Student /></ProtectedRoute>} />
          <Route path="/student_invoice" element={<ProtectedRoute allowedRoles={["student"]}><Student_invoice /></ProtectedRoute>} />
          <Route path="/student_referal" element={<ProtectedRoute allowedRoles={["student"]}><Student_Referal /></ProtectedRoute>} />
          <Route path="/referaldashbaord_student_page" element={<ProtectedRoute allowedRoles={["student"]}><RefralDashbaord_student /></ProtectedRoute>} />
          <Route path="/my_classes_student" element={<ProtectedRoute allowedRoles={["student"]}><MyClasses_Student /></ProtectedRoute>} />
          <Route path="/whole_profile_student" element={<ProtectedRoute allowedRoles={["student"]}><Whole_Profile_student /></ProtectedRoute>} />
          <Route path="/add_class-form_student" element={<ProtectedRoute allowedRoles={["student"]}><AddClassForm_Student /></ProtectedRoute>} />
          <Route path="/myplanupgrade_student" element={<ProtectedRoute allowedRoles={["student"]}><MyPlanUpgrader_Student /></ProtectedRoute>} />
          <Route path="/enquiry_form_student" element={<ProtectedRoute allowedRoles={["student"]}><EnquiryForm_Student /></ProtectedRoute>} />
          <Route path="/upgrader_plan_student" element={<ProtectedRoute allowedRoles={["student"]}><Upgrade_Plan_Student /></ProtectedRoute>} />
          <Route path="/subscriptionPlans_student" element={<ProtectedRoute allowedRoles={["student"]}><SubscriptionPlans_Student /></ProtectedRoute>} />
          <Route path="/mode-selection-form" element={<ProtectedRoute allowedRoles={["student"]}><ModeSelectionForm /></ProtectedRoute>} />
          <Route path="/location-selector" element={<ProtectedRoute allowedRoles={["student"]}><LocationSelector /></ProtectedRoute>} />
          <Route path="/student_referral_code" element={<ProtectedRoute allowedRoles={["student"]}><StudentReferralCodeStep /></ProtectedRoute>} />

          {/* 404 Not Found */}
          <Route path="*" element={<div className="text-center mt-10 text-xl text-red-500">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
