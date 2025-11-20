import { apiClient } from "../apiclient";
import { apiUrl } from "../apiUtl";
import { serializeParams } from "../utils/params";

const buildSearchParams = (filters = {}) => {
  const toArray = (v) =>
    v === undefined || v === null || v === ""
      ? undefined
      : Array.isArray(v)
      ? v
      : [v];

  const num = (v) =>
    v === "" || v === undefined || v === null ? undefined : Number(v);

  return {
    subjects: toArray(filters.subjects),
    classes: toArray(filters.classes),
    board: toArray(filters.board),
    availability: toArray(filters.availability),
    languages: toArray(filters.languages),
    teaching_modes: toArray(filters.teaching_modes),
    experience: num(filters.experience),
    budgetMin: num(filters.budgetMin),
    budgetMax: num(filters.budgetMax),
    location: filters.location || undefined,
    name: filters.name || undefined,
    gender: filters.gender && filters.gender !== "Any" ? filters.gender : undefined,
  };
};

export const searchTutors = async (filters) => {
  const params = buildSearchParams(filters);
  const qs = serializeParams(params);
  const url = `${apiUrl.search.tutors}${qs ? "?" + qs : ""}`;
  const res = await apiClient.get(url);
  return res.data?.tutors ?? [];
};

export const recommendedTutors = async (filters) => {
  const params = {
    name: filters?.name || undefined,
    budgetMin: filters?.budgetMin || undefined,
    budgetMax: filters?.budgetMax || undefined,
  };
  const qs = serializeParams(params);
  const url = `${apiUrl.recommendations.tutors}${qs ? "?" + qs : ""}`;
  const res = await apiClient.get(url);
  return res.data?.recommendedTutors ?? [];
};