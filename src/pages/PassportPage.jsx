import { useEffect } from "react";
import { Link } from "react-router";
import Capabilities from "../components/Capabilities";
import { BookIcon } from "../components/Icons";
import Passport, { PassportSkeleton } from "../components/Passport";
import SearchPanel from "../components/SearchPanel";

export default function PassportPage({ passport }) {
  const {
    address,
    setAddress,
    result,
    loading,
    error,
    searchAddress,
    recentSearches,
    removeRecentSearch,
  } = passport;

  useEffect(() => {
    document.title = "Resource Paspoort — Material & CO₂ Building Passport";
  }, []);

  const hasContent = loading || Boolean(result);

  return (
    <>
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

      <p className="docs-link">
        <Link className="button button--ghost" to="/method-1/docs">
          <BookIcon />
          How Method 1 is calculated
        </Link>
      </p>

      {loading && <PassportSkeleton />}

      {result && <Passport key={result.address} result={result} />}

      {!hasContent && <Capabilities />}
    </>
  );
}
