import { formatEuro, formatNumber, formatPercent, isNumber } from "../lib/format";

// English names shown after the Dutch terms
const DWELLING_EN = {
  tussenwoning: "terraced house",
  hoekwoning: "end-of-terrace house",
  "2-onder-1-kapwoning": "semi-detached house",
  "vrijstaande woning": "detached house",
  "hoekwoning / 2-onder-1-kapwoning": "end-of-terrace / semi-detached house",
  appartement: "apartment",
  "non-residential": "no dwelling",
};

const USE_EN = {
  woonfunctie: "residential",
  winkelfunctie: "retail",
  kantoorfunctie: "office",
  logiesfunctie: "lodging",
  gezondheidszorgfunctie: "healthcare",
  bijeenkomstfunctie: "assembly",
  celfunctie: "detention",
  onderwijsfunctie: "education",
  sportfunctie: "sports",
  industriefunctie: "industrial",
  "overige gebruiksfunctie": "other use",
};

const withEnglish = (term, names) =>
  term ? `${term}${names[term] ? ` (${names[term]})` : ""}` : null;

const useLabel = (uses = "") =>
  uses
    .split(",")
    .map((use) => withEnglish(use.trim(), USE_EN))
    .join(", ");

// How each dwelling type was decided
const DWELLING_BASIS = {
  appartement: "Three or more dwellings, or a dwelling above other uses",
  "non-residential": "The building has no dwelling-sized unit",
};

// Units with the same use valued the same way, added up
const groupUnits = (units) => {
  const groups = new Map();

  units.forEach((unit) => {
    const valuedAs =
      unit.method === "dwelling"
        ? withEnglish(unit.dwelling_type, DWELLING_EN)
        : "per m²";
    const key = `${unit.use}|${valuedAs}`;
    const group = groups.get(key) ?? { use: unit.use, valuedAs, count: 0, area: 0, value: 0 };

    group.count += 1;
    group.area += unit.area_m2 ?? 0;
    group.value += unit.value_eur ?? 0;
    groups.set(key, group);
  });

  return [...groups.values()].sort((a, b) => b.value - a.value);
};

// Method 2 Estimated WOZ Value of one building: how it is built up.
// `woz` is the estimated_woz object from GET /method-2/search.
export default function WozMethod2({ woz }) {
  const inputs = woz.inputs ?? {};
  const units = woz.unit_values ?? [];
  const location = woz.location_details ?? {};
  const single = units.length === 1 ? units[0] : null;
  const unitGroups = groupUnits(units);

  const partyShare = isNumber(woz.party_wall_share)
    ? woz.party_wall_share
    : isNumber(inputs.party_wall_length_m) && inputs.perimeter_m > 0
      ? inputs.party_wall_length_m / inputs.perimeter_m
      : null;

  const rows = [
    {
      label: "Buurt (neighbourhood)",
      value: woz.buurt
        ? `${woz.buurt}${woz.buurtcode ? ` (${woz.buurtcode})` : ""}`
        : null,
      note: [
        woz.gemeente && `gemeente (municipality) ${woz.gemeente}`,
        woz.location_level &&
          woz.location_level !== "buurt" &&
          `figures of the ${woz.location_level}`,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    {
      label: "CBS avg WOZ: buurt / gemeente",
      value:
        isNumber(woz.cbs_area_avg_woz_eur) && isNumber(woz.cbs_gemeente_avg_woz_eur)
          ? `${formatEuro(woz.cbs_area_avg_woz_eur)} / ${formatEuro(woz.cbs_gemeente_avg_woz_eur)}`
          : null,
      note: "Average WOZ of dwellings, 2025",
    },
    {
      label: "Location index",
      value: isNumber(woz.location_index) ? formatNumber(woz.location_index, 3) : null,
      note: isNumber(location.area_mix_ratio)
        ? `buurt vs gemeente, corrected for dwelling mix (${formatNumber(location.area_mix_ratio, 3)} / ${formatNumber(location.gemeente_mix_ratio, 3)})`
        : "buurt vs gemeente, corrected for dwelling mix",
    },
    {
      label: "Dwelling type",
      value: withEnglish(woz.dwelling_type, DWELLING_EN),
      note: DWELLING_BASIS[woz.dwelling_type] ?? "From the 3DBAG party-wall share",
    },
    {
      label: "Party walls (shared with neighbours)",
      value: isNumber(partyShare) ? formatPercent(partyShare) : null,
      note:
        isNumber(inputs.party_wall_length_m) && isNumber(inputs.perimeter_m)
          ? `${formatNumber(inputs.party_wall_length_m, 1)} m of ${formatNumber(inputs.perimeter_m, 1)} m outline · 3DBAG`
          : "3DBAG",
    },
    {
      label: "Floor area used",
      value: isNumber(woz.floor_area_m2)
        ? `${formatNumber(woz.floor_area_m2, 0)} m²`
        : isNumber(inputs.go_m2)
          ? `${formatNumber(inputs.go_m2, 0)} m²`
          : null,
      note: woz.floor_area_source ?? "BAG",
    },
    {
      label: "BVO (gross floor area)",
      value: isNumber(inputs.bvo_m2) ? `${formatNumber(inputs.bvo_m2, 0)} m²` : null,
      note: "Measured from 3DBAG",
    },
    {
      label: "Bouwjaar (year built)",
      value: inputs.bouwjaar ? String(inputs.bouwjaar) : null,
      note: woz.age_band
        ? `band ${woz.age_band} · age factor ${formatNumber(woz.age_factor, 2)}`
        : "BAG",
    },
    {
      label: "Dwellings / other units",
      value:
        isNumber(woz.residential_value_eur) && isNumber(woz.other_value_eur)
          ? `${formatEuro(woz.residential_value_eur)} / ${formatEuro(woz.other_value_eur)}`
          : null,
      note: isNumber(woz.units) ? `${woz.units} verblijfsobject(en) (units)` : null,
    },
    {
      label: "Value per m²",
      value: isNumber(woz.eur_per_m2) ? `${formatEuro(woz.eur_per_m2, 2)} /m²` : null,
    },
    {
      label: "Imputed inputs",
      value: woz.imputed,
    },
  ].filter((row) => row.value);

  return (
    <div className="woz-details">
      {single?.method === "dwelling" ? (
        <p className="woz-details__formula">
          <span>{formatEuro(single.reference_value_eur)} buurt value</span>
          <span aria-hidden="true">×</span>
          <span>{formatNumber(single.size_factor, 3)} size</span>
          <span aria-hidden="true">×</span>
          <span>{formatNumber(single.age_factor, 2)} age</span>
          <span aria-hidden="true">=</span>
          <strong>{formatEuro(woz.value_eur)}</strong>
        </p>
      ) : (
        <div className="woz-details__formula woz-details__formula--stack">
          <span>Dwelling = {woz.formula?.dwelling}</span>
          <span>Other unit = {woz.formula?.other}</span>
        </div>
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

      {units.length > 1 && (
        <div className="table-wrap">
          <table className="data-table woz-units">
            <thead>
              <tr>
                <th scope="col">Verblijfsobject (unit) use</th>
                <th scope="col">Valued as</th>
                <th scope="col" className="num">Units</th>
                <th scope="col" className="num">Area</th>
                <th scope="col" className="num">Value</th>
              </tr>
            </thead>
            <tbody>
              {unitGroups.map((group) => (
                <tr key={`${group.use}|${group.valuedAs}`}>
                  <th scope="row">{useLabel(group.use)}</th>
                  <td>{group.valuedAs}</td>
                  <td className="num">{group.count}</td>
                  <td className="num">{formatNumber(group.area, 0)} m²</td>
                  <td className="num">{formatEuro(group.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {woz.disclaimer && <p className="woz-details__disclaimer">{woz.disclaimer}</p>}
    </div>
  );
}
