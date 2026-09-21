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

// Only Notice ID, Title and Publication date are shown
function NoticeRow({ notice, search }) {
  return (
    <>
      <span className="record__icon" aria-hidden="true">
        <NoticeIcon />
      </span>

      <div className="record__main">
        <span className="record__id">
          <span className="visually-hidden">Notice ID: </span>
          <Highlight text={notice.notice_id} term={search} />
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
      description="Every published demolition notice, newest first. Search a city to see its notices first, followed by other matches."
      endpoint="/notices"
      noun={{ singular: "notice", plural: "notices" }}
      searchLabel="Search notices"
      searchPlaceholder="Search by city, title or notice ID…"
      getKey={(notice) => notice.notice_id}
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
