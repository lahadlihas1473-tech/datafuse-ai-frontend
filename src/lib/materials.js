import { isNumber } from "./format";

// Material families, in fixed order (colours validated for the dark surface).
// 13 materials are too many to colour individually, so charts group them.
export const GROUPS = [
  { key: "minerals", label: "Beton & mineralen (Concrete & Minerals)", color: "#8b7fd6" },
  { key: "masonry", label: "Baksteen & keramiek (Brick & Ceramics)", color: "#d0714f" },
  { key: "metals", label: "Metalen (Metals)", color: "#3f9fd0" },
  { key: "wood", label: "Hout (Wood)", color: "#b8892f" },
  { key: "glass", label: "Glas (Glass)", color: "#2fa894" },
  { key: "plastics", label: "Kunststof & isolatie (Plastics & Insulation)", color: "#b85fc0" },
  { key: "other", label: "Overig (Other)", color: "#8a8d84" },
];

const GROUP_COLORS = Object.fromEntries(
  GROUPS.map((group) => [group.key, group.color])
);

// All 13 materials, in table order; `key` matches the API response.
// `label` is a fallback — the API sends the same label per material.
export const MATERIALS = [
  { key: "steel", label: "Staal (Steel)", group: "metals" },
  { key: "copper", label: "Koper (Copper)", group: "metals" },
  { key: "aluminium", label: "Aluminium (Aluminium)", group: "metals" },
  { key: "other_metal", label: "Overig metaal (Other Metal)", group: "metals" },
  { key: "wood", label: "Hout (Wood)", group: "wood" },
  { key: "concrete", label: "Beton (Concrete)", group: "minerals" },
  { key: "brick", label: "Baksteen (Brick)", group: "masonry" },
  {
    key: "other_construction_minerals",
    label: "Overige constructie mineralen (Other Construction Minerals)",
    group: "minerals",
  },
  { key: "glass", label: "Glas (Glass)", group: "glass" },
  { key: "ceramics", label: "Keramiek (Ceramics)", group: "masonry" },
  { key: "plastic", label: "Plastic (Plastic)", group: "plastics" },
  { key: "insulation", label: "Isolatie (Insulation)", group: "plastics" },
  { key: "other", label: "Overig (Other)", group: "other" },
];

export const TOTAL_LABEL = "Totaal (Total)";

// Totals can exceed the sum of listed materials; show the gap above 0.5%
export const UNATTRIBUTED_THRESHOLD = 0.005;

export const sumBy = (items, field) =>
  items.reduce(
    (total, item) => total + (isNumber(item[field]) ? item[field] : 0),
    0
  );

export const getRemainder = (items, shareKey) =>
  1 - sumBy(items, shareKey);

// Per-material rows with share of total mass and CO₂e
export const buildRows = (materials) => {
  const rows = MATERIALS.map((material, index) => ({
    ...material,
    index,
    label: materials?.[material.key]?.label ?? material.label,
    color: GROUP_COLORS[material.group],
    tonnes: materials?.[material.key]?.tonnes,
    co2Tonnes: materials?.[material.key]?.co2_tonnes,
    co2Kg: materials?.[material.key]?.co2_kg,
  }));

  const totalTonnes = isNumber(materials?.total?.tonnes)
    ? materials.total.tonnes
    : sumBy(rows, "tonnes");

  const totalCo2 = isNumber(materials?.total?.co2_tonnes)
    ? materials.total.co2_tonnes
    : sumBy(rows, "co2Tonnes");

  return rows.map((row) => ({
    ...row,
    massShare:
      totalTonnes > 0 && isNumber(row.tonnes) ? row.tonnes / totalTonnes : 0,
    co2Share:
      totalCo2 > 0 && isNumber(row.co2Tonnes) ? row.co2Tonnes / totalCo2 : 0,
  }));
};

// Roll material rows up into their families for the composition chart
export const buildGroups = (rows) =>
  GROUPS.map((group) => {
    const members = rows.filter((row) => row.group === group.key);

    return {
      ...group,
      members: members.map((row) => row.label),
      tonnes: sumBy(members, "tonnes"),
      co2Tonnes: sumBy(members, "co2Tonnes"),
      massShare: sumBy(members, "massShare"),
      co2Share: sumBy(members, "co2Share"),
    };
  });
