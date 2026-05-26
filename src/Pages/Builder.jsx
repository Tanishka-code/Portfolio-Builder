import { useState } from "react";
import { Link } from "react-router-dom";

import PortfolioForm from "../components/PortfolioForm";
import PortfolioPreview from "../components/PortfolioPreview";

const Builder = () => {

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    about: "",
    skills: "",
  });

  const [projects, setProjects] = useState([]);

  return (
    <div className="min-h-screen bg-[#f7f7fb]">

      <div className="flex justify-between items-center px-10 py-6 bg-white border-b border-gray-200 sticky top-0 z-50">

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
          Portfolio Builder
        </h1>

        <Link
          to="/portfolios"
          className="bg-gradient-to-r from-purple-600 to-green-500 hover:scale-105 transition duration-300 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg"
        >
          Saved Portfolios
        </Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

        <PortfolioForm
          formData={formData}
          setFormData={setFormData}
          projects={projects}
          setProjects={setProjects}
        />

        <PortfolioPreview
          formData={formData}
          projects={projects}
        />

      </div>

    </div>
  );
};

export default Builder;