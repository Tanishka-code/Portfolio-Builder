import { useContext } from "react";
import { TypeAnimation } from "react-type-animation";

import { ThemeContext } from "../context/ThemeProvider";

const PortfolioPreview = ({
  formData,
  projects,
}) => {

  const { darkMode } =
    useContext(ThemeContext);

  return (
    <div
      className={`rounded-[32px] border shadow-2xl p-10 h-fit sticky top-28 overflow-hidden relative transition duration-500 ${
        darkMode
          ? "bg-[#14141c] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >

      {/* Gradient Blur Effects */}

      <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] left-[-100px] w-[250px] h-[250px] bg-green-500/20 blur-3xl rounded-full"></div>

      {/* Content */}

      <div className="relative z-10">

        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent leading-tight">

          {formData.name || "Your Name"}

        </h1>

        <h2
          className={`text-3xl mt-5 font-semibold transition duration-500 ${
            darkMode
              ? "text-gray-200"
              : "text-gray-700"
          }`}
        >

          {formData.role || "Frontend Developer"}

        </h2>

        <div
          className={`mt-6 text-lg font-medium transition duration-500 ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >

          <TypeAnimation
            sequence={[
              "I build modern web experiences.",
              2000,
              "Creating beautiful full stack applications.",
              2000,
              "Designing interactive user interfaces.",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />

        </div>

        <p
          className={`mt-8 text-lg leading-relaxed transition duration-500 ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >

          {formData.about ||
            "Write something about yourself..."}

        </p>

        <div
          className={`mt-12 pt-10 border-t transition duration-500 ${
            darkMode
              ? "border-gray-800"
              : "border-gray-200"
          }`}
        >

          <h3
            className={`text-4xl font-bold mb-6 transition duration-500 ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >

            Skills

          </h3>

          <div className="flex flex-wrap gap-4">

            {formData.skills ? (
              formData.skills
                .split(",")
                .map((skill, index) => (

                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-500 to-green-500 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg hover:scale-105 transition duration-300"
                  >

                    {skill.trim()}

                  </span>

                ))
            ) : (

              <p
                className={`transition duration-500 ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >

                Add your skills to preview them here.

              </p>

            )}

          </div>

        </div>

        <div className="mt-14">

          <h3
            className={`text-4xl font-bold mb-8 transition duration-500 ${
              darkMode
                ? "text-white"
                : "text-gray-800"
            }`}
          >

            Projects

          </h3>

          <div className="space-y-6">

            {projects.length > 0 ? (

              projects.map((project, index) => (

                <div
                  key={index}
                  className={`p-6 rounded-3xl border hover:-translate-y-1 hover:shadow-2xl transition duration-300 ${
                    darkMode
                      ? "bg-[#1c1c26] border-gray-700"
                      : "bg-[#f7f7fb] border-gray-200"
                  }`}
                >

                  <h4 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">

                    {project.title}

                  </h4>

                  <p
                    className={`mt-3 leading-relaxed transition duration-500 ${
                      darkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >

                    {project.description}

                  </p>

                </div>

              ))

            ) : (

              <div
                className={`p-8 rounded-3xl border border-dashed text-center transition duration-500 ${
                  darkMode
                    ? "border-gray-700 text-gray-500"
                    : "border-gray-300 text-gray-400"
                }`}
              >

                No projects added yet.

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default PortfolioPreview;