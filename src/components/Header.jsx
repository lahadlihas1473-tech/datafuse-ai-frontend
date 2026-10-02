import { Link, NavLink } from "react-router";
import {
  BookIcon,
  BuildingIcon,
  GovernmentIcon,
  LayersIcon,
  LogoMark,
  NoticeIcon,
  PinIcon,
  RulerIcon,
} from "./Icons";
import ThemeToggle from "./ThemeToggle";

// `end` keeps a method page inactive while its documentation is open
const NAV_ITEMS = [
  { to: "/", label: "Passport", icon: BuildingIcon, end: true },
  { to: "/notices", label: "Notices", icon: NoticeIcon },
  { to: "/addresses", label: "Addresses", icon: PinIcon },
  {
    to: "/amsterdam-government",
    label: "Amsterdam Government Buildings",
    icon: GovernmentIcon,
  },
  { to: "/method-1", label: "Method 1", icon: LayersIcon, end: true },
  { to: "/method-1/docs", label: "Method 1 Documentation", icon: BookIcon },
  { to: "/method-2", label: "Method 2", icon: RulerIcon, end: true },
  { to: "/method-2/docs", label: "Method 2 Documentation", icon: BookIcon },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <div className="container site-header__inner">
          <Link className="brand" to="/" aria-label="Resource Paspoort, building passport">
            <LogoMark />
            <span className="brand__name">Resource Paspoort</span>
          </Link>
          <span className="brand__subtitle">Material &amp; CO₂ Building Passport</span>
          <ThemeToggle />
        </div>
      </div>

      <nav className="nav" aria-label="Main">
        <div className="container nav__inner">
          {NAV_ITEMS.map(({ to, label, icon: ItemIcon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              <ItemIcon />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
