// src/components/dashboard/SubscriptionStatusCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../../../api/apiclient";

const SubscriptionStatusCard = () => {
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileWithSubscription = async () => {
      try {
        const res = await apiClient.get("/profile");
        const profile = res.data;

        if (
          profile.subscription_status === "Subscribed" &&
          typeof profile.remaining_days === "number"
        ) {
          setDaysLeft(profile.remaining_days);
        } else {
          setDaysLeft(null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile/subscription:", err);
        toast.error("Failed to fetch subscription status");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileWithSubscription();
  }, []);

  if (loading || daysLeft === null) return null;

  const isSubscriptionExpiring = daysLeft <= 3;
  const isExpired = daysLeft === 0;

  return (
    <div className="w-full max-w-5xl mx-auto my-6">
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center rounded-xl p-6 shadow-sm ${
        isExpired 
          ? "bg-[#FFEBEE] border-l-4 border-[#EF5350]" 
          : isSubscriptionExpiring
          ? "bg-[#E8F5E9] border-l-4 border-[#35BAA3]"
          : "bg-[#E3F2FD] border-l-4 border-[#2F4380]"
      }`}>
        {/* Left - Text */}
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isExpired 
                ? "bg-[#EF5350] text-white"
                : isSubscriptionExpiring
                ? "bg-[#35BAA3] text-white"
                : "bg-[#2F4380] text-white"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className={`text-xl font-semibold ${
              isExpired ? "text-[#D32F2F]" : "text-[#2F4380]"
            }`}>
              Subscription Status
            </h4>
          </div>
          
          <div className="mt-3 ml-11">
            <p className={`text-lg ${
              isExpired 
                ? "text-[#D32F2F] font-medium"
                : isSubscriptionExpiring
                ? "text-[#35BAA3] font-medium"
                : "text-[#2F4380]"
            }`}>
              {isExpired 
                ? "Your subscription has expired!" 
                : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
            </p>
            {isSubscriptionExpiring && (
              <p className="text-sm text-[#2F4380] mt-1">
                Renew now to continue uninterrupted service
              </p>
            )}
          </div>
        </div>

        {/* Right - Button */}
        <button
          onClick={() => navigate("/tutor_subscription_plan")}
          className={`w-full md:w-auto text-center ${
            isExpired
              ? "bg-[#EF5350] hover:bg-[#D32F2F]"
              : isSubscriptionExpiring
              ? "bg-[#35BAA3] hover:bg-[#2F4380]"
              : "bg-[#2F4380] hover:bg-[#35BAA3]"
          } text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md`}
        >
          {isExpired ? "Subscribe Now" : "Renew Now"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatusCard;