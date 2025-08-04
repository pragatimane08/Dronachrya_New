import { apiClient } from "../apiclient";

export const getTutors = async () => {
  const res = await apiClient.get("/search/tutors");
  return res.data.tutors;
};