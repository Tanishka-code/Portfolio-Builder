import {
  useEffect,
  useState,
  useContext,
} from "react";

import axios from "axios";

import {
  useParams,
  Link,
} from "react-router-dom";

import { ThemeContext } from "../t/ThemeContext";

const PortfolioDetails = () => {

  const { username } = useParams();

  const { darkMode } =
    useContext(ThemeContext);

  const [portfolio, setPortfolio] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchPortfolio();

  }, []);

  const fetchPortfolio = async () => {

    try {

      const response = await axios.get(
        `http://https://portfolio-builder-backend-8js4.onrender.com/api/portfolio/${username}`
      );

      setPortfolio(response.data);

    } catch (error) {

      console.log(error);

      setError(
        "Portfolio not found"
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div
        className={`min-h-screen flex items-center justify-center transition duration-500 ${
          darkMode
            ? "bg-[#0f0f14]"
            : "bg-[#f7f7fb]"
        }`}
      >

        <h1
          className={`text-4xl font-bold ${
            darkMode
              ? "text-white"
              : "text-gray-700"
          }`}
        >
          Loading...
        </h1>

      </div>

    );

  }

  if (error) {

    return (

      <div
        className={`min-h-screen flex flex-col items-center justify-center transition duration-500 ${
          darkMode
            ? "bg-[#0f0f14]"
            : "bg-[#f7f7fb]"
        }`}
      >

        <h1
          className={`text-5xl font-bold ${
            darkMode
              ? "text-white"
              : "text-gray-700"
          }`}
        >
          Portfolio Not Found
        </h1>

        <p
          className={`mt-4 ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          Try creating and saving it again.
        </p>

        <Link
          to="/"
          className="mt-8 bg-gradient-to-r from-purple-600 to-green-500 text-white px-6 py-3 rounded-2xl font-semibold"
        >
          Back To Builder
        </Link>

      </div>

    );

  }

  return (
    <div
      className={`min-h-screen p-10 flex justify-center transition duration-500 ${
        darkMode
          ? "bg-[#0f0f14]"
          : "bg-[#f7f7fb]"
      }`}
    >

      <div
        className={`shadow-2xl rounded-[32px] p-12 w-full max-w-4xl transition duration-500 ${
          darkMode
            ? "bg-[#14141c]"
            : "bg-white"
        }`}
      >

        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
          {portfolio.name}
        </h1>

        <p className="text-green-500 text-2xl mt-4">
          @{portfolio.username}
        </p>

        <h2
          className={`text-3xl mt-6 font-semibold ${
            darkMode
              ? "text-white"
              : "text-gray-700"
          }`}
        >
          {portfolio.role}
        </h2>

        <p
          className={`mt-8 text-lg leading-relaxed ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {portfolio.about}
        </p>

        <div className="mt-12">

          <h3
            className={`text-4xl font-bold mb-6 ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Skills
          </h3>

          <div className="flex flex-wrap gap-4">

            {portfolio.skills.map(
              (skill, index) => (

                <span
                  key={index}
                  className="bg-gradient-to-r from-purple-600 to-green-500 text-white px-5 py-2 rounded-full"
                >
                  {skill}
                </span>

              )
            )}

          </div>

        </div>

        <div className="mt-14">

          <h3
            className={`text-4xl font-bold mb-8 ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >
            Projects
          </h3>

          <div className="space-y-6">

            {portfolio.projects.map(
              (project, index) => (

                <div
                  key={index}
                  className={`p-6 rounded-3xl border transition duration-500 ${
                    darkMode
                      ? "bg-[#1c1c26] border-gray-700"
                      : "bg-[#f7f7fb] border-gray-200"
                  }`}
                >

                  <h4 className="text-2xl font-semibold text-purple-500">
                    {project.title}
                  </h4>

                  <p
                    className={`mt-3 ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {project.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default PortfolioDetails;