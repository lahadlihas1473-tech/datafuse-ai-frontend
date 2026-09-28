import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowIcon } from "./Icons";
import { Note, PageHeader } from "./ui";

// Anchor id for a numbered heading: "4. Step 1 – …" → "section-4"
const sectionId = (heading) => {
  const number = heading.match(/^(\d+(?:\.\d+)?)/);
  return number ? `section-${number[1].replace(".", "-")}` : null;
};

// Numbers and short codes line up better in the mono face
const isValueCell = (value) =>
  /^[\d.,%+\-–±<>\s]*$/.test(value) || /^[A-Z][A-Z0-9_]{2,}$/.test(value);

// Paragraphs the documents mark as a note: "[IMPORTANT] …", "[FLAG] …"
const NOTE_MARKS = {
  "[IMPORTANT]": { kind: "info", label: "Important" },
  "[FLAG]": { kind: "warn", label: "Flag" },
};

const noteOf = (text = "") => {
  const mark = Object.keys(NOTE_MARKS).find((key) => text.startsWith(`${key} `));
  return mark ? { ...NOTE_MARKS[mark], text: text.slice(mark.length + 1) } : null;
};

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

// Renders a method document (converted from its .docx) in the site style
export default function DocPage({ doc, eyebrow, lede, backTo, backLabel, backIcon: BackIcon, documentTitle }) {
  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  const blocks = groupBlocks(doc.blocks);
  const title = blocks.find((block) => block.type === "title")?.text;

  return (
    <article className="doc">
      <PageHeader
        kicker={eyebrow}
        title={title}
        description={lede}
        actions={
          <Link className="button button--secondary" to={backTo}>
            <BackIcon />
            {backLabel}
          </Link>
        }
      />

      <div className="doc__layout">
        <nav className="doc__toc" aria-label="Contents">
          <span className="doc__toc-title">Contents</span>
          <ol>
            {doc.sections.map((section) => (
              <li key={section}>
                <a href={`#${sectionId(section)}`}>
                  <span className="doc__toc-number">{section.match(/^\d+/)?.[0]}</span>
                  <span>{section.replace(/^\d+\.\s*/, "")}</span>
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

              default: {
                const note = noteOf(block.text);
                return note ? (
                  <Note key={index} kind={note.kind} label={note.label}>
                    {note.text}
                  </Note>
                ) : (
                  <p key={index}>{block.text}</p>
                );
              }
            }
          })}

          <p className="doc__end">
            <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo(0, 0); }}>
              Back to top
              <ArrowIcon />
            </a>
          </p>
        </div>
      </div>
    </article>
  );
}
