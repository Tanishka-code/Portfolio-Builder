import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PortfolioDetails = () => {

  const { id } = useParams();

  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {

    fetchPortfolio();

  }, []);

  const fetchPortfolio = async () => {

    try {

      const response = await axios.get(
        `http://localhost:5000/api/portfolio/${id}`
      );

      setPortfolio(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  if (!portfolio) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#181818] to-[#101010] rounded-3xl p-10">

        <h1 className="text-6xl font-bold">
          {portfolio.name}
        </h1>

        <h2 className="text-3xl text-green-400 mt-4">
          {portfolio.role}
        </h2>

        <p className="text-gray-300 mt-8 text-lg leading-relaxed">
          {portfolio.about}
        </p>

        <div className="mt-12">

          <h3 className="text-4xl font-bold mb-6">
            Skills
          </h3>

          <div className="flex flex-wrap gap-4">

            {portfolio.skills.map((skill, index) => (

              <span
                key={index}
                className="bg-green-500/20 text-green-400 px-5 py-2 rounded-full"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>

        <div className="mt-14">

          <h3 className="text-4xl font-bold mb-8">
            Projects
          </h3>

          <div className="space-y-6">

            {portfolio.projects.map((project, index) => (

              <div
                key={index}
                className="bg-[#202020] p-6 rounded-2xl border border-gray-700"
              >

                <h4 className="text-2xl font-semibold">
                  {project.title}
                </h4>

                <p className="text-gray-400 mt-3">
                  {project.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default PortfolioDetails;