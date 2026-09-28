import DocPage from "../components/DocPage";
import { RulerIcon } from "../components/Icons";
import materialDoc from "../data/method2Doc.json";
import wozDoc from "../data/method2WozDoc.json";

// The Estimated WOZ Value (Method 2) sections follow the material document;
// they are already numbered on from it (see dataset/build_woz_method2_doc.py).
const doc = {
  sections: [...materialDoc.sections, ...wozDoc.sections],
  blocks: [...materialDoc.blocks, ...wozDoc.blocks],
};

export default function Method2DocsPage() {
  return (
    <DocPage
      doc={doc}
      documentTitle="Method 2 · Method and results · Resource Paspoort"
      eyebrow="Method 2 · documentation"
      lede="How material mass and CO₂ are calculated for every building from the 3DBAG geometry: the measured surfaces, the construction build-up per building part, the assumptions, the worked example and the results. Followed by how the Estimated WOZ Value (Method 2) is calculated: the process, the assumptions and a worked example."
      backTo="/method-2"
      backLabel="Back to Method 2 search"
      backIcon={RulerIcon}
    />
  );
}
