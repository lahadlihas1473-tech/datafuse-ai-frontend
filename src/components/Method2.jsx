import { Link } from "react-router";
import {
  formatAmount,
  formatEuro,
  formatNumber,
  formatPercent,
  measure,
  streetLine,
  text,
  toNumber,
} from "../lib/format";
import { METHOD2_MATERIALS as MATERIALS, TOTAL_LABEL } from "../lib/materials";
import CompositionChart from "./CompositionChart";
import { ArrowIcon } from "./Icons";
import { Fields, Section, Summary } from "./ui";
import WozMethod2 from "./WozMethod2";

// Same bar-in-a-cell as the Method 1 material table
function ShareCell({ value, color }) {
  return (
    <td className="col-share">
      <span className="share">
        <span className="share__track">
          <span
            className="share__fill"
            style={{ width: `${value * 100}%`, background: color }}
          />
        </span>
        <span className="share__value">{formatPercent(value)}</span>
      </span>
    </td>
  );
}

// Method 2 result for one building (GET /method-2/search)
export default function Method2({ record }) {
  const street = streetLine(record);
  const title = [street || record.name, record.city].filter(Boolean).join(", ");
  const locality = [record.postal_code, record.city].filter(Boolean).join(" ");

  const totalMass = toNumber(record.total_material_mass_tonnes);
  const totalCo2 = toNumber(record.total_co2_tonnes);

  const rows = MATERIALS.map(({ key, label, color }) => {
    const tonnes = toNumber(record[`${key}_tonnes`]) ?? 0;
    const co2Tonnes = toNumber(record[`${key}_co2_tonnes`]) ?? 0;

    return {
      key,
      label,
      color,
      tonnes,
      co2Tonnes,
      massShare: totalMass > 0 ? tonnes / totalMass : 0,
      co2Share: totalCo2 > 0 ? co2Tonnes / totalCo2 : 0,
      // One material per segment, so the chart legend needs no member list
      members: [],
    };
  });

  const dominant = rows.reduce(
    (best, row) => (row.massShare > (best?.massShare ?? 0) ? row : best),
    null
  );

  const presentCount = rows.filter((row) => row.tonnes > 0).length;
  const woz = record.estimated_woz;

  return (
    <article className="record-view method2" aria-label={`Method 2 result for ${title}`}>
      <header className="record-head">
        <div>
          <p className="record-head__kicker">
            Method 2 · 3DBAG geometry
            {record.assumption_profile && (
              <span className="tag">{record.assumption_profile}</span>
            )}
          </p>
          <h2 className="record-head__title">{title}</h2>
          <p className="record-head__meta">
            {locality}
            {record.pand_id && (
              <>
                <span className="record-head__sep" aria-hidden="true">·</span>
                Pand ID <span className="mono">{record.pand_id}</span>
              </>
            )}
          </p>
        </div>
        <div className="record-head__actions">
          <Link
            className="button button--secondary"
            to={`/method-1?address=${encodeURIComponent(street ? `${street}, ${record.city ?? ""}` : record.name ?? "")}`}
          >
            Method 1 for this address
            <ArrowIcon />
          </Link>
        </div>
      </header>

      <Summary
        items={[
          {
            label: "Total material mass",
            value: formatNumber(totalMass),
            unit: "t",
            note: measure(record.mass_kg_per_m2_bvo, "kg per m² BVO", 1),
          },
          {
            label: "Embodied carbon",
            value: formatNumber(totalCo2),
            unit: "tCO₂e",
            note: measure(record.co2e_kg_per_m2_bvo, "kgCO₂e per m² BVO", 1),
          },
          {
            label: "Gross floor area (BVO)",
            value: formatNumber(toNumber(record.bvo_m2), 0),
            unit: "m²",
            note: `Usable area (GO) ${measure(record.go_m2, "m²", 0)}`,
          },
          {
            label: "Building height",
            value: formatNumber(toNumber(record.height_max_m), 1),
            unit: "m",
            note: `Mean ${measure(record.height_mean_m, "m", 1)}`,
          },
          {
            label: "Dominant material",
            value: dominant ? dominant.label : "—",
            note: dominant ? `${formatPercent(dominant.massShare)} of total mass` : "No material data",
          },
        ]}
      />

      <div className="record-grid">
        <Section
          title="Building information"
          description="Type and age group from BAG, with the construction build-up chosen for them."
          meta={text(record.material_profile_id)}
        >
          <Fields
            columns={2}
            items={[
              { label: "Pand ID", value: text(record.pand_id), mono: true },
              { label: "Notice ID", value: text(record.notice_id), mono: true },
              { label: "Year built", value: text(record.bouwjaar) },
              { label: "Building type", value: text(record.typegebouw) },
              { label: "Age cohort", value: text(record.cohort) },
              { label: "Build-up profile", value: text(record.assumption_profile), mono: true },
            ]}
          />
        </Section>

        <Section
          title="3DBAG geometry"
          description="Measured surfaces and volume of the building."
          meta="LoD 2.2"
        >
          <Fields
            columns={2}
            items={[
              { label: "Footprint", value: measure(record.opp_grond_m2, "m²") },
              { label: "Volume", value: measure(record.volume_lod22_m3, "m³") },
              { label: "External wall", value: measure(record.opp_buitenmuur_m2, "m²") },
              { label: "Party wall", value: measure(record.opp_scheidingsmuur_m2, "m²") },
              { label: "Flat roof", value: measure(record.opp_dak_plat_m2, "m²") },
              { label: "Sloped roof", value: measure(record.opp_dak_schuin_m2, "m²") },
            ]}
          />
        </Section>
      </div>

      <Section
        title="Measurements"
        description="Heights, storeys, floor areas and the lengths and areas derived from the geometry."
      >
        <Fields
          columns={4}
          items={[
            { label: "Height (max)", value: measure(record.height_max_m, "m", 1) },
            { label: "Height (mean)", value: measure(record.height_mean_m, "m", 1) },
            { label: "Storeys (3DBAG)", value: text(record.bouwlagen) },
            { label: "Storey equivalents", value: formatNumber(toNumber(record.storey_equivalents), 2) },
            { label: "Storey height used", value: measure(record.storey_height_m, "m", 2) },
            { label: "Gross floor area (BVO)", value: measure(record.bvo_m2, "m²") },
            { label: "Usable floor area (GO)", value: measure(record.go_m2, "m²") },
            { label: "GO ÷ BVO", value: formatNumber(toNumber(record.go_bvo_ratio), 2) },
            { label: "Perimeter", value: measure(record.perimeter_m, "m") },
            { label: "Roof pitch", value: measure(record.roof_pitch_deg, "°", 1) },
            { label: "Façade length", value: measure(record.facade_length_m, "m") },
            { label: "Party wall length", value: measure(record.party_wall_length_m, "m") },
            { label: "Window area", value: measure(record.window_area_m2, "m²") },
            { label: "Foundation beam", value: measure(record.foundation_beam_length_m, "m") },
            { label: "Internal walls", value: measure(record.internal_wall_m2, "m²") },
          ]}
        />
      </Section>

      <Section
        title="Material estimation"
        description="Estimated mass and embodied carbon (A1–A3) per reported material group."
        meta={`${presentCount} of ${MATERIALS.length} present`}
      >
        <div className="table-wrap">
          <table className="data-table method2__table">
            <thead>
              <tr>
                <th scope="col" className="col-material">Material</th>
                <th scope="col" className="num">Mass (t)</th>
                <th scope="col" className="col-share">Share of mass</th>
                <th scope="col" className="num">CO₂e (t)</th>
                <th scope="col" className="col-share">Share of CO₂e</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className={!row.tonnes && !row.co2Tonnes ? "is-zero" : undefined}
                >
                  <th scope="row" className="col-material">
                    <span className="material">
                      <i className="swatch" style={{ background: row.color }} />
                      {row.label}
                    </span>
                  </th>
                  <td className="num">{formatAmount(row.tonnes)}</td>
                  <ShareCell value={row.massShare} color={row.color} />
                  <td className="num">{formatAmount(row.co2Tonnes)}</td>
                  <ShareCell value={row.co2Share} color={row.color} />
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" className="col-material">{TOTAL_LABEL}</th>
                <td className="num">{formatNumber(totalMass)}</td>
                <td className="col-share">
                  <span className="share__value">100%</span>
                </td>
                <td className="num">{formatNumber(totalCo2)}</td>
                <td className="col-share">
                  <span className="share__value">100%</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="section__sub">
          <h3 className="section__subtitle">Composition</h3>
          <CompositionChart
            groups={rows}
            total={{ tonnes: totalMass, co2_tonnes: totalCo2 }}
          />
        </div>
      </Section>

      <Section title="CO₂ estimation">
        <Fields
          columns={4}
          items={[
            { label: "Embodied carbon (t)", value: measure(record.total_co2_tonnes, "tCO₂e") },
            { label: "Embodied carbon (kg)", value: measure(record.total_co2_kg, "kgCO₂e", 0) },
            { label: "CO₂e per m² BVO", value: measure(record.co2e_kg_per_m2_bvo, "kg", 1) },
            { label: "Mass per m² BVO", value: measure(record.mass_kg_per_m2_bvo, "kg", 1) },
          ]}
        />
      </Section>

      {woz && (
        <Section
          title="WOZ estimation (Method 2)"
          description="Estimated WOZ value from the building's buurt (neighbourhood), its dwelling type measured in 3DBAG and each verblijfsobject (unit) valued on its own."
          meta={woz.reference_year ? `WOZ year ${woz.reference_year}` : undefined}
        >
          <p className="woz-headline">
            <span className="woz-headline__label">{woz.label}</span>
            <span className="woz-headline__value">{formatEuro(woz.value_eur)}</span>
          </p>
          <WozMethod2 woz={woz} />
        </Section>
      )}
    </article>
  );
}
