export const isNumber = (value) =>
  typeof value === "number" && Number.isFinite(value);

export const formatNumber = (value, digits = 2) =>
  isNumber(value)
    ? value.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "—";

// Like formatNumber, but tiny non-zero values read "< 0.01"
export const formatAmount = (value) =>
  isNumber(value) && value > 0 && value < 0.005
    ? "< 0.01"
    : formatNumber(value);

// Euros: 1415000 -> "€1,415,000"; digits for prices, e.g. "€5,145.04"
export const formatEuro = (value, digits = 0) =>
  isNumber(value)
    ? `€${value.toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })}`
    : "—";

export const formatPercent = (value) =>
  isNumber(value) ? `${(value * 100).toFixed(1)}%` : "—";

// Split "Street 12, 1234 AB City" into two display lines
export const splitAddress = (address = "") => {
  const commaIndex = address.indexOf(",");

  if (commaIndex === -1) {
    return [address, ""];
  }

  return [
    address.slice(0, commaIndex).trim(),
    address.slice(commaIndex + 1).trim(),
  ];
};

const POSTAL_LOCALITY = /^(\d{4}\s?[A-Za-z]{2})\s+(.+)$/;

// Method 1 sends one address string, "street, postcode city", and in some
// rows the street already ends with the city ("Jan Provostlaan 16,
// Bilthoven, 3723RD Bilthoven"). Split it for display without repeating
// the city; the value itself is not changed.
export const parseAddress = (address = "") => {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const locality = parts.length > 1 ? parts[parts.length - 1].match(POSTAL_LOCALITY) : null;

  if (!locality) {
    const [street, rest] = splitAddress(address);
    return { street, postalCode: "", city: rest, title: address };
  }

  const [, postalCode, city] = locality;
  const street = parts
    .slice(0, -1)
    .filter((part) => part.toLowerCase() !== city.toLowerCase())
    .join(", ");

  return { street, postalCode, city, title: street ? `${street}, ${city}` : city };
};

const clean = (value) => String(value ?? "").trim();

// Method 2 rows keep street, house number and city apart, but some address
// values already carry the house number and city. Add each part only when
// it is not already there.
export const streetLine = ({ address, house_number: houseNumber, city }) => {
  const house = clean(houseNumber);
  const town = clean(city);
  let line = clean(address);

  [`, ${town}`, ` ${town}`].forEach((suffix) => {
    if (town && line.toLowerCase().endsWith(suffix.toLowerCase())) {
      line = line.slice(0, -suffix.length).trim().replace(/,$/, "");
    }
  });

  const endsWithHouse =
    house && line.toLowerCase().endsWith(` ${house.toLowerCase()}`);

  return house && !endsWithHouse ? `${line} ${house}`.trim() : line;
};

// public.method_2 returns NUMERIC columns as strings
export const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return isNumber(number) ? number : null;
};

// Value with a unit, or an em dash when the value is missing
export const measure = (value, unit, digits = 2) => {
  const number = toNumber(value);
  return number === null ? "—" : `${formatNumber(number, digits)} ${unit}`;
};

// Missing text values read as an em dash
export const text = (value) =>
  value === null || value === undefined || value === "" ? "—" : value;
