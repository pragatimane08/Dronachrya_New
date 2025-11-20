// src/components/common/PlanSelectorTemplate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../api/apiclient";
import Layout from "../../components/ui/home/layout/MainLayout";

const PlanSelectorTemplate = ({
    apiEndpoint, 
    redirectPath, 
    skipPath, 
    role, 
}) => {
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await apiClient.get(apiEndpoint);
                if (res.data?.plans?.length > 0) {
                    setPlans(res.data.plans);
                } else {
                    toast.info("No subscription plans available.");
                }
            } catch (err) {
                console.error(`❌ Failed to fetch ${role} plans`, err);
                toast.error("Unable to load subscription plans. Please try again later.");
            }
        };

        fetchPlans();
    }, [apiEndpoint, role]);

    const handlePlanSelect = (plan) => {
        toast.success(`${plan.plan_name} selected. Redirecting...`);
        localStorage.setItem(`${role}SelectedPlan`, JSON.stringify(plan));
        navigate(redirectPath);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-xl border border-gray-300 p-8 w-full max-w-6xl">
                    {/* <h2 className="text-center text-[#0E2D63] text-2xl font-semibold mb-8">
            Choose Your Subscription Plan
          </h2> */}

                    <h2 className="text-center text-[#0E2D63] text-2xl font-semibold mb-2">
                        {role === "tutor"
                            ? "Choose Your Subscription Plan for Tutors"
                            : "Choose Your Subscription Plan for Students"}
                    </h2>

                    <p className="text-center text-gray-600 text-sm mb-8">
                        {role === "tutor"
                            ? "Boost your teaching career with flexible tutor plans designed to fit your needs."
                            : "Get access to expert tutors and features with our student subscription plans."}
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className="rounded-lg p-6 border border-gray-200 hover:border-teal-500 shadow-sm transition duration-300 cursor-pointer flex flex-col"
                            >
                                <h3 className="text-center font-semibold text-gray-800 mb-2 text-sm">
                                    {plan.plan_name}
                                </h3>

                                <div className="text-center text-3xl font-bold text-black mb-1">
                                    ₹{parseFloat(plan.price).toFixed(2)}
                                </div>
                                <p className="text-center text-sm text-gray-500 mb-4">
                                    {plan.duration_days
                                        ? `${plan.duration_days}-day validity`
                                        : "/duration"}
                                </p>

                                <ul className="text-sm text-gray-700 space-y-1 mb-4 flex-1">
                                    {plan.features?.map((feature, i) => (
                                        <li key={i}>✔ {feature}</li>
                                    ))}
                                </ul>

                                <button
                                    className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm font-medium"
                                    onClick={() => handlePlanSelect(plan)}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => {
                                toast.info("Skipped plan selection.");
                                navigate(skipPath);
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded text-sm"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PlanSelectorTemplate;
