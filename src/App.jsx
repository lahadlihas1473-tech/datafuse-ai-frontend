import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import Header from "./components/Header";
import { useMethod2Search } from "./hooks/useMethod2Search";
import { usePassportSearch } from "./hooks/usePassportSearch";
import AddressesPage from "./pages/AddressesPage";
import Method1DocsPage from "./pages/Method1DocsPage";
import Method2DocsPage from "./pages/Method2DocsPage";
import Method2Page from "./pages/Method2Page";
import NoticesPage from "./pages/NoticesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PassportPage from "./pages/PassportPage";

// Start each new page at the top (search/page changes keep scroll)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Held here so the last passport survives switching pages
  const passport = usePassportSearch();
  const method2 = useMethod2Search();

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true" />
      <ScrollToTop />

      <Header />

      <main className="container main">
        <Routes>
          <Route path="/" element={<PassportPage passport={passport} />} />
          <Route
            path="/method-2"
            element={<Method2Page method2={method2} />}
          />
          <Route path="/method-1/docs" element={<Method1DocsPage />} />
          <Route path="/method-2/docs" element={<Method2DocsPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="container footer">
        <span className="footer__brand">Resource Paspoort</span>
        <span>
          Estimates per building (pand) · mass in tonnes · carbon in CO₂e
        </span>
      </footer>
    </div>
  );
}

export default App;
