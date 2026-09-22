import { useEffect } from "react";
import Capabilities from "../components/Capabilities";
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

      {loading && <PassportSkeleton />}

      {result && <Passport key={result.address} result={result} />}

      {!hasContent && <Capabilities />}
    </>
  );
}
