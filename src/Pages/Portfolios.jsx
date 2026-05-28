import { useEffect, useState, useContext } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

const Portfolios = () => {

  const [portfolios, setPortfolios] =
    useState([]);

  const { darkMode } =
    useContext(ThemeContext);

  useEffect(() => {

    fetchPortfolios();

  }, []);

  const fetchPortfolios = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/portfolio"
      );

      setPortfolios(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const deletePortfolio = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/portfolio/${id}`
      );

      setPortfolios(
        portfolios.filter(
          (portfolio) =>
            portfolio._id !== id
        )
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div
      className={`min-h-screen p-10 transition duration-500 ${
        darkMode
          ? "bg-[#0f0f14]"
          : "bg-[#f7f7fb]"
      }`}
    >

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
          Saved Portfolios
        </h1>

        <Link
          to="/"
          className="bg-gradient-to-r from-purple-600 to-green-500 hover:scale-105 transition px-6 py-3 rounded-2xl font-semibold text-white shadow-lg"
        >
          Back To Builder
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {portfolios.map((portfolio) => (

          <div
            key={portfolio._id}
            className={`p-8 rounded-[32px] border shadow-xl hover:-translate-y-1 transition duration-300 ${
              darkMode
                ? "bg-[#14141c] border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >

            <Link
              to={`/portfolio/${portfolio.username}`}
            >

              <h2
                className={`text-3xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {portfolio.name}
              </h2>

              <p className="text-green-500 mt-3 font-medium">
                @{portfolio.username}
              </p>

              <p
                className={`mt-5 ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {portfolio.role}
              </p>

            </Link>

            <button
              onClick={() =>
                deletePortfolio(
                  portfolio._id
                )
              }
              className="mt-8 bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-2xl font-semibold w-full text-white"
            >
              Delete Portfolio
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Portfolios;