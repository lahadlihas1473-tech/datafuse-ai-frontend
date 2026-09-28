import Highlight from "../components/list/Highlight";
import ListPage from "../components/list/ListPage";

const FIELDS = [
  { key: "address", label: "Address", className: "cell--street" },
  { key: "house_number", label: "House no.", className: "cell--house" },
  { key: "postal_code", label: "Postal code", className: "cell--postal" },
  { key: "city", label: "City", className: "cell--city" },
];

// Address, House number, Postal code and City — nothing else
function AddressRow({ address, search }) {
  return FIELDS.map(({ key, label, className }) => (
    <div className={`cell ${className}`} key={key}>
      <span className="cell__label">{label}</span>
      <span className={`cell__value${key === "postal_code" ? " mono" : ""}`}>
        {address[key] ? <Highlight text={address[key]} term={search} /> : "—"}
      </span>
    </div>
  ));
}

export default function AddressesPage() {
  return (
    <ListPage
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
      variant="addresses"
      columns={FIELDS.map(({ label, className }) => ({ label, className }))}
      renderItem={(address, search) => (
        <AddressRow address={address} search={search} />
      )}
      skeletonRow={<span className="skeleton skeleton--text" />}
    />
  );
}
