import { apiClient } from "../../apiclient";
import { apiUrl } from "../../apiUtl";

export const CouponRepository = {
  list: () => apiClient.get(apiUrl.admin.coupons.list),
  create: (payload) => apiClient.post(apiUrl.admin.coupons.create, payload),
  toggle: (id) => apiClient.patch(apiUrl.admin.coupons.toggle(id)),
  remove: (id) => apiClient.delete(apiUrl.admin.coupons.delete(id)),
  apply: ({ code, plan }) => apiClient.post(apiUrl.coupon.apply, { code, plan }),
  getUsage: () => apiClient.get(apiUrl.admin.coupons.usage),
  getAvailable: () => apiClient.get(apiUrl.coupons.available),
};