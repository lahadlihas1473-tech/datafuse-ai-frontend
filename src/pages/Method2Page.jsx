import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { BookIcon } from "../components/Icons";
import Method2 from "../components/Method2";
import { PassportSkeleton } from "../components/Passport";
import SearchPanel from "../components/SearchPanel";

export default function Method2Page({ method2 }) {
  const { address, setAddress, items, loading, error, searchAddress } = method2;
  const [searchParams, setSearchParams] = useSearchParams();

  // ?address=… lets the passport link straight to the Method 2 result
  const linkedAddress = searchParams.get("address");

  useEffect(() => {
    document.title = "Method 2 — Resource Paspoort";
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

  const hasContent = loading || Boolean(items);

  return (
    <>
      <SearchPanel
        address={address}
        onAddressChange={setAddress}
        onSearch={searchAddress}
        loading={loading}
        error={error}
        compact={hasContent}
        eyebrow="Method 2"
        title={
          <>
            Measured geometry, <em>material by material</em>.
          </>
        }
        lede="Search by address for the 3DBAG geometry estimate: surfaces, volume, materials and CO₂ per building."
      />

      <p className="docs-link">
        <Link className="button button--ghost" to="/method-2/docs">
          <BookIcon />
          How Method 2 is calculated
        </Link>
      </p>

      {loading && <PassportSkeleton />}

      {items?.map((record) => (
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
