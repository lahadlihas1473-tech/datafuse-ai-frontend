import { PinIcon } from "../components/Icons";
import Highlight from "../components/list/Highlight";
import ListPage from "../components/list/ListPage";

const FIELDS = [
  { key: "address", label: "Address", className: "address-field--street" },
  { key: "house_number", label: "House no." },
  { key: "postal_code", label: "Postal code" },
  { key: "city", label: "City" },
];

// Address, House number, Postal code and City — nothing else
function AddressRow({ address, search }) {
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
      </dl>
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
