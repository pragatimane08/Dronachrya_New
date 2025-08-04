import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";

export const analyticsRepository = {
  getSummary: async () => {
    const { data } = await apiClient.get(apiUrl.analytics.summary);
    return data;
  },
};