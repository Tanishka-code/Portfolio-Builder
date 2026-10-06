const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const PORTFOLIO_API_URL = (
  configuredApiUrl || "https://portfolio-builder-backend-8js4.onrender.com/api/portfolio"
).replace(/\/+$/, "");
