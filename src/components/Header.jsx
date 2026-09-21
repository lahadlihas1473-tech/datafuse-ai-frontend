import { LogoMark } from "./Icons";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="/" aria-label="DataFuseAI home">
          <LogoMark />
          <span className="brand__name">
            DataFuse<span>AI</span>
          </span>
        </a>

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
