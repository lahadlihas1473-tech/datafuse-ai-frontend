import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  formatEuro,
  formatNumber,
  formatPercent,
  isNumber,
  parseAddress,
  text,
} from "../lib/format";
import {
  buildGroups,
  buildRows,
  MATERIALS,
  TOTAL_LABEL,
} from "../lib/materials";
import CompositionChart from "./CompositionChart";
import { ArrowIcon, CheckIcon, CopyIcon } from "./Icons";
import MaterialTable from "./MaterialTable";
import { Fields, Section, Summary } from "./ui";
import WozDetails from "./WozDetails";

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Could not copy pand ID:", error);
    }
  };

  return (
    <button
      type="button"
      className={`copy${copied ? " copy--done" : ""}`}
      onClick={handleCopy}
      aria-label={copied ? "Pand ID copied" : "Copy pand ID"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// Method 1 result for one building (GET /material-estimation/search)
export default function Passport({ result }) {
  const { street, postalCode, city, title } = parseAddress(result.address);
  const rows = buildRows(result.materials);
  const groups = buildGroups(rows);
  const total = result.materials?.total ?? {};
  const pandId = result.pand_id;
  const woz = result.estimated_woz;
  const inputs = woz?.inputs ?? {};

  const dominant = rows.reduce(
    (best, row) => (row.massShare > (best?.massShare ?? 0) ? row : best),
    null
  );

  const carbonIntensity =
    isNumber(total.co2_kg) && isNumber(total.tonnes) && total.tonnes > 0
      ? total.co2_kg / total.tonnes
      : null;

  const presentCount = rows.filter((row) => row.tonnes > 0).length;

  return (
    <article className="record-view" aria-label={`Method 1 result for ${title}`}>
      <header className="record-head">
        <div>
          <p className="record-head__kicker">Method 1 · BAG × B2 material profile</p>
          <h2 className="record-head__title">{title}</h2>
          <p className="record-head__meta">
            {[postalCode, city].filter(Boolean).join(" ")}
            {pandId && (
              <>
                <span className="record-head__sep" aria-hidden="true">·</span>
                Pand ID <span className="mono">{pandId}</span>
                <CopyButton value={String(pandId)} />
              </>
            )}
          </p>
        </div>
        <div className="record-head__actions">
          <Link
            className="button button--secondary"
            to={`/method-2?address=${encodeURIComponent(result.address ?? "")}`}
          >
            Method 2 for this address
            <ArrowIcon />
          </Link>
        </div>
      </header>

      <Summary
        items={[
          {
            label: `${total.label ?? TOTAL_LABEL} mass`,
            value: formatNumber(total.tonnes),
            unit: "t",
            note: `${formatNumber(total.kg, 0)} kg`,
          },
          {
            label: "Embodied carbon",
            value: formatNumber(total.co2_tonnes),
            unit: "tCO₂e",
            note: `${formatNumber(total.co2_kg, 0)} kgCO₂e`,
          },
          {
            label: "Carbon intensity",
            value: formatNumber(carbonIntensity, 1),
            unit: "kg/t",
            note: "kg CO₂e per tonne of material",
          },
          {
            label: "Dominant material",
            value: dominant ? dominant.label : "—",
            note: dominant ? `${formatPercent(dominant.massShare)} of total mass` : "No material data",
          },
        ]}
      />

      <Section title="Building information" meta="BAG">
        <Fields
          columns={3}
          items={[
            { label: "Address", value: text(street) },
            { label: "Postal code", value: text(postalCode), mono: true },
            { label: "City", value: text(city) },
            { label: "Pand ID", value: text(pandId), mono: true },
            ...(inputs.bouwjaar ? [{ label: "Year built", value: String(inputs.bouwjaar) }] : []),
            ...(isNumber(inputs.go_m2)
              ? [{ label: "Usable floor area (GO)", value: `${formatNumber(inputs.go_m2, 0)} m²` }]
              : []),
            ...(inputs.gebruiksdoel ? [{ label: "Use (gebruiksdoel)", value: inputs.gebruiksdoel }] : []),
          ]}
        />
      </Section>

      <Section
        title="Material estimation"
        description={`All ${MATERIALS.length} material categories — estimated mass and embodied carbon (CO₂e, A1–A3).`}
        meta={`${presentCount} of ${MATERIALS.length} present`}
      >
        <MaterialTable rows={rows} total={total} />
      </Section>

      <Section
        title="Composition"
        description="Share of each material family by mass and by embodied carbon. Hover or focus a segment for its values."
        meta={`${groups.length} families`}
      >
        <CompositionChart groups={groups} total={total} />
      </Section>

      {woz && (
        <Section
          title="WOZ estimation (Method 1)"
          description="Usable floor area × the CBS price per m² of the gemeente (municipality), adjusted for building type and age."
          meta={woz.reference_year ? `WOZ year ${woz.reference_year}` : undefined}
        >
          <p className="woz-headline">
            <span className="woz-headline__label">{woz.label}</span>
            <span className="woz-headline__value">{formatEuro(woz.value_eur)}</span>
          </p>
          <WozDetails woz={woz} />
        </Section>
      )}
    </article>
  );
}
