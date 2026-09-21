import { useCallback, useState } from "react";

const STORAGE_KEY = "datafuse_recent_searches";
const MAX_RECENT_SEARCHES = 3;

const readSearches = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    return Array.isArray(parsed)
      ? parsed
          .filter((item) => typeof item === "string")
          .slice(0, MAX_RECENT_SEARCHES)
      : [];
  } catch (error) {
    console.error("Could not load recent searches:", error);
    return [];
  }
};

const writeSearches = (searches) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch (error) {
    console.error("Could not save recent searches:", error);
  }
};

// Last 3 successful searches, newest first, no duplicates
export function useRecentSearches() {
  // Lazy initial state reads storage once, without an effect
  const [recentSearches, setRecentSearches] = useState(readSearches);

  const addRecentSearch = useCallback((value) => {
    const normalized = value.trim();

    if (!normalized) {
      return;
    }

    setRecentSearches((current) => {
      const next = [
        normalized,
        ...current.filter(
          (item) => item.toLowerCase() !== normalized.toLowerCase()
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      writeSearches(next);
      return next;
    });
  }, []);

  const removeRecentSearch = useCallback((value) => {
    setRecentSearches((current) => {
      const next = current.filter((item) => item !== value);

      writeSearches(next);
      return next;
    });
  }, []);

  return { recentSearches, addRecentSearch, removeRecentSearch };
}
