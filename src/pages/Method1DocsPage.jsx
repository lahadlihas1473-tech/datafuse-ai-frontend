import DocPage from "../components/DocPage";
import { BuildingIcon } from "../components/Icons";
import doc from "../data/method1Doc.json";

export default function Method1DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 1 · Method and results · Resource Paspoort"
      eyebrow="Method 1 · documentation"
      lede="How material mass and CO₂ are calculated from the BAG floor area and the B2 material profile: the classification, the full B2 intensity tables, the emission factors, the worked example and the results for all 1,082 buildings."
      backTo="/"
      backLabel="Back to Method 1 search"
      backIcon={BuildingIcon}
    />
  );
}
