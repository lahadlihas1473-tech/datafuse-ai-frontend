import { useState } from "react";
import "./App.css";
import Capabilities from "./components/Capabilities";
import Header from "./components/Header";
import Passport, { PassportSkeleton } from "./components/Passport";
import SearchPanel from "./components/SearchPanel";
import { useRecentSearches } from "./hooks/useRecentSearches";

// Set per environment: .env.development locally, Vercel env vars in production
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function App() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { recentSearches, addRecentSearch, removeRecentSearch } =
    useRecentSearches();

  // Search an address
  const searchAddress = async (searchValue) => {
    const searchedAddress = searchValue.trim();

    if (!searchedAddress) {
      setError("Please enter an address.");
      return;
    }

    if (!API_URL) {
      setError("The API URL is not configured (VITE_API_URL).");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_URL}/material-estimation/search?address=${encodeURIComponent(
          searchedAddress
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "No material estimation found for this address."
        );
      }

      setResult(data.data);

      // Save only when the API successfully finds the address
      addRecentSearch(searchedAddress);

      setAddress(searchedAddress);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasContent = loading || Boolean(result);

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true" />

      <Header />

      <main className="container main">
        <SearchPanel
          address={address}
          onAddressChange={setAddress}
          onSearch={searchAddress}
          loading={loading}
          error={error}
          recentSearches={recentSearches}
          onRemoveRecent={removeRecentSearch}
          compact={hasContent}
        />

        {loading && <PassportSkeleton />}

        {result && <Passport key={result.address} result={result} />}

        {!hasContent && <Capabilities />}
      </main>

      <footer className="container footer">
        <span className="footer__brand">DataFuseAI</span>
        <span>
          Estimates per building (pand) · mass in tonnes · carbon in CO₂e
        </span>
      </footer>
    </div>
  );
}

export default App;
