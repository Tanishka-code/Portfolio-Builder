import { useCallback, useContext, useEffect, useState } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";
import { getApiErrorMessage, PORTFOLIO_API_URL } from "../api";

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const { darkMode } = useContext(ThemeContext);

  const loadPortfolios = useCallback(async () => {
    try {
      const response = await axios.get(PORTFOLIO_API_URL);
      return { portfolios: response.data, error: "" };
    } catch (error) {
      return {
        portfolios: null,
        error: getApiErrorMessage(error, "Could not load saved portfolios. Please try again."),
      };
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    loadPortfolios().then((result) => {
      if (!isCurrent) return;
      if (result.error) {
        setFetchError(result.error);
      } else {
        setPortfolios(result.portfolios);
      }
      setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, [loadPortfolios]);

  const retryFetch = async () => {
    setLoading(true);
    setFetchError("");
    const result = await loadPortfolios();
    if (result.error) {
      setFetchError(result.error);
    } else {
      setPortfolios(result.portfolios);
    }
    setLoading(false);
  };

  const deletePortfolio = async (portfolio) => {
    if (deletingId) return;

    const shouldDelete = window.confirm(
      `Delete the portfolio for ${portfolio.name} (@${portfolio.username})? This cannot be undone.`
    );
    if (!shouldDelete) return;

    setDeletingId(portfolio._id);
    setDeleteError("");

    try {
      await axios.delete(`${PORTFOLIO_API_URL}/${portfolio._id}`);
      setPortfolios((current) => current.filter((item) => item._id !== portfolio._id));
    } catch (error) {
      setDeleteError(
        `Could not delete ${portfolio.name}: ${getApiErrorMessage(error, "Please try again.")}`
      );
    } finally {
      setDeletingId("");
    }
  };

  const panelClass = darkMode
    ? "bg-[#14141c] border-gray-800 text-gray-300"
    : "bg-white border-gray-200 text-gray-500";

  return (
    <div
      className={`min-h-screen p-5 sm:p-10 transition duration-500 ${
        darkMode ? "bg-[#0f0f14]" : "bg-[#f7f7fb]"
      }`}
    >
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent sm:text-5xl">
          Saved Portfolios
        </h1>

        <Link
          to="/"
          className="rounded-2xl bg-gradient-to-r from-purple-600 to-green-500 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:scale-105"
        >
          Back To Builder
        </Link>
      </div>

      {fetchError && (
        <div role="alert" className={`mb-8 rounded-2xl border p-6 ${panelClass}`}>
          <p>{fetchError}</p>
          <button
            type="button"
            onClick={retryFetch}
            className="mt-4 rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white transition hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      )}

      {deleteError && (
        <p role="alert" className="mb-8 rounded-2xl border border-red-300 bg-red-100 p-5 text-red-700">
          {deleteError}
        </p>
      )}

      {loading ? (
        <div className={`rounded-[32px] border p-10 text-center shadow-xl ${panelClass}`}>
          <p className="text-lg font-semibold">Loading saved portfolios...</p>
        </div>
      ) : !fetchError && portfolios.length === 0 ? (
        <div className={`rounded-[32px] border border-dashed p-10 text-center shadow-xl ${panelClass}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            No portfolios saved yet
          </h2>
          <p className="mt-3">Create a portfolio and it will appear here.</p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-purple-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
          >
            Create Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className={`rounded-[32px] border p-6 shadow-xl transition duration-300 hover:-translate-y-1 sm:p-8 ${
                darkMode ? "bg-[#14141c] border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              <Link to={`/portfolio/${portfolio.username}`} className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
                <h2 className={`break-words text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {portfolio.name}
                </h2>
                <p className="mt-3 break-all font-medium text-green-500">
                  @{portfolio.username}
                </p>
                <p className={`mt-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {portfolio.role}
                </p>
              </Link>

              <Link
                to={`/?edit=${portfolio._id}`}
                className="mt-8 block w-full rounded-2xl bg-purple-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
              >
                Edit Portfolio
              </Link>

              <button
                type="button"
                onClick={() => deletePortfolio(portfolio)}
                disabled={Boolean(deletingId)}
                className="mt-3 w-full rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-70"
              >
                {deletingId === portfolio._id ? "Deleting..." : "Delete Portfolio"}
              </button>
              {deletingId === portfolio._id && (
                <p role="status" className={`mt-2 text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Deleting this portfolio...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolios;
