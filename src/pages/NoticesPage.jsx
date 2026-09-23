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

// Notice ID, Title and Publication date. One building (Jan Provostlaan 16)
// has no notice, so it is listed by its pand ID instead.
function NoticeRow({ notice, search }) {
  const hasNotice = Boolean(notice.notice_id);

  return (
    <>
      <span className="record__icon" aria-hidden="true">
        <NoticeIcon />
      </span>

      <div className="record__main">
        <span className="record__id">
          <span className="visually-hidden">
            {hasNotice ? "Notice ID: " : "Pand ID: "}
          </span>
          <Highlight
            text={hasNotice ? notice.notice_id : notice.pand_id}
            term={search}
          />
          {!hasNotice && <span className="tag">No notice</span>}
        </span>
        <p className="record__title">
          <Highlight text={notice.title} term={search} />
        </p>
      </div>

      <div className="record__date">
        <span className="record__label">Published</span>
        {notice.publication_date ? (
          <time dateTime={notice.publication_date}>
            {formatDate(notice.publication_date)}
          </time>
        ) : (
          "—"
        )}
      </div>
    </>
  );
}

export default function NoticesPage() {
  return (
    <ListPage
      eyebrow="Demolition notices"
      title="Notices"
      description="Every building with an estimate, newest notice first. Search a city to see its buildings first, followed by other matches."
      endpoint="/notices"
      noun={{ singular: "notice", plural: "notices" }}
      searchLabel="Search notices"
      searchPlaceholder="Search by city, title, notice ID or pand ID…"
      getKey={(notice) => notice.notice_id ?? notice.pand_id}
      renderItem={(notice, search) => (
        <NoticeRow notice={notice} search={search} />
      )}
      skeletonRow={
        <>
          <span className="skeleton skeleton--icon" />
          <div className="record__main">
            <span className="skeleton skeleton--label" />
            <span className="skeleton skeleton--text" />
          </div>
          <span className="skeleton skeleton--date" />
        </>
      }
    />
  );
}
