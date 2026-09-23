import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowIcon, RulerIcon } from "../components/Icons";
import doc from "../data/method2Doc.json";

// Anchor id for a numbered heading: "4. Step 1 – …" → "section-4"
const sectionId = (heading) => {
  const number = heading.match(/^(\d+(?:\.\d+)?)/);
  return number ? `section-${number[1].replace(".", "-")}` : null;
};

// Numbers and short codes line up better in the mono face
const isValueCell = (value) =>
  /^[\d.,%+\-–±<>\s]*$/.test(value) || /^[A-Z][A-Z0-9_]{2,}$/.test(value);

function Table({ head, rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table doc__table">
        <thead>
          <tr>
            {head.map((cell, index) => (
              <th scope="col" key={index}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <th scope="row" key={cellIndex}>
                    {cell}
                  </th>
                ) : (
                  <td
                    key={cellIndex}
                    className={isValueCell(cell) ? "num" : undefined}
                  >
                    {cell || "—"}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Consecutive list items render as one list
const groupBlocks = (blocks) => {
  const grouped = [];

  blocks.forEach((block) => {
    const previous = grouped[grouped.length - 1];

    if (block.type === "li" && previous?.type === "list") {
      previous.items.push(block.text);
      return;
    }

    grouped.push(
      block.type === "li" ? { type: "list", items: [block.text] } : block
    );
  });

  return grouped;
};

export default function Method2DocsPage() {
  useEffect(() => {
    document.title = "Method 2 · Method and results · Resource Paspoort";
  }, []);

  const blocks = groupBlocks(doc.blocks);
  const title = blocks.find((block) => block.type === "title")?.text;

  return (
    <article className="doc">
      <header className="page-head">
        <span className="eyebrow">Method 2 · documentation</span>
        <h1 className="page-head__title">{title}</h1>
        <p className="page-head__lede">
          How material mass and CO₂ are calculated for every building, from the
          3DBAG and BAG measurements to the assumptions, the worked example and
          the results. This is the full text of {doc.source}.
        </p>

        <Link className="button button--ghost doc__back" to="/method-2">
          <RulerIcon />
          Back to Method 2 search
        </Link>
      </header>

      <nav className="doc__toc" aria-label="Sections">
        <span className="doc__toc-title">Contents</span>
        <ol>
          {doc.sections.map((section) => (
            <li key={section}>
              <a href={`#${sectionId(section)}`}>
                {section.replace(/^\d+\.\s*/, "")}
                <ArrowIcon />
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="doc__body">
        {blocks.map((block, index) => {
          switch (block.type) {
            case "title":
              return null;

            case "h2":
              return (
                <h2 key={index} id={sectionId(block.text) ?? undefined}>
                  {block.text}
                </h2>
              );

            case "h3":
              return (
                <h3 key={index} id={sectionId(block.text) ?? undefined}>
                  {block.text}
                </h3>
              );

            case "list":
              return (
                <ul key={index} className="doc__list">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              );

            case "table":
              return <Table key={index} head={block.head} rows={block.rows} />;

            default:
              return <p key={index}>{block.text}</p>;
          }
        })}
      </div>
    </article>
  );
}
