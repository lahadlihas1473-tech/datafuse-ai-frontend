import { useState } from "react";
import { apiGet } from "../lib/api";
import { useRecentSearches } from "./useRecentSearches";

// Material-estimation search state. Lives in App so the last passport
// survives navigating to other pages and back.
export function usePassportSearch() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { recentSearches, addRecentSearch, removeRecentSearch } =
    useRecentSearches();

  const searchAddress = async (searchValue) => {
    const searchedAddress = searchValue.trim();

    if (!searchedAddress) {
      setError("Please enter an address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiGet(
        `/material-estimation/search?address=${encodeURIComponent(
          searchedAddress
        )}`
      );

      setResult(data.data);

      // Save only when the API successfully finds the address
      addRecentSearch(searchedAddress);

      setAddress(searchedAddress);
    } catch (err) {
      setError(
        err.message || "No material estimation found for this address."
      );
    } finally {
      setLoading(false);
    }
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
