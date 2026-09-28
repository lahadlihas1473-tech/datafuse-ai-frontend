import { useCallback, useState } from "react";

// Each search page keeps its own list; Method 1 uses the original key
const DEFAULT_KEY = "datafuse_recent_searches";
const MAX_RECENT_SEARCHES = 3;

const readSearches = (storageKey) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]");

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

const writeSearches = (storageKey, searches) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(searches));
  } catch (error) {
    console.error("Could not save recent searches:", error);
  }
};

// Last 3 successful searches, newest first, no duplicates
export function useRecentSearches(storageKey = DEFAULT_KEY) {
  // Lazy initial state reads storage once, without an effect
  const [recentSearches, setRecentSearches] = useState(() =>
    readSearches(storageKey)
  );

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

      writeSearches(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const removeRecentSearch = useCallback((value) => {
    setRecentSearches((current) => {
      const next = current.filter((item) => item !== value);

      writeSearches(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return { recentSearches, addRecentSearch, removeRecentSearch };
}
