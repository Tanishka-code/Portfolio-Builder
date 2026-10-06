const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const PORTFOLIO_API_URL = (
  configuredApiUrl || "https://portfolio-builder-backend-8js4.onrender.com/api/portfolio"
).replace(/\/+$/, "");

export const getApiErrorMessage = (error, fallback = "The request could not be completed.") => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (/username.*(already exists|duplicate)|duplicate key/i.test(backendMessage || "")) {
    return "That username is already in use. Choose another username.";
  }
  if (backendMessage) return backendMessage;
  if (status) {
    if (status >= 500) return `The server could not complete the request (HTTP ${status}). Please try again.`;
    return `The request was rejected (HTTP ${status}). Please check the submitted information.`;
  }
  if (error?.request) {
    return "No response from the backend. Check the API URL, Render availability, and whether Render allows this frontend origin in FRONTEND_ORIGINS (CORS).";
  }
  return fallback;
};
