import { NoticeIcon } from "../components/Icons";
import Highlight from "../components/list/Highlight";
import ListPage from "../components/list/ListPage";

// "2025-07-01" → "1 Jul 2025"; dates are calendar days, so format in UTC
const formatDate = (value) => {
  const date = new Date(`${value}T00:00:00Z`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
};

// Period the demolition notices were extracted for (START_DATE / END_DATE
// of the extraction pipeline)
const EXTRACTION_START = "2025-07-01";
const EXTRACTION_END = "2026-07-20";

// "2025-07-01" → "01 Jul 2025"
const formatPeriodDate = (value) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

function ExtractionPeriod() {
  return (
    <>
      <NoticeIcon />
      <span className="page-head__meta-label">Notice extraction period</span>
      <span className="page-head__meta-value">
        <time dateTime={EXTRACTION_START}>
          {formatPeriodDate(EXTRACTION_START)}
        </time>
        {" — "}
        <time dateTime={EXTRACTION_END}>{formatPeriodDate(EXTRACTION_END)}</time>
      </span>
    </>
  );
}

// Notice ID, Title, Pand ID and Publication date. One building (Jan
// Provostlaan 16) has no notice; its row shows the pand ID only.
function NoticeRow({ notice, search }) {
  const hasNotice = Boolean(notice.notice_id);

  return (
    <>
      <div className="cell cell--id">
        <span className="cell__label">Notice ID</span>
        <span className="cell__value mono">
          {hasNotice ? (
            <Highlight text={notice.notice_id} term={search} />
          ) : (
            <span className="tag">No notice</span>
          )}
        </span>
      </div>

      <div className="cell cell--title">
        <span className="cell__label">Title</span>
        <span className="cell__value">
          <Highlight text={notice.title} term={search} />
        </span>
      </div>

      <div className="cell cell--pand">
        <span className="cell__label">Pand ID</span>
        <span className="cell__value mono">
          <Highlight text={notice.pand_id} term={search} />
        </span>
      </div>

      <div className="cell cell--date">
        <span className="cell__label">Published</span>
        <span className="cell__value">
          {notice.publication_date ? (
            <time dateTime={notice.publication_date}>
              {formatDate(notice.publication_date)}
            </time>
          ) : (
            "—"
          )}
        </span>
      </div>
    </>
  );
}

export default function NoticesPage() {
  return (
    <ListPage
      title="Notices"
      meta={<ExtractionPeriod />}
      description="Demolition notices (sloopmeldingen) of every building with an estimate, newest first. Search a city to see its buildings first, followed by other matches."
      endpoint="/notices"
      noun={{ singular: "notice", plural: "notices" }}
      searchLabel="Search notices"
      searchPlaceholder="Search by city, title, notice ID or pand ID…"
      getKey={(notice) => notice.notice_id ?? notice.pand_id}
      variant="notices"
      columns={[
        { label: "Notice ID", className: "cell--id" },
        { label: "Title", className: "cell--title" },
        { label: "Pand ID", className: "cell--pand" },
        { label: "Published", className: "cell--date" },
      ]}
      renderItem={(notice, search) => (
        <NoticeRow notice={notice} search={search} />
      )}
      skeletonRow={<span className="skeleton skeleton--text" />}
    />
  );
}
