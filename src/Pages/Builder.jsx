import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import PortfolioForm from "../Components/PortfolioForm";
import PortfolioPreview from "../Components/PortfolioPreview";
import { PORTFOLIO_API_URL } from "../api";

import { ThemeContext } from "../context/ThemeContext";

const Builder = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");
  const [portfolioId, setPortfolioId] = useState("");
  const [pageError, setPageError] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "",
    about: "",
    skills: "",
    socialLinks: {
      github: "",
      linkedin: "",
      website: "",
      twitter: "",
    },
  });

  const [projects, setProjects] = useState([]);

  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  useEffect(() => {
    if (!editId) return;

    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `${PORTFOLIO_API_URL}/id/${encodeURIComponent(editId)}`
        );
        const portfolio = response.data;
        setPortfolioId(portfolio._id);
        setFormData({
          username: portfolio.username || "",
          name: portfolio.name || "",
          role: portfolio.role || "",
          about: portfolio.about || "",
          skills: (portfolio.skills || []).join(", "),
          socialLinks: {
            github: portfolio.socialLinks?.github || "",
            linkedin: portfolio.socialLinks?.linkedin || "",
            website: portfolio.socialLinks?.website || "",
            twitter: portfolio.socialLinks?.twitter || "",
          },
          profileImage: portfolio.profileImage || "",
        });
        setProjects(portfolio.projects || []);
      } catch (error) {
        setPageError(error.response?.data?.message || "Could not load this portfolio for editing.");
      }
    };

    fetchPortfolio();
  }, [editId]);

  useEffect(() => () => {
    if (profileImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(profileImagePreview);
    }
  }, [profileImagePreview]);

  return (
    <div
      className={`min-h-screen transition duration-500 ${
        darkMode
          ? "bg-[#0f0f14]"
          : "bg-[#f7f7fb]"
      }`}
    >

      <div
        className={`flex justify-between items-center px-10 py-6 sticky top-0 z-50 border-b transition duration-500 ${
          darkMode
            ? "bg-[#14141c] border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
          Portfolio Builder
        </h1>

        <div className="flex items-center gap-4">

          <button
            onClick={toggleTheme}
            className="bg-gradient-to-r from-purple-600 to-green-500 hover:scale-105 transition duration-300 px-5 py-3 rounded-2xl text-white font-semibold shadow-lg"
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <Link
            to="/portfolios"
            className="bg-gradient-to-r from-purple-600 to-green-500 hover:scale-105 transition duration-300 px-6 py-3 rounded-2xl text-white font-semibold shadow-lg"
          >
            Saved Portfolios
          </Link>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">

        <PortfolioForm
          formData={formData}
          setFormData={setFormData}
          projects={projects}
          setProjects={setProjects}
          portfolioId={portfolioId}
          isEditing={Boolean(editId)}
          onSaved={(username) => navigate(`/portfolio/${username}`)}
          onError={setPageError}
          profileImageFile={profileImageFile}
          setProfileImageFile={setProfileImageFile}
          profileImagePreview={profileImagePreview}
          setProfileImagePreview={setProfileImagePreview}
        />

        {pageError && (
          <p role="alert" className="lg:col-span-2 rounded-2xl bg-red-100 text-red-700 p-4">
            {pageError}
          </p>
        )}

        <PortfolioPreview
          formData={formData}
          projects={projects}
          profileImage={profileImagePreview || formData.profileImage}
        />

      </div>

    </div>
  );
};

export default Builder;
