import { Link } from "react-router";
import {
  formatEuro,
  formatNumber,
  isNumber,
  measure,
  parseAddress,
  streetLine,
  text,
  toNumber,
} from "../lib/format";
import { MATERIALS, METHOD2_MATERIALS, TOTAL_LABEL } from "../lib/materials";
import { ArrowIcon } from "./Icons";
import { Fields, Section, Summary } from "./ui";

// One compact table: material, mass and CO2e per material, with the total
function MaterialList({ caption, rows, total }) {
  return (
    <div className="material-list">
      <h3 className="material-list__caption">{caption}</h3>
      <div className="table-wrap">
        <table className="data-table data-table--compact">
          <thead>
            <tr>
              <th scope="col">Material</th>
              <th scope="col" className="num">Mass (t)</th>
              <th scope="col" className="num">CO₂e (t)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">
                  <span className="material">
                    <i className="swatch" style={{ background: row.color }} />
                    {row.label}
                  </span>
                </th>
                <td className="num">{formatNumber(row.tonnes, 3)}</td>
                <td className="num">{formatNumber(row.co2Tonnes, 3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{TOTAL_LABEL}</th>
              <td className="num">{formatNumber(total.tonnes, 3)}</td>
              <td className="num">{formatNumber(total.co2Tonnes, 3)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

const COLORS = Object.fromEntries(METHOD2_MATERIALS.map((m) => [m.group, m.color]));

// The building as one record: identification and geometry from the
// Method 2 row (BAG + 3DBAG), material, CO2 and WOZ from both methods.
export default function BuildingRecord({ estimate, geometry, matches, query }) {
  const parsed = estimate ? parseAddress(estimate.address) : null;
  const street = geometry ? streetLine(geometry) : parsed?.street;
  const city = geometry?.city || parsed?.city || "";
  const postalCode = geometry?.postal_code || parsed?.postalCode || "";
  const title = [street, city].filter(Boolean).join(", ");

  const pandId = geometry?.pand_id ?? estimate?.pand_id;
  const woz1 = estimate?.estimated_woz;
  const woz2 = geometry?.estimated_woz;
  const inputs1 = woz1?.inputs ?? {};

  // Method 1: 13 materials from GET /material-estimation/search
  const materials1 = estimate?.materials;
  const rows1 = materials1
    ? MATERIALS.map((material) => ({
        key: material.key,
        label: materials1[material.key]?.label ?? material.label,
        color: COLORS[material.group] ?? "#9aa2aa",
        tonnes: materials1[material.key]?.tonnes,
        co2Tonnes: materials1[material.key]?.co2_tonnes,
      }))
    : [];

  // Method 2: 7 materials from GET /method-2/search
  const rows2 = geometry
    ? METHOD2_MATERIALS.map((material) => ({
        ...material,
        tonnes: toNumber(geometry[`${material.key}_tonnes`]),
        co2Tonnes: toNumber(geometry[`${material.key}_co2_tonnes`]),
      }))
    : [];

  const mass1 = materials1?.total?.tonnes;
  const co21 = materials1?.total?.co2_tonnes;
  const mass2 = toNumber(geometry?.total_material_mass_tonnes);
  const co22 = toNumber(geometry?.total_co2_tonnes);
  const intensity = (co2, mass) =>
    isNumber(co2) && isNumber(mass) && mass > 0 ? formatNumber((co2 * 1000) / mass, 1) : "—";

  const yearBuilt = geometry?.bouwjaar ?? inputs1.bouwjaar;
  const link = (path) => `${path}?address=${encodeURIComponent(query)}`;
  const flags = geometry?.flags ?? [];

  return (
    <article className="record-view" aria-label={`Building passport for ${title}`}>
      <header className="record-head">
        <div>
          <p className="record-head__kicker">Building passport</p>
          <h2 className="record-head__title">{title || "—"}</h2>
          <p className="record-head__meta">
            {[postalCode, city].filter(Boolean).join(" ")}
            {pandId && (
              <>
                <span className="record-head__sep" aria-hidden="true">·</span>
                Pand ID <span className="mono">{pandId}</span>
              </>
            )}
          </p>
        </div>
        <div className="record-head__actions">
          {estimate && (
            <Link className="button button--secondary" to={link("/method-1")}>
              Method 1 calculation
              <ArrowIcon />
            </Link>
          )}
          {geometry && (
            <Link className="button button--secondary" to={link("/method-2")}>
              Method 2 calculation
              <ArrowIcon />
            </Link>
          )}
        </div>
      </header>

      <Summary
        items={[
          { label: "Year built", value: text(yearBuilt) },
          { label: "Building type", value: text(geometry?.typegebouw) },
          {
            label: "Usable floor area (GO)",
            value: formatNumber(toNumber(geometry?.go_m2) ?? inputs1.go_m2, 0),
            unit: "m²",
          },
          {
            label: "Gross floor area (BVO)",
            value: formatNumber(toNumber(geometry?.bvo_m2), 0),
            unit: "m²",
          },
          {
            label: "Building height",
            value: formatNumber(toNumber(geometry?.height_max_m), 1),
            unit: "m",
          },
        ]}
      />

      <div className="record-layout">
        <div className="record-layout__main">
          <Section title="Building information" meta="BAG">
            <Fields
              columns={3}
              items={[
                { label: "Address", value: text(street) },
                { label: "House number", value: text(geometry?.house_number) },
                { label: "Postal code", value: text(postalCode), mono: true },
                { label: "City", value: text(city) },
                { label: "Year built", value: text(yearBuilt) },
                { label: "Building type", value: text(geometry?.typegebouw) },
                { label: "Age cohort", value: text(geometry?.cohort) },
                ...(inputs1.gebruiksdoel
                  ? [{ label: "Use (gebruiksdoel)", value: inputs1.gebruiksdoel }]
                  : []),
                { label: "Pand ID", value: text(pandId), mono: true },
                { label: "Notice ID", value: text(geometry?.notice_id), mono: true },
              ]}
            />
          </Section>

          {geometry && (
            <Section title="Geometry and measurements" meta="3DBAG · LoD 2.2">
              <Fields
                columns={3}
                items={[
                  { label: "Footprint", value: measure(geometry.opp_grond_m2, "m²") },
                  { label: "Volume", value: measure(geometry.volume_lod22_m3, "m³") },
                  { label: "Height (max / mean)", value: `${measure(geometry.height_max_m, "m", 1)} / ${measure(geometry.height_mean_m, "m", 1)}` },
                  { label: "Storeys (3DBAG)", value: text(geometry.bouwlagen) },
                  { label: "Storey equivalents", value: formatNumber(toNumber(geometry.storey_equivalents), 2) },
                  { label: "Storey height used", value: measure(geometry.storey_height_m, "m", 2) },
                  { label: "Gross floor area (BVO)", value: measure(geometry.bvo_m2, "m²") },
                  { label: "Usable floor area (GO)", value: measure(geometry.go_m2, "m²") },
                  { label: "GO ÷ BVO", value: formatNumber(toNumber(geometry.go_bvo_ratio), 2) },
                  { label: "External wall", value: measure(geometry.opp_buitenmuur_m2, "m²") },
                  { label: "Party wall", value: measure(geometry.opp_scheidingsmuur_m2, "m²") },
                  { label: "Window area", value: measure(geometry.window_area_m2, "m²") },
                  { label: "Flat roof", value: measure(geometry.opp_dak_plat_m2, "m²") },
                  { label: "Sloped roof", value: measure(geometry.opp_dak_schuin_m2, "m²") },
                  { label: "Roof pitch", value: measure(geometry.roof_pitch_deg, "°", 1) },
                  { label: "Perimeter", value: measure(geometry.perimeter_m, "m") },
                  { label: "Façade length", value: measure(geometry.facade_length_m, "m") },
                  { label: "Party wall length", value: measure(geometry.party_wall_length_m, "m") },
                  { label: "Foundation beam", value: measure(geometry.foundation_beam_length_m, "m") },
                  { label: "Internal walls", value: measure(geometry.internal_wall_m2, "m²") },
                ]}
              />
            </Section>
          )}

          <Section
            title="Material estimation"
            description="Estimated material mass and embodied carbon (A1–A3) per material, as calculated by each method."
          >
            <div className="material-lists">
              {estimate && (
                <MaterialList
                  caption="Method 1 — BAG floor area × B2 material profile"
                  rows={rows1}
                  total={{ tonnes: mass1, co2Tonnes: co21 }}
                />
              )}
              {geometry && (
                <MaterialList
                  caption="Method 2 — 3DBAG geometry × construction build-up"
                  rows={rows2}
                  total={{ tonnes: mass2, co2Tonnes: co22 }}
                />
              )}
            </div>
          </Section>

          <Section title="CO₂ estimation">
            <div className="table-wrap">
              <table className="data-table data-table--compact">
                <thead>
                  <tr>
                    <th scope="col">Measure</th>
                    {estimate && <th scope="col" className="num">Method 1</th>}
                    {geometry && <th scope="col" className="num">Method 2</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Total material mass (t)</th>
                    {estimate && <td className="num">{formatNumber(mass1)}</td>}
                    {geometry && <td className="num">{formatNumber(mass2)}</td>}
                  </tr>
                  <tr>
                    <th scope="row">Embodied carbon (tCO₂e)</th>
                    {estimate && <td className="num">{formatNumber(co21)}</td>}
                    {geometry && <td className="num">{formatNumber(co22)}</td>}
                  </tr>
                  <tr>
                    <th scope="row">Embodied carbon (kgCO₂e)</th>
                    {estimate && <td className="num">{formatNumber(materials1?.total?.co2_kg, 0)}</td>}
                    {geometry && <td className="num">{formatNumber(toNumber(geometry.total_co2_kg), 0)}</td>}
                  </tr>
                  <tr>
                    <th scope="row">Carbon intensity (kg CO₂e per t material)</th>
                    {estimate && <td className="num">{intensity(co21, mass1)}</td>}
                    {geometry && <td className="num">{intensity(co22, mass2)}</td>}
                  </tr>
                  {geometry && (
                    <>
                      <tr>
                        <th scope="row">Mass per m² BVO (kg)</th>
                        {estimate && <td className="num">—</td>}
                        <td className="num">{formatNumber(toNumber(geometry.mass_kg_per_m2_bvo), 1)}</td>
                      </tr>
                      <tr>
                        <th scope="row">CO₂e per m² BVO (kg)</th>
                        {estimate && <td className="num">—</td>}
                        <td className="num">{formatNumber(toNumber(geometry.co2e_kg_per_m2_bvo), 1)}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        <aside className="record-layout__side">
          <Section title="WOZ estimation" className="section--woz">
            <dl className="woz-list">
              {woz2 && (
                <div className="woz-list__item">
                  <dt>Method 2 — buurt, dwelling type and units</dt>
                  <dd>{formatEuro(woz2.value_eur)}</dd>
                </div>
              )}
              {woz1 && (
                <div className="woz-list__item">
                  <dt>Method 1 — gemeente price per m²</dt>
                  <dd>{formatEuro(woz1.value_eur)}</dd>
                </div>
              )}
              {!woz1 && !woz2 && (
                <div className="woz-list__item">
                  <dt>Estimated WOZ Value</dt>
                  <dd>—</dd>
                </div>
              )}
            </dl>
            <p className="section__note">
              {(woz2 ?? woz1)?.disclaimer ??
                "Model estimate, not an official WOZ value."}
            </p>
            <p className="section__links">
              <Link to="/method-1/docs">How Method 1 estimates WOZ</Link>
              <Link to="/method-2/docs">How Method 2 estimates WOZ</Link>
            </p>
          </Section>

          <Section title="Technical and source information">
            <Fields
              columns={1}
              items={[
                { label: "Pand ID (BAG)", value: text(pandId), mono: true },
                { label: "Notice ID", value: text(geometry?.notice_id), mono: true },
                { label: "Material profile", value: text(geometry?.material_profile_id), mono: true },
                { label: "Build-up profile (Method 2)", value: text(geometry?.assumption_profile), mono: true },
                {
                  label: "Sources",
                  value: "BAG (address, floor area, year built) · 3DBAG LoD 2.2 (geometry) · CBS StatLine (WOZ price levels)",
                },
                ...(matches > 1
                  ? [{ label: "Method 2 matches", value: `${matches} records match this search; the one with the same pand ID is shown` }]
                  : []),
              ]}
            />
            {flags.length > 0 && (
              <div className="flags">
                <span className="flags__label">Data quality flags (3DBAG)</span>
                <ul className="flags__list">
                  {flags.map((flag) => (
                    <li className="tag tag--warn" key={flag}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        </aside>
      </div>
    </article>
  );
}
