import { useContext, useState } from "react";

import axios from "axios";

import { ThemeContext } from "../context/ThemeProvider";

const PortfolioForm = ({
  formData,
  setFormData,
  projects,
  setProjects,
}) => {

  const [project, setProject] = useState({
    title: "",
    description: "",
  });

  const { darkMode } =
    useContext(ThemeContext);

  const handleAddProject = () => {

    if (!project.title || !project.description)
      return;

    setProjects([...projects, project]);

    setProject({
      title: "",
      description: "",
    });

  };

  const savePortfolio = async () => {

    try {

      await axios.post(
        "https://portfolio-builder-backend-8js4.onrender.com/api/portfolio",
        {
          username:
            formData.username || "",

          name: formData.name || "",

          role: formData.role || "",

          about: formData.about || "",

          skills: formData.skills
            ? formData.skills
                .split(",")
                .map((skill) => skill.trim())
            : [],

          projects,
        }
      );

      alert("Portfolio Saved Successfully");

    } catch (error) {

      console.log(
        error.response?.data || error.message
      );

    }

  };

  return (
    <div
      className={`rounded-[32px] border shadow-xl p-10 transition duration-500 ${
        darkMode
          ? "bg-[#14141c] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >

      <h1 className="text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
        Create Portfolio
      </h1>

      <div className="space-y-6">

        <input
          type="text"
          placeholder="Username (unique)"
          value={formData.username}
          onChange={(e) =>
            setFormData({
              ...formData,
              username: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <input
          type="text"
          placeholder="Your Role"
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <textarea
          placeholder="About You"
          value={formData.about}
          onChange={(e) =>
            setFormData({
              ...formData,
              about: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none h-40 transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={(e) =>
            setFormData({
              ...formData,
              skills: e.target.value,
            })
          }
          className={`w-full p-5 rounded-2xl outline-none transition ${
            darkMode
              ? "bg-[#1c1c26] border border-gray-700 text-white"
              : "bg-[#f7f7fb] border border-gray-200 text-black"
          }`}
        />

      </div>

      <div className="mt-14">

        <h2
          className={`text-4xl font-bold mb-6 ${
            darkMode
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Add Projects
        </h2>

        <div className="space-y-6">

          <input
            type="text"
            placeholder="Project Title"
            value={project.title}
            onChange={(e) =>
              setProject({
                ...project,
                title: e.target.value,
              })
            }
            className={`w-full p-5 rounded-2xl outline-none transition ${
              darkMode
                ? "bg-[#1c1c26] border border-gray-700 text-white"
                : "bg-[#f7f7fb] border border-gray-200 text-black"
            }`}
          />

          <textarea
            placeholder="Project Description"
            value={project.description}
            onChange={(e) =>
              setProject({
                ...project,
                description: e.target.value,
              })
            }
            className={`w-full p-5 rounded-2xl outline-none h-32 transition ${
              darkMode
                ? "bg-[#1c1c26] border border-gray-700 text-white"
                : "bg-[#f7f7fb] border border-gray-200 text-black"
            }`}
          />

          <div className="flex gap-4">

            <button
              onClick={handleAddProject}
              className="bg-purple-600 hover:bg-purple-700 transition px-6 py-4 rounded-2xl font-semibold text-white shadow-lg"
            >
              Add Project
            </button>

            <button
              onClick={savePortfolio}
              className="bg-green-500 hover:bg-green-600 transition px-6 py-4 rounded-2xl font-semibold text-white shadow-lg"
            >
              Save Portfolio
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PortfolioForm;