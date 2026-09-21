import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";
import Header from "./components/Header";
import { usePassportSearch } from "./hooks/usePassportSearch";
import AddressesPage from "./pages/AddressesPage";
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

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true" />
      <ScrollToTop />

      <Header />

      <main className="container main">
        <Routes>
          <Route path="/" element={<PassportPage passport={passport} />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="container footer">
        <span className="footer__brand">DataFuseAI</span>
        <span>
          Estimates per building (pand) · mass in tonnes · carbon in CO₂e
        </span>
      </footer>
    </div>
  );
}

export default App;
