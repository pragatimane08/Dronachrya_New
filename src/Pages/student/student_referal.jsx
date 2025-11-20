import React from 'react';
import Mainlayout from '../../components/layout/MainLayout';
import RefralDashbaord_student from '../../components/ui/Student/ReferStudent/ReferralDashboard_Student';

const Student_Referal = () => {
    return (
        <Mainlayout role="student">
            <div className="w-full min-h-screen pt-8 px-5 py-4 bg-white font-sans overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-left">
                    Refer a Tutor or Student
                </h1>
                <p className="text-gray-600 mb-6 text-left">
                    Here you can refer a tutor or student and earn rewards.
                </p>
                <RefralDashbaord_student />
            </div>
        </Mainlayout>
    );
};

export default Student_Referal;
