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
