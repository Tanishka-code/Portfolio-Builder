import {
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";

import axios from "axios";

import {
  useParams,
  Link,
} from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";
import ProfileAvatar from "../Components/ProfileAvatar";
import PortfolioPdfDocument from "../Components/PortfolioPdfDocument";
import { PORTFOLIO_API_URL } from "../api";

const isSafeSocialUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
};

const PortfolioDetails = () => {

  const { username } = useParams();

  const { darkMode } =
    useContext(ThemeContext);

  const [portfolio, setPortfolio] =
    useState(null);

  const socialLinks = [
    { label: "GitHub", url: portfolio?.socialLinks?.github },
    { label: "LinkedIn", url: portfolio?.socialLinks?.linkedin },
    { label: "Website", url: portfolio?.socialLinks?.website },
    { label: "X / Twitter", url: portfolio?.socialLinks?.twitter },
  ].filter(({ url }) => url?.trim() && isSafeSocialUrl(url));

  const [loading, setLoading] =
    useState(true);
  const [loadedUsername, setLoadedUsername] = useState("");

  const [error, setError] =
    useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const pdfDocumentRef = useRef(null);
  const pdfGeneratingRef = useRef(false);

  useEffect(() => {
    let isCurrent = true;

    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `${PORTFOLIO_API_URL}/${encodeURIComponent(username)}`
        );
        if (isCurrent) {
          setPortfolio(response.data);
          setError("");
        }
      } catch (fetchError) {
        if (isCurrent) {
          setError(fetchError.response?.status === 404
            ? "Portfolio not found. Check the username or return to Saved Portfolios."
            : "Could not load this portfolio. Check your connection and try again.");
        }
      } finally {
        if (isCurrent) {
          setLoadedUsername(username);
          setLoading(false);
        }
      }
    };

    fetchPortfolio();
    return () => {
      isCurrent = false;
    };
  }, [username]);

  const downloadPdf = async () => {
    const exportElement = pdfDocumentRef.current;
    if (!portfolio || !exportElement || pdfGeneratingRef.current) return;

    const elementBounds = exportElement.getBoundingClientRect();
    if (elementBounds.width <= 0 || exportElement.scrollHeight <= 0) {
      setPdfError("The portfolio content is not ready to export. Please try again.");
      return;
    }

    pdfGeneratingRef.current = true;
    setPdfGenerating(true);
    setPdfError("");

    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const profileImage = exportElement.querySelector("img");
      let profileImageReady = false;
      if (profileImage) {
        try {
          await profileImage.decode();
          profileImageReady = profileImage.naturalWidth > 0 && profileImage.naturalHeight > 0;
        } catch {
          // The rest of the portfolio should still export if Cloudinary rejects CORS or the image is unavailable.
        }
      }

      const captureCanvas = async (omitProfileImage = false) => {
        const canvas = await html2canvas(exportElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          windowWidth: 794,
          windowHeight: Math.max(window.innerHeight, 900),
          scrollX: 0,
          scrollY: 0,
          onclone: async (clonedDocument) => {
            const clonedExport = clonedDocument.getElementById("portfolio-pdf-document");
            if (!clonedExport) return;

            // Put the rendered export document in the clone's viewport so the canvas captures real content.
            Object.assign(clonedExport.style, {
              display: "block",
              position: "absolute",
              top: "0",
              left: "0",
              right: "auto",
              width: "794px",
              margin: "0",
              transform: "none",
              visibility: "visible",
            });

            if (omitProfileImage || !profileImageReady) {
              clonedExport.querySelector("img")?.remove();
            }

            if (clonedDocument.fonts?.ready) await clonedDocument.fonts.ready;
          },
        });

        if (!canvas.width || !canvas.height) {
          throw new Error("PDF capture produced an empty canvas");
        }

        // Refuse to download a blank image even if the canvas dimensions look valid.
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const pixels = context?.getImageData(0, 0, canvas.width, canvas.height).data;
        let hasVisibleContent = false;
        if (pixels) {
          for (let index = 0; index < pixels.length; index += 160) {
            if (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245) {
              hasVisibleContent = true;
              break;
            }
          }
        }
        if (!hasVisibleContent) {
          throw new Error("PDF capture contained no visible portfolio content");
        }

        return canvas;
      };

      let canvas;
      try {
        canvas = await captureCanvas(false);
      } catch (imageCaptureError) {
        if (!profileImage || !profileImageReady) throw imageCaptureError;
        canvas = await captureCanvas(true);
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const margin = 14;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;
      const sourcePageHeight = Math.floor((contentHeight / contentWidth) * canvas.width);
      const context = canvas.getContext("2d");
      let sourceY = 0;
      let pageIndex = 0;

      while (sourceY < canvas.height) {
        const targetY = Math.min(sourceY + sourcePageHeight, canvas.height);
        let pageEndY = targetY;

        // Prefer a nearby blank row for page breaks so paragraphs are less likely to split mid-line.
        if (targetY < canvas.height) {
          const searchStart = Math.max(sourceY + 1, targetY - 100);
          const searchHeight = targetY - searchStart;
          const pixels = context.getImageData(0, searchStart, canvas.width, searchHeight).data;
          for (let row = searchHeight - 1; row >= 0; row -= 1) {
            let nonWhiteSamples = 0;
            for (let x = 0; x < canvas.width; x += 16) {
              const pixelIndex = (row * canvas.width + x) * 4;
              if (pixels[pixelIndex] < 245 || pixels[pixelIndex + 1] < 245 || pixels[pixelIndex + 2] < 245) {
                nonWhiteSamples += 1;
                if (nonWhiteSamples > 2) break;
              }
            }
            if (nonWhiteSamples === 0) {
              pageEndY = searchStart + row;
              break;
            }
          }
        }

        const sliceHeight = Math.max(1, pageEndY - sourceY);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        pageCanvas.getContext("2d").drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );

        if (pageIndex > 0) pdf.addPage();
        const sliceHeightMm = (sliceHeight / canvas.width) * contentWidth;
        const imageData = pageCanvas.toDataURL("image/jpeg", 0.95);
        if (imageData.length < 100) {
          throw new Error("PDF page image was empty");
        }
        pdf.addImage(imageData, "JPEG", margin, margin, contentWidth, sliceHeightMm);

        sourceY = pageEndY;
        pageIndex += 1;
      }

      const filename = `${(portfolio.username || "portfolio")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "portfolio"}-portfolio.pdf`;
      pdf.save(filename);
    } catch (generationError) {
      console.error("Portfolio PDF export failed:", generationError.message);
      setPdfError("The PDF could not be generated. Please try again.");
    } finally {
      pdfGeneratingRef.current = false;
      setPdfGenerating(false);
    }
  };

  if (loading || loadedUsername !== username) {

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

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Portfolio
          </h2>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={pdfGenerating}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-green-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
          >
            {pdfGenerating ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>

        {pdfError && (
          <p role="alert" className="mb-6 rounded-2xl bg-red-100 p-4 text-red-700">
            {pdfError}
          </p>
        )}

        <ProfileAvatar
          src={portfolio.profileImage}
          alt={`${portfolio.name} profile image`}
          className="mb-6 h-28 w-28 sm:h-36 sm:w-36"
        />

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

        {socialLinks.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-to-r from-purple-600 to-green-500 px-5 py-2 font-semibold text-white shadow transition hover:scale-105"
              >
                {label}
              </a>
            ))}
          </div>
        )}

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

      <PortfolioPdfDocument
        documentRef={pdfDocumentRef}
        portfolio={portfolio}
        socialLinks={socialLinks}
      />

    </div>
  );
};

export default PortfolioDetails;
