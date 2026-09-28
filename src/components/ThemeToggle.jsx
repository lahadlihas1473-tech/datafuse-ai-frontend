import { useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

// Same key as the inline script in index.html, which applies the saved
// theme before the first paint
const STORAGE_KEY = "resource-paspoort-theme";
const THEME_COLOR = { light: "#ffffff", dark: "#181c20" };

const currentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

// One button that switches the whole application between the light and
// dark theme. Visual only: it sets data-theme on <html>.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const next = theme === "dark" ? "light" : "dark";

  const handleClick = () => {
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[next]);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.error("Could not save the theme:", error);
    }

    setTheme(next);
  };

  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
