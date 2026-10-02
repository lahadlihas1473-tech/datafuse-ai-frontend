import { useEffect } from "react";
import { Link } from "react-router";
import { AMSTERDAM_GOVERNMENT_BUILDINGS } from "../data/amsterdamGovernmentBuildings";
import { PageHeader } from "../components/ui";

const COLUMNS = [
  { label: "Building", className: "cell--building" },
  { label: "Address", className: "cell--street" },
  { label: "Postal code", className: "cell--postal" },
  { label: "City", className: "cell--city" },
  { label: "Passport", className: "cell--open" },
];

// The 13 City of Amsterdam buildings, each linking to its passport
export default function AmsterdamGovernmentPage() {
  useEffect(() => {
    document.title = "Amsterdam Government Buildings · Resource Paspoort";
  }, []);

  return (
    <section className="list-page">
      <PageHeader
        title="Amsterdam Government Buildings"
        description="City of Amsterdam (Gemeente Amsterdam) buildings: the city hall, city offices, district offices, the City Archives and the GGD. Open a building to see its materials, embodied CO₂ and estimated WOZ value of both methods."
      />

      <div className="list-toolbar">
        <p className="list-toolbar__summary">
          {AMSTERDAM_GOVERNMENT_BUILDINGS.length} buildings
        </p>
      </div>

      <div className="records__head records__head--government" aria-hidden="true">
        {COLUMNS.map(({ label, className }) => (
          <span key={label} className={className}>
            {label}
          </span>
        ))}
      </div>

      <ul className="records records--government records--table">
        {AMSTERDAM_GOVERNMENT_BUILDINGS.map((building) => (
          <li className="record" key={building.pand_id}>
            <div className="cell cell--building">
              <span className="cell__label">Building</span>
              <span className="cell__value">{building.name}</span>
            </div>
            <div className="cell cell--street">
              <span className="cell__label">Address</span>
              <span className="cell__value">{building.search}</span>
            </div>
            <div className="cell cell--postal">
              <span className="cell__label">Postal code</span>
              <span className="cell__value mono">{building.postal_code}</span>
            </div>
            <div className="cell cell--city">
              <span className="cell__label">City</span>
              <span className="cell__value">{building.city}</span>
            </div>
            <div className="cell cell--open">
              <span className="cell__label">Passport</span>
              <span className="cell__value">
                <Link to={`/?address=${encodeURIComponent(building.search)}`}>
                  View passport
                </Link>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
