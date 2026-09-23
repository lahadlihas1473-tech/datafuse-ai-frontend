import { useState } from "react";
import { apiGet, buildQuery } from "../lib/api";

// Method 2 search state (GET /method-2/search?address=…). Lives in App so
// the last result survives navigating to other pages and back.
export function useMethod2Search() {
  const [address, setAddress] = useState("");
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchAddress = async (searchValue) => {
    const searchedAddress = (searchValue ?? "").trim();

    if (!searchedAddress) {
      setError("Please enter an address.");
      return;
    }

    setLoading(true);
    setError("");
    setItems(null);
    setAddress(searchedAddress);

    try {
      const data = await apiGet(
        `/method-2/search${buildQuery({ address: searchedAddress })}`
      );

      setItems(data.data?.items ?? []);
    } catch (err) {
      setError(err.message || "No Method 2 record found for this address.");
    } finally {
      setLoading(false);
    }
  };

  return {
    address,
    setAddress,
    items,
    loading,
    error,
    searchAddress,
  };
}
