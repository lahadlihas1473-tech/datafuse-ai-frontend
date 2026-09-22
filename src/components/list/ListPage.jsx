import { Fragment, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { usePagedList } from "../../hooks/usePagedList";
import ListSearch from "./ListSearch";
import Pagination from "./Pagination";

const PAGE_SIZE = 25;

// Label rows where city matches end and other matches begin
function SectionLabel({ children, count }) {
  return (
    <li className="records__section" role="presentation">
      <span>{children}</span>
      <span className="records__section-count">{count.toLocaleString()}</span>
    </li>
  );
}

// Shared layout for the searchable, paginated Notices and Addresses pages
export default function ListPage({
  eyebrow,
  title,
  description,
  endpoint,
  noun,
  searchLabel,
  searchPlaceholder,
  renderItem,
  getKey,
  skeletonRow,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1);
  const listTop = useRef(null);

  const { data, loading, error, retry } = usePagedList(endpoint, {
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    document.title = `${title} · Resource Paspoort`;
  }, [title]);

  const updateParams = useCallback(
    (changes) =>
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          Object.entries(changes).forEach(([key, value]) => {
            if (value) {
              next.set(key, value);
            } else {
              next.delete(key);
            }
          });

          return next;
        },
        { replace: "search" in changes }
      ),
    [setSearchParams]
  );

  const handleSearch = useCallback(
    (value) => updateParams({ search: value, page: null }),
    [updateParams]
  );

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null });
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const cityMatches = data?.city_matches ?? 0;
  const offset = data?.offset ?? 0;
  const showSections = Boolean(data?.search) && cityMatches > 0;

  return (
    <section className="list-page">
      <header className="page-head">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-head__title">{title}</h1>
        <p className="page-head__lede">{description}</p>
      </header>

      <div className="list-toolbar" ref={listTop}>
        <ListSearch
          value={search}
          onChange={handleSearch}
          loading={loading}
          label={searchLabel}
          placeholder={searchPlaceholder}
        />

        <p className="list-toolbar__summary" aria-live="polite">
          {data
            ? search
              ? `${total.toLocaleString()} ${noun.plural} matching “${search}”`
              : `${total.toLocaleString()} ${noun.plural}`
            : "Loading…"}
        </p>
      </div>

      {error && (
        <div className="alert alert--block" role="alert">
          <span className="alert__mark" aria-hidden="true">
            !
          </span>
          <span>{error}</span>
          <button type="button" className="text-button" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {!data && loading && (
        <ul className="records" aria-busy="true">
          {Array.from({ length: 8 }, (_, index) => (
            <li className="record record--skeleton" key={index}>
              {skeletonRow}
            </li>
          ))}
        </ul>
      )}

      {data && items.length === 0 && !error && (
        <div className="empty">
          {total > 0 ? (
            <>
              <p className="empty__title">This page is empty</p>
              <p>There are only {total.toLocaleString()} {noun.plural}.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => handlePageChange(1)}
              >
                Go to first page
              </button>
            </>
          ) : (
            <>
              <p className="empty__title">No {noun.plural} found</p>
              <p>
                {search
                  ? `Nothing matches “${search}”. Try a city, street or postal code.`
                  : `There are no ${noun.plural} yet.`}
              </p>
              {search && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => handleSearch("")}
                >
                  Clear search
                </button>
              )}
            </>
          )}
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className={`records${loading ? " records--stale" : ""}`}>
            {items.map((item, index) => {
              const position = offset + index;

              return (
                <Fragment key={getKey(item)}>
                  {showSections && position === 0 && (
                    <SectionLabel count={cityMatches}>
                      In “{data.search}”
                    </SectionLabel>
                  )}
                  {showSections && position === cityMatches && (
                    <SectionLabel count={total - cityMatches}>
                      Other matches
                    </SectionLabel>
                  )}
                  <li className="record">{renderItem(item, search)}</li>
                </Fragment>
              );
            })}
          </ul>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
