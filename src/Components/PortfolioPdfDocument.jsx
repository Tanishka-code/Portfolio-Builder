const sectionStyle = {
  marginTop: "28px",
  paddingTop: "16px",
  borderTop: "1px solid #e5e7eb",
};

const headingStyle = {
  margin: "0 0 12px",
  color: "#4f46a5",
  fontSize: "18px",
  fontWeight: 700,
};

const PortfolioPdfDocument = ({ portfolio, socialLinks, documentRef }) => {
  const skills = portfolio.skills || [];
  const projects = portfolio.projects || [];

  return (
    <article
      id="portfolio-pdf-document"
      ref={documentRef}
      style={{
        position: "fixed",
        top: 0,
        left: "-10000px",
        width: "794px",
        boxSizing: "border-box",
        padding: "48px 54px",
        backgroundColor: "#ffffff",
        color: "#1f2937",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "14px",
        lineHeight: 1.6,
      }}
    >
      <header style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {portfolio.profileImage && (
          <img
            src={portfolio.profileImage}
            crossOrigin="anonymous"
            alt=""
            style={{
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #e5e7eb",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, color: "#111827", fontSize: "32px", lineHeight: 1.2 }}>
            {portfolio.name}
          </h1>
          <p style={{ margin: "8px 0 0", color: "#4f46a5", fontSize: "18px", fontWeight: 600 }}>
            {portfolio.role}
          </p>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "12px" }}>
            @{portfolio.username}
          </p>
        </div>
      </header>

      {portfolio.about && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>About</h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {portfolio.about}
          </p>
        </section>
      )}

      {skills.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Skills</h2>
          <p style={{ margin: 0, overflowWrap: "anywhere" }}>{skills.join("  •  ")}</p>
        </section>
      )}

      {projects.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Projects</h2>
          {projects.map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              style={{
                marginTop: index === 0 ? 0 : "16px",
                padding: "14px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                pageBreakInside: "avoid",
              }}
            >
              <h3 style={{ margin: 0, color: "#312e81", fontSize: "15px" }}>
                {project.title}
              </h3>
              {project.description && (
                <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {socialLinks.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Contact &amp; Links</h2>
          {socialLinks.map(({ label, url }) => (
            <p key={label} style={{ margin: "5px 0", overflowWrap: "anywhere" }}>
              <strong>{label}: </strong>
              <a href={url} style={{ color: "#4338ca", textDecoration: "underline" }}>
                {url}
              </a>
            </p>
          ))}
        </section>
      )}
    </article>
  );
};

export default PortfolioPdfDocument;
