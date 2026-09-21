import { useState } from "react";
import {
  formatAmount,
  formatNumber,
  formatPercent,
} from "../lib/format";
import { TOTAL_LABEL } from "../lib/materials";
import { SortIcon } from "./Icons";

const SORTABLE_COLUMNS = {
  label: "Material",
  tonnes: "Mass (t)",
  co2Tonnes: "CO₂e (t)",
};

// Click cycles: descending → ascending → original order
const nextSort = (current, key) => {
  if (current?.key !== key) {
    return { key, direction: key === "label" ? "asc" : "desc" };
  }

  if (current.direction === (key === "label" ? "asc" : "desc")) {
    return { key, direction: key === "label" ? "desc" : "asc" };
  }

  return null;
};

const describeSort = ({ key, direction }) => {
  if (key === "label") {
    return direction === "asc" ? "A–Z" : "Z–A";
  }

  return direction === "asc" ? "low to high" : "high to low";
};

const sortRows = (rows, sort) => {
  if (!sort) {
    return rows;
  }

  const factor = sort.direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    if (sort.key === "label") {
      return factor * a.label.localeCompare(b.label);
    }

    return factor * ((a[sort.key] ?? 0) - (b[sort.key] ?? 0));
  });
};

function SortableHeader({ column, sort, onSort, className }) {
  const active = sort?.key === column;
  const ariaSort = active
    ? sort.direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th scope="col" className={className} aria-sort={ariaSort}>
      <button
        type="button"
        className={`sort${active ? " sort--active" : ""}`}
        onClick={() => onSort(column)}
      >
        {SORTABLE_COLUMNS[column]}
        <SortIcon
          className="icon sort__icon"
          direction={active ? sort.direction : undefined}
        />
      </button>
    </th>
  );
}

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

export default function MaterialTable({ rows, total }) {
  const [sort, setSort] = useState(null);
  const sortedRows = sortRows(rows, sort);

  const handleSort = (column) =>
    setSort((current) => nextSort(current, column));

  return (
    <>
      <div className="table-toolbar">
        <span className="table-toolbar__hint">
          {sort
            ? `Sorted by ${SORTABLE_COLUMNS[sort.key]} · ${describeSort(sort)}`
            : "Sort by column headers"}
        </span>

        {sort && (
          <button
            type="button"
            className="text-button"
            onClick={() => setSort(null)}
          >
            Reset order
          </button>
        )}

        <span className="table-toolbar__swipe" aria-hidden="true">
          Swipe for more →
        </span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader
                column="label"
                sort={sort}
                onSort={handleSort}
                className="col-material"
              />
              <SortableHeader
                column="tonnes"
                sort={sort}
                onSort={handleSort}
                className="num"
              />
              <th scope="col" className="col-share">Share of mass</th>
              <SortableHeader
                column="co2Tonnes"
                sort={sort}
                onSort={handleSort}
                className="num"
              />
              <th scope="col" className="num">CO₂e (kg)</th>
              <th scope="col" className="col-share">Share of CO₂e</th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row) => {
              const isZero = !row.tonnes && !row.co2Tonnes;

              return (
                <tr key={row.key} className={isZero ? "is-zero" : undefined}>
                  <th scope="row" className="col-material">
                    <span className="material">
                      <i
                        className="swatch"
                        style={{ background: row.color }}
                      />
                      {row.label}
                    </span>
                  </th>
                  <td className="num">{formatAmount(row.tonnes)}</td>
                  <ShareCell value={row.massShare} color={row.color} />
                  <td className="num">{formatAmount(row.co2Tonnes)}</td>
                  <td className="num num--muted">
                    {formatNumber(row.co2Kg, 0)}
                  </td>
                  <ShareCell value={row.co2Share} color={row.color} />
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr>
              <th scope="row" className="col-material">
                {total.label ?? TOTAL_LABEL}
              </th>
              <td className="num">{formatNumber(total.tonnes)}</td>
              <td className="col-share">
                <span className="share__value">100%</span>
              </td>
              <td className="num">{formatNumber(total.co2_tonnes)}</td>
              <td className="num">{formatNumber(total.co2_kg, 0)}</td>
              <td className="col-share">
                <span className="share__value">100%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
