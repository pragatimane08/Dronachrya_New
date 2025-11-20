import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../../../api/apiclient";

const SubscriptionStatusCard = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = useCallback(async () => {
    try {
      const profileRes = await apiClient.get("/profile");
      const profile = profileRes.data;

      if (
        profile.subscription_status === "Subscribed" &&
        typeof profile.remaining_days === "number"
      ) {
        try {
          const billingRes = await apiClient.get("/billing/history");
          const billingHistory = Array.isArray(billingRes.data.history)
            ? billingRes.data.history
            : [];

          const activeSubscription = billingHistory.find(
            (entry) => entry.subscription?.is_active
          );

          if (activeSubscription) {
            setSubscriptionData({
              daysLeft: profile.remaining_days,
              planName:
                activeSubscription.plan?.plan_name ||
                profile.plan_name ||
                "Student Plan",
              contactsRemaining:
                activeSubscription.subscription?.contacts_remaining ||
                profile.contacts_remaining ||
                0,
              validUntil:
                activeSubscription.subscription?.end_date ||
                profile.subscription_end_date ||
                null,
            });
          } else {
            setSubscriptionData({
              daysLeft: profile.remaining_days,
              planName: profile.plan_name || "Student Plan",
              contactsRemaining: profile.contacts_remaining || 0,
              validUntil: profile.subscription_end_date || null,
            });
          }
        } catch (billingError) {
          console.error("❌ Failed to fetch billing history:", billingError);
          setSubscriptionData({
            daysLeft: profile.remaining_days,
            planName: profile.plan_name || "Student Plan",
            contactsRemaining: profile.contacts_remaining || 0,
            validUntil: profile.subscription_end_date || null,
          });
        }
      } else {
        setSubscriptionData(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch profile/subscription:", err);
      toast.error("Failed to fetch subscription status");
      setSubscriptionData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchSubscriptionData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSubscriptionData();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [fetchSubscriptionData]);

  // Refresh when component becomes visible (page tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSubscriptionData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchSubscriptionData]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setLoading(true);
    await fetchSubscriptionData();
    toast.info("Study plan data refreshed");
  }, [fetchSubscriptionData]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto my-3 sm:my-4 md:my-5 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col justify-between items-start rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg bg-gray-100 border-l-4 border-gray-300">
          <div className="flex items-center space-x-3 sm:space-x-4 w-full">
            <div className="animate-pulse bg-gray-300 h-8 w-8 sm:h-10 sm:w-10 rounded-lg"></div>
            <div className="flex-1">
              <div className="animate-pulse bg-gray-300 h-4 sm:h-5 w-32 sm:w-40 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-300 h-3 sm:h-4 w-24 sm:w-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptionData === null) return null;

  const { daysLeft, planName, contactsRemaining, validUntil } = subscriptionData;
  const isSubscriptionExpiring = daysLeft <= 3 && daysLeft > 0;
  const isExpired = daysLeft === 0;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return dateString.slice(0, 10);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-3 sm:my-4 md:my-5 px-3 sm:px-4 md:px-6 lg:px-8">
      <div
        className={`flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-5 lg:gap-6 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 transition-all shadow-lg hover:shadow-xl ${
          isExpired
            ? "bg-gradient-to-br from-[#FFEBEE] to-[#FFCDD2] border-l-4 sm:border-l-[5px] md:border-l-[6px] border-[#EF5350]"
            : isSubscriptionExpiring
            ? "bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border-l-4 sm:border-l-[5px] md:border-l-[6px] border-[#35BAA3]"
            : "bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] border-l-4 sm:border-l-[5px] md:border-l-[6px] border-[#2F4380]"
        }`}
      >
        {/* LEFT SIDE — Subscription Info */}
        <div className="flex-1 w-full">
          {/* Header with refresh button */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <div
                className={`p-2 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-105 transition-transform ${
                  isExpired
                    ? "bg-gradient-to-br from-[#EF5350] to-[#D32F2F] text-white"
                    : isSubscriptionExpiring
                    ? "bg-gradient-to-br from-[#35BAA3] to-[#2E9C8A] text-white"
                    : "bg-gradient-to-br from-[#2F4380] to-[#1E2A5E] text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-lg sm:text-xl md:text-2xl font-bold truncate ${
                    isExpired ? "text-[#D32F2F]" : "text-[#2F4380]"
                  }`}
                >
                  Study Plan Status
                </h4>
                <p
                  className={`text-sm sm:text-base md:text-lg mt-0.5 sm:mt-1 ${
                    isExpired
                      ? "text-[#D32F2F] font-semibold"
                      : isSubscriptionExpiring
                      ? "text-[#35BAA3] font-semibold"
                      : "text-[#2F4380] font-medium"
                  }`}
                >
                  {isExpired
                    ? "Your study plan has expired!"
                    : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
                </p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              className="p-2 text-gray-500 hover:text-[#2F4380] hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-2"
              title="Refresh study plan data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 ml-0 sm:ml-8 md:ml-11 lg:ml-12">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Current Plan</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                {planName || "—"}
              </p>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium"> Contact Remaining</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {contactsRemaining !== undefined ? contactsRemaining : "—"}
              </p>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100 xs:col-span-2 sm:col-span-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Valid Until</p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {formatDate(validUntil)}
              </p>
            </div>
          </div>

          {/* Renewal Message */}
          {isSubscriptionExpiring && (
            <div className="mt-3 sm:mt-4 ml-0 sm:ml-8 md:ml-11 lg:ml-12">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border-l-3 sm:border-l-4 border-[#35BAA3]">
                <p className="text-xs sm:text-sm text-[#2F4380] font-semibold flex items-center gap-2">
                  <span className="text-base sm:text-lg md:text-xl">⚠️</span>
                  <span className="flex-1">Renew now to continue uninterrupted learning.</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE — CTA Button */}
        <div className="w-full lg:w-auto flex justify-stretch sm:justify-end lg:justify-center lg:items-start mt-2 sm:mt-0">
          <button
            onClick={() => navigate("/student_subscription_plan")}
            className={`w-full sm:w-auto min-w-[140px] lg:min-w-[160px] px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg font-bold text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isExpired
                ? "bg-gradient-to-r from-[#EF5350] to-[#D32F2F] hover:from-[#D32F2F] hover:to-[#C62828]"
                : isSubscriptionExpiring
                ? "bg-gradient-to-r from-[#35BAA3] to-[#2F4380] hover:from-[#2E9C8A] hover:to-[#1E2A5E]"
                : "bg-gradient-to-r from-[#2F4380] to-[#35BAA3] hover:from-[#1E2A5E] hover:to-[#2E9C8A]"
            }`}
          >
            {isExpired ? "Subscribe Now" : "Renew Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatusCard;