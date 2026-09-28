import { useCallback, useEffect, useRef, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

// Same key as the inline script in index.html, which applies the saved
// theme before the first paint
const STORAGE_KEY = "resource-paspoort-theme";
const POSITION_KEY = "resource-paspoort-theme-button";
const THEME_COLOR = { light: "#ffffff", dark: "#181c20" };

const SIZE = 34;            // button width and height (px)
const EDGE = 6;             // closest distance to the screen edge (px)
const DRAG_THRESHOLD = 5;   // movement (px) that turns a press into a drag

const currentTheme = () =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

// Largest top-left position that keeps the whole button on screen
const limits = () => ({
  maxX: Math.max(EDGE, window.innerWidth - SIZE - EDGE),
  maxY: Math.max(EDGE, window.innerHeight - SIZE - EDGE),
});

const clamp = ({ x, y }) => {
  const { maxX, maxY } = limits();
  return {
    x: Math.min(Math.max(x, EDGE), maxX),
    y: Math.min(Math.max(y, EDGE), maxY),
  };
};

// Default: top right, in the header bar
const defaultPosition = () => clamp({ x: window.innerWidth - SIZE - 16, y: 11 });

// The position is saved as a share of the free space, so a button placed
// at an edge stays at that edge when the window size changes
const readPosition = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(POSITION_KEY) ?? "null");
    if (saved && Number.isFinite(saved.fx) && Number.isFinite(saved.fy)) {
      const { maxX, maxY } = limits();
      return clamp({ x: saved.fx * maxX, y: saved.fy * maxY });
    }
  } catch (error) {
    console.error("Could not read the theme button position:", error);
  }
  return defaultPosition();
};

const savePosition = ({ x, y }) => {
  const { maxX, maxY } = limits();
  try {
    localStorage.setItem(
      POSITION_KEY,
      JSON.stringify({ fx: maxX ? x / maxX : 0, fy: maxY ? y / maxY : 0 })
    );
  } catch (error) {
    console.error("Could not save the theme button position:", error);
  }
};

// One button that switches the whole application between the light and
// dark theme. It stays on screen while scrolling and can be dragged
// (mouse or touch) to any place; a click without dragging toggles.
// Visual only: it sets data-theme on <html>.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const [position, setPosition] = useState(readPosition);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const next = theme === "dark" ? "light" : "dark";

  // Keep the button on screen when the window changes size
  useEffect(() => {
    const handleResize = () => setPosition(readPosition());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
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

  const handleClick = () => {
    // The click that ends a drag does not toggle
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    toggleTheme();
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
      moved: false,
    };
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = useCallback((event) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;

    if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
      return;
    }

    if (!current.moved) {
      current.moved = true;
      setDragging(true);
    }

    setPosition(clamp({ x: current.origin.x + dx, y: current.origin.y + dy }));
  }, []);

  const endDrag = (event) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    if (current.moved) {
      suppressClick.current = true;
      setDragging(false);
      setPosition((last) => {
        savePosition(last);
        return last;
      });
    }

    drag.current = null;
  };

  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      className={`theme-toggle${dragging ? " theme-toggle--dragging" : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={label}
      title={`${label} (drag to move)`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
