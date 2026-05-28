import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {

  const [darkMode, setDarkMode] = useState(() => {

    const savedTheme = localStorage.getItem("theme");

    return savedTheme === "dark";

  });

  useEffect(() => {

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);

  const toggleTheme = () => {

    setDarkMode(!darkMode);

  };

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