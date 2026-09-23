import DocPage from "../components/DocPage";
import { RulerIcon } from "../components/Icons";
import doc from "../data/method2Doc.json";

export default function Method2DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 2 · Method and results · Resource Paspoort"
      eyebrow="Method 2 · documentation"
      lede="How material mass and CO₂ are calculated for every building from the 3DBAG geometry: the measured surfaces, the construction build-up per building part, the assumptions, the worked example and the results."
      backTo="/method-2"
      backLabel="Back to Method 2 search"
      backIcon={RulerIcon}
    />
  );
}
