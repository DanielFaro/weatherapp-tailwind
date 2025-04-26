import {useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "system");

  const element = document.documentElement;
  const darkkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const onWindowMatch = () => {
    if (localStorage.theme === "dark" || (!("theme" in localStorage) && darkkQuery.matches)) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  };

  useEffect(() => {
    onWindowMatch()
  }, []);

  useEffect(() => {
    switch (theme) {
      case "dark":
        element.classList.add("dark");
        localStorage.setItem("theme", "dark");
        break;
      case "light":
        console.log("light chosen")
        element.classList.remove("dark");
        localStorage.setItem("theme", "light");
        break;
      default:
        localStorage.removeItem("theme");
        onWindowMatch();
        break;
    }
  }, [theme]);

  useEffect(() => {
    const changeHandler = e => {
      if (!("theme" in localStorage)) {
        if (e.matches) {
          element.classList.add("dark")
        } else {
          element.classList.remove("dark")
        }
      }
    };

    darkkQuery.addEventListener("change", changeHandler);

    return () => {
      darkkQuery.removeEventListener("change", changeHandler);
    };
  }, []);

  return [theme, setTheme]
}

export default useTheme;

