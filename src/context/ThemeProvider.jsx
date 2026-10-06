import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const getSavedTheme = () => {
  try {
    return localStorage.getItem("theme") === "dark";
  } catch {
    return false;
  }
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getSavedTheme);

  useEffect(() => {
    try {
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    } catch {
      // The selected theme remains active for this page session.
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((current) => !current);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
