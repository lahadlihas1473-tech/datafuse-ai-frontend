import { useState } from "react";
import { apiGet, buildQuery } from "../lib/api";
import { useRecentSearches } from "./useRecentSearches";

// Building passport search: the same two requests the Method 1 and
// Method 2 pages make (GET /material-estimation/search and
// GET /method-2/search), shown together as one building record.
// Lives in App so the last record survives switching pages.
export function useBuildingSearch() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { recentSearches, addRecentSearch, removeRecentSearch } =
    useRecentSearches("datafuse_recent_searches_passport");

  const searchAddress = async (searchValue) => {
    const searchedAddress = (searchValue ?? "").trim();

    if (!searchedAddress) {
      setError("Please enter an address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAddress(searchedAddress);

    const [method1, method2] = await Promise.allSettled([
      apiGet(`/material-estimation/search${buildQuery({ address: searchedAddress })}`),
      apiGet(`/method-2/search${buildQuery({ address: searchedAddress })}`),
    ]);

    const estimate = method1.status === "fulfilled" ? method1.value.data : null;
    const items = method2.status === "fulfilled" ? method2.value.data?.items ?? [] : [];

    // The Method 2 record of the same building (same pand ID), else the
    // first match
    const geometry =
      items.find((item) => estimate && item.pand_id === estimate.pand_id) ??
      items[0] ??
      null;

    if (!estimate && !geometry) {
      setError(
        method1.reason?.message ||
          method2.reason?.message ||
          "No building found for this address."
      );
    } else {
      setResult({ estimate, geometry, matches: items.length });
      addRecentSearch(searchedAddress);
    }

    setLoading(false);
  };

  return {
    address,
    setAddress,
    result,
    loading,
    error,
    searchAddress,
    recentSearches,
    removeRecentSearch,
  };
}
