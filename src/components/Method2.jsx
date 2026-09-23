import { formatNumber, isNumber } from "../lib/format";
import {
  BuildingIcon,
  CloudIcon,
  GaugeIcon,
  RulerIcon,
  WeightIcon,
} from "./Icons";

// public.method_2 returns NUMERIC columns as strings
const toNumber = (value) => {
  const number = Number(value);
  return isNumber(number) ? number : null;
};

const text = (value) => (value === null || value === "" ? "—" : value);

// Value with a unit, or an em dash when the column is empty
const measure = (value, unit, digits = 2) => {
  const number = toNumber(value);
  return number === null ? "—" : `${formatNumber(number, digits)} ${unit}`;
};

// The seven reported material groups, as stored in public.method_2
const MATERIALS = [
  { key: "concrete", label: "Beton (Concrete)" },
  { key: "brick", label: "Baksteen (Brick)" },
  { key: "steel", label: "Staal (Steel)" },
  { key: "wood", label: "Hout (Wood)" },
  { key: "glass", label: "Glas (Glass)" },
  { key: "copper", label: "Koper (Copper)" },
  { key: "other", label: "Overig (Other)" },
];

function StatCard({ icon: CardIcon, label, accent, children, footer }) {
  return (
    <article className={`stat${accent ? " stat--accent" : ""}`}>
      <header className="stat__head">
        <span className="stat__label">{label}</span>
        <span className="stat__icon">
          <CardIcon />
        </span>
      </header>
      <div className="stat__value">{children}</div>
      <div className="stat__foot">{footer}</div>
    </article>
  );
}

function Panel({ title, description, meta, children, index }) {
  return (
    <section className="panel reveal" style={{ "--i": index }}>
      <header className="panel__head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {meta && <span className="panel__meta">{meta}</span>}
      </header>
      {children}
    </section>
  );
}

function Facts({ items }) {
  return (
    <dl className="facts">
      {items.map(({ label, value }) => (
        <div className="fact" key={label}>
          <dt className="fact__label">{label}</dt>
          <dd className="fact__value">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Method2({ record }) {
  const street = [record.address, record.house_number]
    .filter(Boolean)
    .join(" ");

  const locality = [record.postal_code, record.city]
    .filter(Boolean)
    .join(" ");

  const totalMass = toNumber(record.total_material_mass_tonnes);
  const totalCo2 = toNumber(record.total_co2_tonnes);

  const rows = MATERIALS.map(({ key, label }) => {
    const tonnes = toNumber(record[`${key}_tonnes`]);
    const co2Tonnes = toNumber(record[`${key}_co2_tonnes`]);

    return {
      key,
      label,
      tonnes,
      co2Tonnes,
      share: totalMass && tonnes !== null ? tonnes / totalMass : null,
    };
  });

  const flags = record.flags ?? [];

  return (
    <article className="passport method2">
      <header className="passport__head reveal" style={{ "--i": 0 }}>
        <div className="passport__tags">
          <span className="eyebrow">Method 2</span>
          <span className="tag">3DBAG geometry</span>
          {record.assumption_profile && (
            <span className="tag">{record.assumption_profile}</span>
          )}
        </div>

        <h2 className={street.length > 40 ? "passport__title--long" : undefined}>
          {street || record.name}
        </h2>

        {locality && <p className="passport__locality">{locality}</p>}
      </header>

      <div className="stats reveal" style={{ "--i": 1 }}>
        <StatCard
          icon={BuildingIcon}
          label="Pand ID"
          footer={text(record.notice_id)}
        >
          <span className="stat__mono">{text(record.pand_id)}</span>
        </StatCard>

        <StatCard
          icon={WeightIcon}
          label="Total material mass"
          footer={measure(record.mass_kg_per_m2_bvo, "kg per m² BVO", 1)}
        >
          {formatNumber(totalMass)}
          <span className="stat__unit">t</span>
        </StatCard>

        <StatCard
          icon={CloudIcon}
          label="Embodied carbon"
          accent
          footer={measure(record.co2e_kg_per_m2_bvo, "kgCO₂e per m² BVO", 1)}
        >
          {formatNumber(totalCo2)}
          <span className="stat__unit">tCO₂e</span>
        </StatCard>

        <StatCard
          icon={RulerIcon}
          label="Gross floor area (BVO)"
          footer={`Usable area (GO) ${measure(record.go_m2, "m²", 0)}`}
        >
          {formatNumber(toNumber(record.bvo_m2), 0)}
          <span className="stat__unit">m²</span>
        </StatCard>

        <StatCard
          icon={GaugeIcon}
          label="Building height"
          footer={`Mean ${measure(record.height_mean_m, "m", 1)}`}
        >
          {formatNumber(toNumber(record.height_max_m), 1)}
          <span className="stat__unit">m</span>
        </StatCard>
      </div>

      <Panel
        index={2}
        title="Building"
        description="Type and age group from BAG, with the construction build-up chosen for them."
        meta={text(record.material_profile_id)}
      >
        <Facts
          items={[
            { label: "Year built", value: text(record.bouwjaar) },
            { label: "Building type", value: text(record.typegebouw) },
            { label: "Age cohort", value: text(record.cohort) },
            { label: "Build-up profile", value: text(record.assumption_profile) },
            { label: "Storeys (3DBAG)", value: text(record.bouwlagen) },
            {
              label: "Storey equivalents",
              value: formatNumber(toNumber(record.storey_equivalents), 2),
            },
            {
              label: "Storey height used",
              value: measure(record.storey_height_m, "m", 2),
            },
            {
              label: "GO ÷ BVO",
              value: formatNumber(toNumber(record.go_bvo_ratio), 2),
            },
          ]}
        />
      </Panel>

      <Panel
        index={3}
        title="Geometry (3DBAG)"
        description="Measured surfaces and volume, and the lengths and areas derived from them."
        meta="LoD 2.2"
      >
        <Facts
          items={[
            { label: "Footprint", value: measure(record.opp_grond_m2, "m²") },
            {
              label: "External wall",
              value: measure(record.opp_buitenmuur_m2, "m²"),
            },
            {
              label: "Party wall",
              value: measure(record.opp_scheidingsmuur_m2, "m²"),
            },
            { label: "Flat roof", value: measure(record.opp_dak_plat_m2, "m²") },
            {
              label: "Sloped roof",
              value: measure(record.opp_dak_schuin_m2, "m²"),
            },
            { label: "Volume", value: measure(record.volume_lod22_m3, "m³") },
            { label: "Perimeter", value: measure(record.perimeter_m, "m") },
            {
              label: "Roof pitch",
              value: measure(record.roof_pitch_deg, "°", 1),
            },
            {
              label: "Façade length",
              value: measure(record.facade_length_m, "m"),
            },
            {
              label: "Party wall length",
              value: measure(record.party_wall_length_m, "m"),
            },
            { label: "Window area", value: measure(record.window_area_m2, "m²") },
            {
              label: "Foundation beam",
              value: measure(record.foundation_beam_length_m, "m"),
            },
            {
              label: "Internal walls",
              value: measure(record.internal_wall_m2, "m²"),
            },
          ]}
        />
      </Panel>

      <Panel
        index={4}
        title="Materials and CO₂"
        description="Estimated mass and embodied carbon (A1–A3) per reported material group."
        meta={`${rows.filter((row) => row.tonnes > 0).length} of ${
          MATERIALS.length
        } present`}
      >
        <div className="table-wrap">
          <table className="data-table method2__table">
            <thead>
              <tr>
                <th scope="col">Material</th>
                <th scope="col">Mass (t)</th>
                <th scope="col">Share</th>
                <th scope="col">CO₂e (t)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.label}</th>
                  <td>{formatNumber(row.tonnes)}</td>
                  <td>
                    {row.share === null
                      ? "—"
                      : `${(row.share * 100).toFixed(1)}%`}
                  </td>
                  <td>{formatNumber(row.co2Tonnes)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Totaal (Total)</th>
                <td>{formatNumber(totalMass)}</td>
                <td>100.0%</td>
                <td>{formatNumber(totalCo2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {flags.length > 0 && (
          <div className="method2__flags">
            <span className="method2__flags-label">Data quality</span>
            {flags.map((flag) => (
              <span className="tag" key={flag}>
                {flag}
              </span>
            ))}
          </div>
        )}
      </Panel>
    </article>
  );
}
