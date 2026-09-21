import { Link, NavLink } from "react-router";
import { LogoMark } from "./Icons";

const NAV_ITEMS = [
  { to: "/", label: "Passport", end: true },
  { to: "/notices", label: "Notices" },
  { to: "/addresses", label: "Addresses" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label="DataFuseAI home">
          <LogoMark />
          <span className="brand__name">
            DataFuse<span>AI</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav__link${isActive ? " nav__link--active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__meta">
          <span className="header-pill">
            <span className="status-dot" aria-hidden="true" />
            Material &amp; CO₂ Building Passport
          </span>
        </div>
      </div>
    </header>
  );
}
