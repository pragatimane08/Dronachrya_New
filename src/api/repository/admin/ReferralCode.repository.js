// src/repositories/referrals.repository.js
import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";

export const ReferralsRepository = {
  getAllReferrals: async () => {
    const response = await apiClient.get(apiUrl.referrals.all);
    return response.data;
  },

  markRewardGiven: async (id, rewardData) => {
    const response = await apiClient.put(apiUrl.referrals.reward(id), rewardData);
    return response.data;
  },
};
