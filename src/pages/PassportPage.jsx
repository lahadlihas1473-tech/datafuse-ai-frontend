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
        <section className="intro" aria-labelledby="intro-title">
          <h2 className="intro__title" id="intro-title">What the passport shows</h2>
          <ul className="intro-list">
            <li className="intro-card">
              <strong className="intro-card__title">Building information</strong>
              <span className="intro-card__text">
                Address, year built, building type and identifiers from BAG.
              </span>
            </li>
            <li className="intro-card">
              <strong className="intro-card__title">Geometry and measurements</strong>
              <span className="intro-card__text">
                Surfaces, volume, height and floor areas from 3DBAG.
              </span>
            </li>
            <li className="intro-card">
              <strong className="intro-card__title">Material and CO₂ estimation</strong>
              <span className="intro-card__text">
                Mass and embodied carbon per material, from Method 1 and Method 2.
              </span>
            </li>
            <li className="intro-card">
              <strong className="intro-card__title">WOZ estimation</strong>
              <span className="intro-card__text">
                The estimated WOZ value of both methods; a model estimate, not an
                official WOZ value.
              </span>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
