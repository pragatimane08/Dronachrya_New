

// src/components/dashboard/SubscriptionStatusCard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiClient } from "../../../../api/apiclient";

const SubscriptionStatusCard = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

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
                "Premium Plan",
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
              planName: profile.plan_name || "Premium Plan",
              contactsRemaining: profile.contacts_remaining || 0,
              validUntil: profile.subscription_end_date || null,
            });
          }
        } catch (billingError) {
          console.error("❌ Failed to fetch billing history:", billingError);
          setSubscriptionData({
            daysLeft: profile.remaining_days,
            planName: profile.plan_name || "Premium Plan",
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

    setRefreshInterval(interval);

    // Cleanup interval on component unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchSubscriptionData]);

  // Additional manual refresh function that can be called when needed
  const handleManualRefresh = useCallback(async () => {
    setLoading(true);
    await fetchSubscriptionData();
    toast.info("Subscription data refreshed");
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

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto my-6 px-4">
        <div className="flex flex-col justify-between items-start rounded-2xl p-6 shadow-sm bg-gray-100 border-l-4 border-gray-300">
          <div className="flex items-center space-x-4 w-full">
            <div className="animate-pulse bg-gray-300 h-9 w-9 rounded-xl"></div>
            <div className="flex-1">
              <div className="animate-pulse bg-gray-300 h-6 w-40 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-300 h-4 w-32 rounded"></div>
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
    <div className="w-full max-w-5xl mx-auto my-6 px-4">
      <div
        className={`flex flex-col lg:flex-row justify-between items-start gap-6 rounded-2xl p-6 transition-all shadow-md ${
          isExpired
            ? "bg-[#FFEBEE] border-l-4 border-[#EF5350]"
            : isSubscriptionExpiring
            ? "bg-[#E8F5E9] border-l-4 border-[#35BAA3]"
            : "bg-[#E3F2FD] border-l-4 border-[#2F4380]"
        }`}
      >
        {/* LEFT SIDE — Subscription Info */}
        <div className="flex-1">
          {/* Header with refresh button */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isExpired
                    ? "bg-[#EF5350] text-white"
                    : isSubscriptionExpiring
                    ? "bg-[#35BAA3] text-white"
                    : "bg-[#2F4380] text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              <div>
                <h4
                  className={`text-xl font-semibold ${
                    isExpired ? "text-[#D32F2F]" : "text-[#2F4380]"
                  }`}
                >
                  Subscription Status
                </h4>
                <p
                  className={`text-base mt-1 ${
                    isExpired
                      ? "text-[#D32F2F] font-medium"
                      : isSubscriptionExpiring
                      ? "text-[#35BAA3] font-medium"
                      : "text-[#2F4380]"
                  }`}
                >
                  {isExpired
                    ? "Your subscription has expired!"
                    : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
                </p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              className="p-2 text-gray-500 hover:text-[#2F4380] hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Refresh subscription data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-1 sm:ml-11">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900 truncate">
                {planName || "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Contacts Remaining</p>
              <p className="text-lg font-semibold text-gray-900">
                {contactsRemaining !== undefined ? contactsRemaining : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Valid Until</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(validUntil)}
              </p>
            </div>
          </div>

          {/* Renewal Message */}
          {isSubscriptionExpiring && (
            <div className="mt-4 ml-1 sm:ml-11">
              <p className="text-sm text-[#2F4380] font-medium">
                ⚠️ Renew now to continue uninterrupted access.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE — CTA Button */}
        <div className="w-full lg:w-auto flex justify-end lg:justify-center">
          <button
            onClick={() => navigate("/tutor_subscription_plan")}
            className={`w-full lg:w-auto px-8 py-3 font-semibold text-white rounded-xl shadow-md transition-colors duration-200 ${
              isExpired
                ? "bg-[#EF5350] hover:bg-[#D32F2F]"
                : isSubscriptionExpiring
                ? "bg-[#35BAA3] hover:bg-[#2F4380]"
                : "bg-[#2F4380] hover:bg-[#35BAA3]"
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