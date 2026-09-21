import { useEffect, useRef, useState } from "react";
import {
  formatNumber,
  formatPercent,
  isNumber,
  splitAddress,
} from "../lib/format";
import {
  buildGroups,
  buildRows,
  MATERIALS,
  TOTAL_LABEL,
} from "../lib/materials";
import CompositionChart from "./CompositionChart";
import MaterialTable from "./MaterialTable";
import {
  BuildingIcon,
  CheckIcon,
  CloudIcon,
  CopyIcon,
  GaugeIcon,
  LayersIcon,
  PinIcon,
  WeightIcon,
} from "./Icons";

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
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy ID"}
    </button>
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

export default function Passport({ result }) {
  const [street, locality] = splitAddress(result.address);
  const rows = buildRows(result.materials);
  const groups = buildGroups(rows);
  const total = result.materials?.total ?? {};
  const pandId = result.pand_id;

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
    <article className="passport">
      <header className="passport__head reveal" style={{ "--i": 0 }}>
        <div className="passport__tags">
          <span className="eyebrow">Building passport</span>
          <span className="tag">Estimate</span>
        </div>

        <h2 className={street.length > 40 ? "passport__title--long" : undefined}>
          {street}
        </h2>

        {locality && (
          <p className="passport__locality">
            <PinIcon />
            {locality}
          </p>
        )}
      </header>

      <div className="stats reveal" style={{ "--i": 1 }}>
        <StatCard
          icon={BuildingIcon}
          label="Pand ID"
          footer={pandId ? <CopyButton value={String(pandId)} /> : "Not available"}
        >
          <span className="stat__mono">{pandId ?? "—"}</span>
        </StatCard>

        <StatCard
          icon={WeightIcon}
          label={`${total.label ?? TOTAL_LABEL} mass`}
          footer={`${formatNumber(total.kg, 0)} kg`}
        >
          {formatNumber(total.tonnes)}
          <span className="stat__unit">t</span>
        </StatCard>

        <StatCard
          icon={CloudIcon}
          label="Embodied carbon"
          accent
          footer={`${formatNumber(total.co2_kg, 0)} kgCO₂e`}
        >
          {formatNumber(total.co2_tonnes)}
          <span className="stat__unit">tCO₂e</span>
        </StatCard>

        <StatCard
          icon={GaugeIcon}
          label="Carbon intensity"
          footer="kg CO₂e per tonne of material"
        >
          {formatNumber(carbonIntensity, 1)}
          <span className="stat__unit">kg/t</span>
        </StatCard>

        <StatCard
          icon={LayersIcon}
          label="Dominant material"
          footer={
            dominant
              ? `${formatPercent(dominant.massShare)} of total mass`
              : "No material data"
          }
        >
          {dominant ? (
            <span className="stat__text">
              <i className="swatch" style={{ background: dominant.color }} />
              {dominant.label}
            </span>
          ) : (
            "—"
          )}
        </StatCard>
      </div>

      <Panel
        index={2}
        title="Composition"
        description="Share of each material family by mass and by embodied carbon. Hover or focus a segment for details."
        meta={`${groups.length} families`}
      >
        <CompositionChart groups={groups} total={total} />
      </Panel>

      <Panel
        index={3}
        title="Material breakdown"
        description={`All ${MATERIALS.length} material categories — estimated mass and embodied carbon (CO₂e).`}
        meta={`${presentCount} of ${MATERIALS.length} present`}
      >
        <MaterialTable rows={rows} total={total} />
      </Panel>
    </article>
  );
}

export function PassportSkeleton() {
  return (
    <div className="passport passport--loading" aria-busy="true" aria-label="Loading building passport">
      <div className="skeleton skeleton--eyebrow" />
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />

      <div className="stats">
        {[0, 1, 2, 3, 4].map((item) => (
          <div className="stat" key={item}>
            <div className="skeleton skeleton--label" />
            <div className="skeleton skeleton--value" />
            <div className="skeleton skeleton--label" />
          </div>
        ))}
      </div>

      <div className="skeleton skeleton--panel" />
    </div>
  );
}
