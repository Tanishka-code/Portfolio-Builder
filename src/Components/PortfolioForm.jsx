import { useState } from "react";
import axios from "axios";

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

  const handleAddProject = () => {

    if (!project.title || !project.description) return;

    setProjects([...projects, project]);

    setProject({
      title: "",
      description: "",
    });
  };

  const savePortfolio = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/portfolio",
        {
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
    <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl p-10">

      <h1 className="text-5xl font-extrabold tracking-tight mb-10 bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
        Create Portfolio
      </h1>

      <div className="space-y-6">

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
          className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none focus:border-purple-500 transition"
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
          className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none focus:border-green-500 transition"
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
          className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none h-40 focus:border-purple-500 transition"
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
          className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none focus:border-green-500 transition"
        />

      </div>

      <div className="mt-14">

        <h2 className="text-4xl font-bold mb-6 text-gray-800">
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
            className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none focus:border-purple-500 transition"
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
            className="w-full p-5 rounded-2xl bg-[#f7f7fb] border border-gray-200 outline-none h-32 focus:border-green-500 transition"
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