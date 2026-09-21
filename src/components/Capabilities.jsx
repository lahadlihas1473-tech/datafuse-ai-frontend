import { BuildingIcon, CloudIcon, LayersIcon } from "./Icons";

const ITEMS = [
  {
    icon: LayersIcon,
    title: "13 material categories",
    text: "From Staal (Steel) and Koper (Copper) to Isolatie (Insulation) — each estimated in tonnes.",
  },
  {
    icon: CloudIcon,
    title: "Embodied carbon",
    text: "CO₂e per material and in total, plus carbon intensity per tonne of material.",
  },
  {
    icon: BuildingIcon,
    title: "Building-level data",
    text: "Every passport is linked to the building's pand ID for traceability.",
  },
];

// Shown before the first search, so the page explains what it returns
export default function Capabilities() {
  return (
    <ul className="capabilities">
      {ITEMS.map(({ icon: ItemIcon, title, text }) => (
        <li className="capability" key={title}>
          <span className="capability__icon">
            <ItemIcon />
          </span>
          <h2>{title}</h2>
          <p>{text}</p>
        </li>
      ))}
    </ul>
  );
}
