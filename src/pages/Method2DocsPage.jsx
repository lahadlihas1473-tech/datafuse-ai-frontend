import DocPage from "../components/DocPage";
import { RulerIcon } from "../components/Icons";
// One process from 3DBAG geometry to material, CO₂ and the Estimated WOZ
// Value (built by dataset/build_method2_full_doc.py)
import doc from "../data/method2Doc.json";

export default function Method2DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 2 · Method and results · Resource Paspoort"
      eyebrow="Method 2 · documentation"
      lede="Method 2 as one process: from the measured 3DBAG geometry of each building to its material mass, its embodied CO₂ and its Estimated WOZ Value — every step, every assumption, one building worked through from start to finish, and the results for all 1,082 buildings."
      backTo="/method-2"
      backLabel="Back to Method 2 search"
      backIcon={RulerIcon}
    />
  );
}
