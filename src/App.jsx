import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component Imports
{/* Home */ }
import Home from "./components/ui/home/home1";
import HelpCenter from "./components/ui/home/HelpCenter";
import Login from "./components/ui/home/Login";
import ForgotPassword from "./components/ui/home/ForgotPassword";
import StudentReg from "./components/ui/home/StudentReg";
import TutorReg from "./components/ui/home/TutorReg";

{/* AdminSide */ }
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

{/* TutorSide */ }
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
//import Earning_Coins from "./Pages/tutor/Earning_Coins";
import MyClasses_tutor_main from "./components/ui/Tutor/MyClasses_Tutor/MyClasses_tutor_main";
import AddClassForm_Tutor from "./components/ui/Tutor/MyClasses_Tutor/AddClassForm_tutor";
// import EditClassForm_Tutor from "./components/ui/Tutor/MyClasses_Tutor/EditClassForm_tutor";
import MyPlanUpgrader_Tutor from "./components/ui/Tutor/TutorAccount/MyPlan/MyPlan_Tutor";
import View_All_Enquiries from "./Pages/tutor/View_All_Enquiries";
import EnuiryList_tutor from "./components/ui/Tutor/Enquiries/AllEnquiriesPage";
//Filter Student
import Student_Card_Filter from "./components/ui/Tutor/FindStudent/StudentCard";
import FilterSidebar from "./components/ui/Tutor/FindStudent/FilterSidebar";
import Filter_Student from "./Pages/tutor/Student_Filter_Tutor";
import FindStudentShow from "./components/ui/Tutor/FindStudent/FindStudentShow";
//my plan
import MyPlanTutorFile from "./components/ui/Tutor/TutorAccount/MyPlan/MyPlan_Tutor";
import UpgradePlanTutor from "./components/ui/Tutor/TutorAccount/MyPlan/Upgrade_now_tutor";
//refer tutor
import ReferTutor from "./Pages/tutor/ReferTutor";
import ReferTutor_file from "./components/ui/Tutor/ReferTutor/ReferralDashboard";
import ReferalSignUp from "./Pages/tutor/ReferalSignUp";
import SubscriptionDaysRemainingTutor from "./components/ui/Tutor/dashbaord/SubscriptionDaysRemainingTutor";

{/* Tutor Registration Form */ }

{/* StudentSide */ }
import StudentDashboard from "./Pages/student/student_dashboard";
import Student_BillingHistory from "./Pages/student/BillingHistory";
import LocationSelector_Studnet from "./components/ui/Student_Front_End/Registration/LocationSelector";
import SubscriptionPlans_Student from "./components/ui/Student_Front_End/Registration/SubscriptionPlans";
import ModeSelectionForm_Student from "./components/ui/Student_Front_End/Registration/ModeSelectionForm";
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

{/* Student Classes */ }
import MyClasses_Student from "./components/ui/Student/MyClasses_Student/MyClasses_student";
import AddClassForm_Student from "./components/ui/Student/MyClasses_Student/AddClassForm_student";

// Styles
import "aos/dist/aos.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ExploreCategories from "./components/ui/home/ExploreCategories";

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-White">
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />
                    <Route path="/home1" element={<Home />} />{" "}
                    <Route path="/help-center" element={<HelpCenter />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/explore-categories" element={<ExploreCategories />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/studentreg" element={<StudentReg />} />
                    <Route path="/tutorreg" element={<TutorReg />} />

                    {/* Admin */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/admin-registration" element={<AdminRegistration />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/manage_tutor" element={<ManageTutor />} />
                    <Route path="/admin_manage_tutor" element={<AdminManageTutor />} />
                    <Route path="/admin_manage_students" element={<AdminManageStudents />} />
                    <Route path="/admin_subscriptions" element={<AdminSubscription />} />
                    <Route path="/admin_coupon_offers" element={<AdminCouponOffers />} />
                    <Route path="/admin_referral_code" element={<AdminReferralCode />} />
                    <Route path="/admin_send_notifications" element={<AdminSendNotifications />} />
                    <Route path="/admin_analysis" element={<AdminAnalysis />} />
                    <Route path="/admin_invoices" element={<AdminInvoices />} />

                    {/*Tutor Registartion Form*/}
                    <Route path="/location-form" element={<LocationForm />} />
                    <Route path="/create-profile-tutor1" element={<CreateProfileTutor1 />} />
                    <Route path="/create-profile-tutor2" element={<CreateProfileTutor2 />} />
                    <Route path="/subscriptionplan_tutor" element={<SubscriptionPlans_Tutor />} />
                    {/* 404 Not Found */}
                    <Route path="*" element={
                        <div className="text-center mt-10 text-xl text-red-500">
                            404 - Page Not Found
                        </div>
                    } />


                    {/* Student Registration Form */}

                    <Route path="/location-selector" element={<LocationSelector_Studnet />} />
                    <Route path="/mode-selection-form" element={<ModeSelectionForm_Student />} />
                    <Route path="/subscription-plan" element={<SubscriptionPlans_Student />} />

                    {/*Student Menu */}
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/student_classes" element={<Student_Classes />} />
                    <Route path="/student_billing_history" element={<Student_BillingHistory />} />
                    <Route path="/student_profile_show" element={<Student_Profile_show />} />
                    <Route path="/student_message_dashboard" element={<Student_MessageDashboard />} />
                    <Route path="/student_bookmark" element={<Student_BookMark />} />
                    <Route path="/bookmark" element={<BookMark />} />
                    <Route path="/my_bookmark_student_folder" element={<My_Bookmark_Student_Folder />} />
                    <Route path="/message_stud" element={<Message_Student />} />

                    <Route path="/my_classes_student" element={<MyClasses_Student />} />
                    <Route path="/whole_profile_student" element={<Whole_Profile_student />} />
                    <Route path="/add_class-form_student" element={<AddClassForm_Student />} />
                    <Route path="/myplanupgrade_student" element={<MyPlanUpgrader_Student />} />
                    <Route path="/enquiry_form_student" element={<EnquiryForm_Student />} />
                    <Route path="/upgrader_plan_student" element={<Upgrade_Plan_Student />} />

                    {/*Tutor Menu */}
                    <Route path="/tutor-dashboard" element={<TutorDashboard />} />
                    <Route path="/my_classes_tutor" element={<My_Classes_Tutor />} />
                    <Route path="/message_tutor" element={<Message_Tutor />} />
                    <Route path="/Student_Filter" element={<Student_Filter />} />
                    <Route path="/tutor-profile" element={<Profile_show />} />
                    <Route path="/tutor-profile-show" element={<Profile_show />} />
                    <Route path="/my_plan_tutor" element={<My_Plan_Tutor />} />
                    <Route path="/tutor_message" element={<Tutor_message />} />
                    {/* <Route path="/earning_coins" element={<Earning_Coins />} /> */}
                    <Route path="/my_classes_tutor" element={<MyClasses_tutor_main />} />
                    <Route path="/add-class-form-tutor" element={<AddClassForm_Tutor />} />
                    <Route path="/myplanupgrade_tutor" element={<MyPlanUpgrader_Tutor />} />
                    <Route path="/view_all_enquires" element={<View_All_Enquiries />} />
                    <Route path="/enquiry_list_tutor" element={<EnuiryList_tutor />} />
                    {/* Filter Student */}
                    <Route path="/filter_student" element={<Filter_Student />} />
                    <Route path="/findstudent_show" element={<FindStudentShow />} />
                    <Route path="/filterSidebar" element={<FilterSidebar />} />
                    <Route path="/student_card_filter" element={<Student_Card_Filter />} />
                    {/* My Plan */}
                    <Route path="/myplantutor_file" element={<MyPlanTutorFile />} />
                    <Route path="/upgradeplan_tutor" element={<UpgradePlanTutor />} />
                    {/* Tutor Refer */}
                    <Route path="/refer_tutor" element={<ReferTutor />} />
                    <Route path="/refer_tutor_file" element={<ReferTutor_file />} />
                    <Route path="/referal_signup" element={<ReferalSignUp />} />
                    <Route path="/subscriptiondaysremainingtutor" element={<SubscriptionDaysRemainingTutor />} />
                    {/* <Route path="/edit-class-form-tutor/:id" element={<EditClassForm_Tutor />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
