import { useEffect } from "react";
import { Link } from "react-router";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Page not found · DataFuseAI";
  }, []);

  return (
    <section className="not-found">
      <span className="eyebrow">404</span>
      <h1 className="page-head__title">Page not found</h1>
      <p className="page-head__lede">
        This page doesn’t exist. Try the passport search, or browse notices
        and addresses.
      </p>
      <div className="not-found__links">
        <Link className="button" to="/">
          Building passport
        </Link>
        <Link className="button button--ghost" to="/notices">
          Notices
        </Link>
        <Link className="button button--ghost" to="/addresses">
          Addresses
        </Link>
      </div>
    </section>
  );
}
