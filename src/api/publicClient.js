// src/api/publicClient.js
import axios from "axios";
import { apiUrl } from "./apiUtl";

const publicClient = axios.create({
  baseURL: apiUrl.baseUrl,
  headers: { "Content-Type": "application/json" },
});

export default publicClient;
