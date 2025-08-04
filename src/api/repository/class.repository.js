// src/api/repository/class.repository.js

import { apiClient } from "../apiclient";

export const classRepository = {
  createClass: (payload) => apiClient.post("/classes", payload),
  getMyClasses: (userId) => apiClient.get("/classes", {
    params: { user_id: userId }
  }),
};
