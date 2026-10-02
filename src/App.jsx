import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import Header from "./components/Header";
import { useBuildingSearch } from "./hooks/useBuildingSearch";
import { useMethod2Search } from "./hooks/useMethod2Search";
import { usePassportSearch } from "./hooks/usePassportSearch";
import AddressesPage from "./pages/AddressesPage";
import AmsterdamGovernmentPage from "./pages/AmsterdamGovernmentPage";
import Method1DocsPage from "./pages/Method1DocsPage";
import Method1Page from "./pages/Method1Page";
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
  // Held here so the last result survives switching pages
  const building = useBuildingSearch();
  const method1 = usePassportSearch();
  const method2 = useMethod2Search();

  return (
    <div className="app">
      <ScrollToTop />

      <Header />

      <main className="container main">
        <Routes>
          <Route path="/" element={<PassportPage building={building} />} />
          <Route path="/method-1" element={<Method1Page passport={method1} />} />
          <Route path="/method-1/docs" element={<Method1DocsPage />} />
          <Route path="/method-2" element={<Method2Page method2={method2} />} />
          <Route path="/method-2/docs" element={<Method2DocsPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/amsterdam-government" element={<AmsterdamGovernmentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>
            <strong>Resource Paspoort</strong> · Material &amp; CO₂ Building Passport
          </span>
          <span>Estimates per building (pand) · mass in tonnes · carbon in CO₂e</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
