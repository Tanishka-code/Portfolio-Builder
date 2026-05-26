import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Portfolios = () => {

  const [portfolios, setPortfolios] = useState([]);

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
          (portfolio) => portfolio._id !== id
        )
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
          Saved Portfolios
        </h1>

        <Link
          to="/"
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-2xl font-semibold text-white shadow-lg"
        >
          Back To Builder
        </Link>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {portfolios.map((portfolio) => (

          <div
            key={portfolio._id}
            className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-xl hover:-translate-y-1 transition duration-300"
          >

            <Link
              to={`/portfolio/${portfolio._id}`}
            >

              <h2 className="text-3xl font-bold text-gray-800">
                {portfolio.name}
              </h2>

              <p className="text-green-600 mt-3 font-medium">
                {portfolio.role}
              </p>

              <p className="text-gray-500 mt-5 line-clamp-3">
                {portfolio.about}
              </p>

            </Link>

            <button
              onClick={() =>
                deletePortfolio(portfolio._id)
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