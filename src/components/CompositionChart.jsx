import { formatAmount, formatNumber, formatPercent } from "../lib/format";
import { getRemainder, UNATTRIBUTED_THRESHOLD } from "../lib/materials";

// Keep tooltips inside the bar near its edges
const tooltipAlign = (center) =>
  center < 0.18 ? "start" : center > 0.82 ? "end" : "center";

function StackedBar({ label, total, unit, groups, shareKey, valueKey }) {
  const remainder = getRemainder(groups, shareKey);

  const visible = groups.filter((group) => group[shareKey] > 0);
  const segments = visible.map((group, index) => {
    const start = visible
      .slice(0, index)
      .reduce((sum, item) => sum + item[shareKey], 0);

    return {
      ...group,
      align: tooltipAlign(start + group[shareKey] / 2),
    };
  });

  return (
    <div className="stacked">
      <div className="stacked__head">
        <span className="stacked__label">{label}</span>
        <span className="stacked__total">
          {formatNumber(total)} <em>{unit}</em>
        </span>
      </div>

      <div className="stacked__bar">
        {segments.map((group) => (
          <div
            key={group.key}
            className="segment"
            tabIndex={0}
            aria-label={`${group.label}: ${formatPercent(group[shareKey])}, ${formatAmount(group[valueKey])} ${unit}`}
            style={{ flexGrow: group[shareKey], background: group.color }}
          >
            <span className={`tooltip tooltip--${group.align}`} role="tooltip">
              <span className="tooltip__title">
                <i style={{ background: group.color }} />
                {group.label}
              </span>
              <span className="tooltip__values">
                <strong>{formatPercent(group[shareKey])}</strong>
                {formatAmount(group[valueKey])} {unit}
              </span>
            </span>
          </div>
        ))}

        {remainder > UNATTRIBUTED_THRESHOLD && (
          <div
            className="segment segment--unattributed"
            tabIndex={0}
            aria-label={`Unattributed: ${formatPercent(remainder)}`}
            style={{ flexGrow: remainder }}
          >
            <span className="tooltip tooltip--end" role="tooltip">
              <span className="tooltip__title">Unattributed</span>
              <span className="tooltip__values">
                <strong>{formatPercent(remainder)}</strong>
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompositionChart({ groups, total }) {
  return (
    <>
      <div className="stacked-group">
        <StackedBar
          label="By mass"
          total={total.tonnes}
          unit="t"
          groups={groups}
          shareKey="massShare"
          valueKey="tonnes"
        />

        <StackedBar
          label="By embodied carbon"
          total={total.co2_tonnes}
          unit="tCO₂e"
          groups={groups}
          shareKey="co2Share"
          valueKey="co2Tonnes"
        />
      </div>

      {/* Legend doubles as the chart's data table */}
      <ul className="legend">
        {groups.map((group) => (
          <li
            key={group.key}
            className={`legend__item${group.tonnes ? "" : " legend__item--empty"}`}
          >
            <i className="legend__swatch" style={{ background: group.color }} />

            <div className="legend__body">
              <span className="legend__name">{group.label}</span>
              {group.members.length > 1 && (
                <span className="legend__members">
                  {group.members.join(" · ")}
                </span>
              )}
            </div>

            <dl className="legend__values">
              <div>
                <dt>Mass</dt>
                <dd>{formatPercent(group.massShare)}</dd>
              </div>
              <div>
                <dt>CO₂e</dt>
                <dd>{formatPercent(group.co2Share)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
