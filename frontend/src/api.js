import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

function friendlyError(error) {
  if (error.code === "ECONNABORTED") {
    return "The analysis request timed out. Please try again.";
  }
  if (!error.response) {
    return `Could not reach the TrustShield AI backend at ${BASE_URL}. Make sure the FastAPI server is running (see backend/README instructions).`;
  }
  return error.response?.data?.detail
    ? JSON.stringify(error.response.data.detail)
    : "Something went wrong talking to the backend.";
}

export async function analyzeMessage(message, language = "auto") {
  try {
    const { data } = await client.post("/api/analyze", { message, language });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: friendlyError(error) };
  }
}

export async function checkUrl(url) {
  try {
    const { data } = await client.post("/api/url-check", { url });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: friendlyError(error) };
  }
}

export async function getDashboard() {
  try {
    const { data } = await client.get("/api/dashboard");
    return { data, error: null };
  } catch (error) {
    return { data: null, error: friendlyError(error) };
  }
}

export async function getHealth() {
  try {
    const { data } = await client.get("/api/health");
    return { data, error: null };
  } catch (error) {
    return { data: null, error: friendlyError(error) };
  }
}
