import DocPage from "../components/DocPage";
import { BuildingIcon } from "../components/Icons";
// One process from the BAG floor area to material, CO₂ and the Estimated WOZ
// Value (built by dataset/build_method1_full_doc.py)
import doc from "../data/method1Doc.json";

export default function Method1DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 1 · Method and results · Resource Paspoort"
      eyebrow="Method 1 · documentation"
      lede="Method 1 as one process: from the BAG floor area of each building to its material mass, its embodied CO₂ and its Estimated WOZ Value — every step, every assumption, one building worked through from start to finish, and the results for all 1,082 buildings."
      backTo="/"
      backLabel="Back to Method 1 search"
      backIcon={BuildingIcon}
    />
  );
}
