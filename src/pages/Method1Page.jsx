import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { BookIcon } from "../components/Icons";
import Passport from "../components/Passport";
import SearchPanel from "../components/SearchPanel";
import { PageHeader, RecordSkeleton } from "../components/ui";

// Method 1: GET /material-estimation/search (BAG floor area x B2 profile)
export default function Method1Page({ passport }) {
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
  const [searchParams, setSearchParams] = useSearchParams();

  // ?address=… lets the building passport link straight to this result
  const linkedAddress = searchParams.get("address");

  useEffect(() => {
    document.title = "Method 1 · Resource Paspoort";
  }, []);

  useEffect(() => {
    if (!linkedAddress) {
      return;
    }

    setAddress(linkedAddress);
    searchAddress(linkedAddress);
    setSearchParams({}, { replace: true });
    // Runs for a new ?address= only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedAddress]);

  return (
    <>
      <PageHeader
        title="Method 1 — material and CO₂ estimation"
        description="Material mass per material from the BAG usable floor area (GO) and the B2 material intensities for the building's type and age, embodied CO₂ per material, and the Method 1 estimated WOZ value."
        actions={
          <Link className="button button--secondary" to="/method-1/docs">
            <BookIcon />
            Method 1 documentation
          </Link>
        }
      />

      <SearchPanel
        address={address}
        onAddressChange={setAddress}
        onSearch={searchAddress}
        loading={loading}
        error={error}
        recentSearches={recentSearches}
        onRemoveRecent={removeRecentSearch}
      />

      {loading && <RecordSkeleton />}

      {result && !loading && <Passport key={result.address} result={result} />}
    </>
  );
}
