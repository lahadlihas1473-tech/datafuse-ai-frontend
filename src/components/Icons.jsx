// Stroke icons on a 24px grid; colour follows `currentColor`
function Icon({ children, className = "icon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const ArrowIcon = (props) => (
  <Icon {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M7 7l10 10M17 7 7 17" />
  </Icon>
);

export const CopyIcon = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const PinIcon = (props) => (
  <Icon {...props}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Icon>
);

export const NoticeIcon = (props) => (
  <Icon {...props}>
    <path d="M14 3.5H7.5A2 2 0 0 0 5.5 5.5v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8L14 3.5Z" />
    <path d="M14 3.5V8h4.5M9 12.5h6M9 16h4" />
  </Icon>
);

// Method 2: measured geometry (footprint, height, volume)
export const RulerIcon = (props) => (
  <Icon {...props}>
    <path d="M4 14.5 14.5 4l5.5 5.5L9.5 20 4 14.5Z" />
    <path d="M8 10.5l1.8 1.8M11 7.5l1.8 1.8M14.5 11.5l1.8 1.8" />
  </Icon>
);

export const ChevronIcon = ({ direction = "right", ...props }) => (
  <Icon {...props}>
    <path d={direction === "left" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
  </Icon>
);

export const BuildingIcon = (props) => (
  <Icon {...props}>
    <path d="M4 20h16M6 20V5.5L13 3v17M13 8.5l5 1.8V20" />
    <path d="M9 8h1M9 11.5h1M9 15h1" />
  </Icon>
);

export const WeightIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="6" r="2.2" />
    <path d="M8.2 9h7.6l2.7 11H5.5L8.2 9Z" />
  </Icon>
);

export const CloudIcon = (props) => (
  <Icon {...props}>
    <path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96 6 6 0 0 1 11.52 1.47A3.75 3.75 0 0 1 17.25 18.5H7Z" />
  </Icon>
);

export const GaugeIcon = (props) => (
  <Icon {...props}>
    <path d="M4.5 17a8 8 0 1 1 15 0" />
    <path d="m12 13 3.5-4" />
    <circle cx="12" cy="13.5" r="1" />
  </Icon>
);

export const LayersIcon = (props) => (
  <Icon {...props}>
    <path d="m12 4 8.5 4.5L12 13 3.5 8.5 12 4Z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.3 12 20.8l8.5-4.5" />
  </Icon>
);

export const SortIcon = ({ direction, ...props }) => (
  <Icon {...props}>
    <path
      d="m8 10 4-4 4 4"
      opacity={direction === "desc" ? 0.3 : 1}
    />
    <path
      d="m8 14 4 4 4-4"
      opacity={direction === "asc" ? 0.3 : 1}
    />
  </Icon>
);

export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" />
      <path d="M9 23V11l7-4 7 4v12" />
      <path d="M13 23v-6h6v6" />
    </svg>
  );
}
