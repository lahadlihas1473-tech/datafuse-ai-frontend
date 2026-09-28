import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { BookIcon } from "../components/Icons";
import Method2 from "../components/Method2";
import SearchPanel from "../components/SearchPanel";
import { PageHeader, RecordSkeleton } from "../components/ui";

// Method 2: GET /method-2/search (3DBAG geometry x construction build-up)
export default function Method2Page({ method2 }) {
  const {
    address,
    setAddress,
    items,
    loading,
    error,
    searchAddress,
    recentSearches,
    removeRecentSearch,
  } = method2;
  const [searchParams, setSearchParams] = useSearchParams();

  // ?address=… lets the passport link straight to the Method 2 result
  const linkedAddress = searchParams.get("address");

  useEffect(() => {
    document.title = "Method 2 · Resource Paspoort";
  }, []);

  useEffect(() => {
    if (!linkedAddress || linkedAddress === address) {
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
        title="Method 2 — geometry-based estimation"
        description="Material mass and embodied CO₂ from the measured 3DBAG geometry of each building and a construction build-up per building part, and the Method 2 estimated WOZ value."
        actions={
          <Link className="button button--secondary" to="/method-2/docs">
            <BookIcon />
            Method 2 documentation
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

      {!loading &&
        items?.map((record) => (
          <Method2 key={record.pand_id ?? record.notice_id} record={record} />
        ))}

      {items?.length === 0 && !loading && (
        <div className="empty">
          <p className="empty__title">No Method 2 record for this address</p>
          <p>Try the street without a house number, or add the city.</p>
        </div>
      )}
    </>
  );
}
