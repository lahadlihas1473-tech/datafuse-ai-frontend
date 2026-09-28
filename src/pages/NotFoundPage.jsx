import { useEffect } from "react";
import { Link } from "react-router";
import { PageHeader } from "../components/ui";

const LINKS = [
  { to: "/", label: "Passport" },
  { to: "/notices", label: "Notices" },
  { to: "/addresses", label: "Addresses" },
  { to: "/method-1", label: "Method 1" },
  { to: "/method-1/docs", label: "Method 1 Documentation" },
  { to: "/method-2", label: "Method 2" },
  { to: "/method-2/docs", label: "Method 2 Documentation" },
];

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "Page not found · Resource Paspoort";
  }, []);

  return (
    <section className="not-found">
      <PageHeader
        kicker="404"
        title="Page not found"
        description="This page doesn’t exist. Go to one of the sections below."
      />
      <ul className="not-found__links">
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
