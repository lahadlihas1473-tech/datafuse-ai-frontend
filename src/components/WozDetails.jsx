import { formatEuro, formatNumber, isNumber } from "../lib/format";

// Method 1 Estimated WOZ Value: how the value of one building is built up.
// `woz` is the estimated_woz object from the API (/addresses and
// /material-estimation/search).
export default function WozDetails({ woz }) {
  const inputs = woz.inputs ?? {};
  // GO used by the estimate, else the BAG floor area of the building
  const goM2 = isNumber(woz.go_m2) ? woz.go_m2 : inputs.go_m2;
  const hasFactors =
    isNumber(woz.go_m2) &&
    isNumber(woz.base_eur_per_m2) &&
    isNumber(woz.type_factor) &&
    isNumber(woz.age_factor);

  const rows = [
    {
      label: "Gemeente (municipality)",
      value: woz.gemeente
        ? `${woz.gemeente}${woz.gemeentecode ? ` (${woz.gemeentecode})` : ""}`
        : null,
      note: woz.location_source,
    },
    {
      label: "CBS avg WOZ of dwellings",
      value: isNumber(woz.cbs_avg_woz_eur) ? formatEuro(woz.cbs_avg_woz_eur) : null,
      note: woz.reference_year ? `WOZ year ${woz.reference_year}` : null,
    },
    {
      label: "CBS avg floor area of dwellings",
      value: isNumber(woz.cbs_avg_floor_area_m2)
        ? `${formatNumber(woz.cbs_avg_floor_area_m2, 0)} m²`
        : null,
    },
    {
      label: "Base price",
      value: isNumber(woz.base_eur_per_m2)
        ? `${formatEuro(woz.base_eur_per_m2, 2)} /m²`
        : null,
      note: "CBS avg WOZ ÷ CBS avg floor area",
    },
    {
      label: "Building type factor",
      value: isNumber(woz.type_factor) ? formatNumber(woz.type_factor, 2) : null,
      note: woz.type_basis ?? inputs.gebruiksdoel,
    },
    {
      label: "Age factor",
      value: isNumber(woz.age_factor) ? formatNumber(woz.age_factor, 2) : null,
      note: woz.age_band && `bouwjaar band ${woz.age_band}`,
    },
    {
      label: "Price of this building",
      value: isNumber(woz.eur_per_m2) ? `${formatEuro(woz.eur_per_m2, 2)} /m²` : null,
      note: "Base price × type factor × age factor",
    },
    {
      label: "GO (usable floor area)",
      value: isNumber(goM2) ? `${formatNumber(goM2, 0)} m²` : null,
      note: "BAG",
    },
    {
      label: "Bouwjaar (year built)",
      value: inputs.bouwjaar ? String(inputs.bouwjaar) : null,
      note: "BAG",
    },
    {
      label: "Gebruiksdoel (use)",
      value: inputs.gebruiksdoel,
      note: "BAG",
    },
    {
      label: "Imputed inputs",
      value: woz.imputed,
    },
  ].filter((row) => row.value);

  return (
    <div className="woz-details">
      {!hasFactors && woz.formula && (
        <p className="woz-details__formula">
          <span>{woz.label} = GO (usable floor area) × base €/m² × type factor × age factor</span>
        </p>
      )}

      {hasFactors && (
        <p className="woz-details__formula">
          <span>{formatNumber(woz.go_m2, 0)} m²</span>
          <span aria-hidden="true">×</span>
          <span>{formatEuro(woz.base_eur_per_m2, 2)}/m²</span>
          <span aria-hidden="true">×</span>
          <span>{formatNumber(woz.type_factor, 2)}</span>
          <span aria-hidden="true">×</span>
          <span>{formatNumber(woz.age_factor, 2)}</span>
          <span aria-hidden="true">=</span>
          <strong>{formatEuro(woz.value_eur)}</strong>
        </p>
      )}

      <dl className="woz-details__rows">
        {rows.map(({ label, value, note }) => (
          <div className="woz-details__row" key={label}>
            <dt>{label}</dt>
            <dd>
              <span className="woz-details__value">{value}</span>
              {note && <span className="woz-details__note">{note}</span>}
            </dd>
          </div>
        ))}
      </dl>

      {woz.disclaimer && <p className="woz-details__disclaimer">{woz.disclaimer}</p>}
    </div>
  );
}
