import { useEffect } from "react";
import BuildingRecord from "../components/BuildingRecord";
import SearchPanel from "../components/SearchPanel";
import { PageHeader, RecordSkeleton } from "../components/ui";

// Building passport: one record per building, from the existing Method 1
// and Method 2 data (see hooks/useBuildingSearch.js)
export default function PassportPage({ building }) {
  const {
    address,
    setAddress,
    result,
    loading,
    error,
    searchAddress,
    recentSearches,
    removeRecentSearch,
  } = building;

  useEffect(() => {
    document.title = "Passport · Resource Paspoort";
  }, []);

  return (
    <>
      <PageHeader
        title="Building passport"
        description="Search a building by address to see its BAG and 3DBAG information, the estimated materials and embodied CO₂ of both methods, and its estimated WOZ value."
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

      {result && !loading && (
        <BuildingRecord
          key={result.estimate?.pand_id ?? result.geometry?.pand_id}
          estimate={result.estimate}
          geometry={result.geometry}
          matches={result.matches}
          query={address}
        />
      )}

      {!result && !loading && !error && (
        <section className="section section--intro">
          <div className="section__body">
            <h2 className="section__title">What the passport shows</h2>
            <ul className="intro-list">
              <li>
                <strong>Building information</strong> — address, year built,
                building type and identifiers from BAG.
              </li>
              <li>
                <strong>Geometry and measurements</strong> — surfaces, volume,
                height and floor areas from 3DBAG.
              </li>
              <li>
                <strong>Material and CO₂ estimation</strong> — mass and embodied
                carbon per material, from Method 1 and Method 2.
              </li>
              <li>
                <strong>WOZ estimation</strong> — the estimated WOZ value of
                both methods; a model estimate, not an official WOZ value.
              </li>
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
