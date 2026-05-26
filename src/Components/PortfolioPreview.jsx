const PortfolioPreview = ({
  formData,
  projects,
}) => {

  return (
    <div className="bg-white rounded-[32px] border border-gray-200 shadow-xl p-10 h-fit sticky top-28">

      <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-green-500 bg-clip-text text-transparent">
        {formData.name || "Your Name"}
      </h1>

      <h2 className="text-3xl text-gray-700 mt-5 font-semibold">
        {formData.role || "Frontend Developer"}
      </h2>

      <p className="text-gray-500 mt-8 text-lg leading-relaxed">
        {formData.about || "Write something about yourself..."}
      </p>

      <div className="mt-12 border-t border-gray-200 pt-10">

        <h3 className="text-4xl font-bold text-gray-800 mb-6">
          Skills
        </h3>

        <div className="flex flex-wrap gap-4">

          {formData.skills &&
            formData.skills
              .split(",")
              .map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-5 py-2 rounded-full text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}

        </div>

      </div>

      <div className="mt-14">

        <h3 className="text-4xl font-bold text-gray-800 mb-8">
          Projects
        </h3>

        <div className="space-y-6">

          {projects.map((project, index) => (

            <div
              key={index}
              className="bg-[#f7f7fb] p-6 rounded-3xl border border-gray-200 hover:-translate-y-1 transition duration-300"
            >

              <h4 className="text-2xl font-semibold text-purple-700">
                {project.title}
              </h4>

              <p className="text-gray-500 mt-3 leading-relaxed">
                {project.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default PortfolioPreview;