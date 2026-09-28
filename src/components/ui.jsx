// Shared layout pieces: page header, section, label/value fields and the
// summary row. They only arrange values; every value comes from the API.

export function PageHeader({ kicker, title, description, meta, actions }) {
  return (
    <header className="page-head">
      <div className="page-head__text">
        {kicker && <p className="page-head__kicker">{kicker}</p>}
        <h1 className="page-head__title">{title}</h1>
        {description && <p className="page-head__lede">{description}</p>}
        {meta && <p className="page-head__meta">{meta}</p>}
      </div>
      {actions && <div className="page-head__actions">{actions}</div>}
    </header>
  );
}

// A titled block of the record, with an optional note on the right
export function Section({ title, meta, description, children, className = "" }) {
  return (
    <section className={`section ${className}`.trim()}>
      <header className="section__head">
        <div>
          <h2 className="section__title">{title}</h2>
          {description && <p className="section__description">{description}</p>}
        </div>
        {meta && <span className="section__meta">{meta}</span>}
      </header>
      <div className="section__body">{children}</div>
    </section>
  );
}

// Label/value rows in a grid; `mono` for identifiers and measured values
export function Fields({ items, columns = 2 }) {
  return (
    <dl className={`fields fields--${columns}`}>
      {items.map(({ label, value, mono, note }) => (
        <div className="field" key={label}>
          <dt className="field__label">{label}</dt>
          <dd className={`field__value${mono ? " field__value--mono" : ""}`}>
            {value ?? "—"}
            {note && <span className="field__note">{note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// The few key figures of a record, in one row
export function Summary({ items }) {
  return (
    <dl className="summary">
      {items.map(({ label, value, unit, note }) => (
        <div className="summary__item" key={label}>
          <dt className="summary__label">{label}</dt>
          <dd className="summary__value">
            {value ?? "—"}
            {unit && value !== "—" && <span className="summary__unit">{unit}</span>}
          </dd>
          {note && <dd className="summary__note">{note}</dd>}
        </div>
      ))}
    </dl>
  );
}

// Notes that the documents mark with [IMPORTANT] or [FLAG]
export function Note({ kind = "info", label, children }) {
  return (
    <div className={`note note--${kind}`} role="note">
      {label && <strong className="note__label">{label}</strong>}
      <span>{children}</span>
    </div>
  );
}

// Placeholder while a building record loads
export function RecordSkeleton() {
  return (
    <div className="record-view record-view--loading" aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--panel" />
      <div className="skeleton skeleton--panel" />
    </div>
  );
}
