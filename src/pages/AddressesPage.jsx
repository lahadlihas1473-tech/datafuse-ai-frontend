import { useId, useState } from "react";
import { ChevronIcon, PinIcon } from "../components/Icons";
import Highlight from "../components/list/Highlight";
import ListPage from "../components/list/ListPage";
import WozMethod2 from "../components/WozMethod2";
import { formatEuro } from "../lib/format";

const FIELDS = [
  { key: "address", label: "Address", className: "address-field--street" },
  { key: "house_number", label: "House no." },
  { key: "postal_code", label: "Postal code" },
  { key: "city", label: "City" },
];

// Address, House number, Postal code, City and the Method 2 Estimated WOZ
// Value of the building (method_2.est_woz_value_eur, matched on pand_id)
function AddressRow({ address, search }) {
  const [showWoz, setShowWoz] = useState(false);
  const detailsId = useId();
  const woz = address.estimated_woz;

  return (
    <>
      <span className="record__icon record__icon--pin" aria-hidden="true">
        <PinIcon />
      </span>

      <dl className="address-fields">
        {FIELDS.map(({ key, label, className }) => (
          <div
            key={key}
            className={`address-field${className ? ` ${className}` : ""}`}
          >
            <dt className="record__label">{label}</dt>
            <dd>
              {address[key] ? (
                <Highlight text={address[key]} term={search} />
              ) : (
                "—"
              )}
            </dd>
          </div>
        ))}

        <div className="address-field address-field--woz">
          <dt className="record__label">WOZ Estimation (Method 2)</dt>
          <dd>
            {formatEuro(address.est_woz_value_eur)}
            {woz && (
              <button
                type="button"
                className={`woz-toggle${showWoz ? " woz-toggle--open" : ""}`}
                aria-expanded={showWoz}
                aria-controls={detailsId}
                onClick={() => setShowWoz((open) => !open)}
              >
                Details
                <ChevronIcon />
              </button>
            )}
          </dd>
        </div>
      </dl>

      {woz && showWoz && (
        <div className="record__details" id={detailsId}>
          <WozMethod2 woz={woz} />
        </div>
      )}
    </>
  );
}

export default function AddressesPage() {
  return (
    <ListPage
      eyebrow="Building locations"
      title="Addresses"
      description="Every unique address across all notices — each listed once, even when several notices share it. Search a city to see its addresses first."
      endpoint="/addresses"
      noun={{ singular: "address", plural: "addresses" }}
      searchLabel="Search addresses"
      searchPlaceholder="Search by city, street or postal code…"
      getKey={(address) =>
        [address.address, address.house_number, address.postal_code, address.city]
          .join("|")
          .toLowerCase()
      }
      renderItem={(address, search) => (
        <AddressRow address={address} search={search} />
      )}
      skeletonRow={
        <>
          <span className="skeleton skeleton--icon" />
          <div className="record__main">
            <span className="skeleton skeleton--label" />
            <span className="skeleton skeleton--text" />
          </div>
        </>
      }
    />
  );
}
