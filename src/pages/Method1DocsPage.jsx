import DocPage from "../components/DocPage";
import { BuildingIcon } from "../components/Icons";
import materialDoc from "../data/method1Doc.json";
import wozDoc from "../data/method1WozDoc.json";

// The Estimated WOZ Value document follows the material document; its
// sections are already numbered on from it (see dataset/build_woz_doc.py).
const doc = {
  sections: [...materialDoc.sections, ...wozDoc.sections],
  blocks: [
    ...materialDoc.blocks,
    ...wozDoc.blocks.filter((block) => block.type !== "title"),
  ],
};

export default function Method1DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 1 · Method and results · Resource Paspoort"
      eyebrow="Method 1 · documentation"
      lede="How material mass and CO₂ are calculated from the BAG floor area and the B2 material profile: the classification, the full B2 intensity tables, the emission factors, the worked example and the results for all 1,082 buildings. Followed by how the Estimated WOZ Value is calculated: the process, the assumptions and a worked example."
      backTo="/"
      backLabel="Back to Method 1 search"
      backIcon={BuildingIcon}
    />
  );
}
