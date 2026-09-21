import { useEffect, useRef } from "react";
import {
  ArrowIcon,
  ClockIcon,
  CloseIcon,
  SearchIcon,
} from "./Icons";

export default function SearchPanel({
  address,
  onAddressChange,
  onSearch,
  loading,
  error,
  recentSearches,
  onRemoveRecent,
  compact,
}) {
  const inputRef = useRef(null);

  // "/" focuses the search field from anywhere on the page
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(address);
  };

  const handleClear = () => {
    onAddressChange("");
    inputRef.current?.focus();
  };

  return (
    <section className={`hero${compact ? " hero--compact" : ""}`}>
      <span className="eyebrow">Circular building intelligence</span>

      <h1 className="hero__title">
        Every building, <em>weighed</em> and accounted for.
      </h1>

      <p className="hero__lede">
        Search by address to view material estimation and CO₂
        emissions.
      </p>

      <form
        className={`search${loading ? " search--loading" : ""}`}
        role="search"
        onSubmit={handleSubmit}
      >
        <SearchIcon className="icon search__icon" />

        <input
          ref={inputRef}
          className="search__input"
          type="text"
          placeholder="Enter building address…"
          aria-label="Building address"
          autoComplete="off"
          spellCheck="false"
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
        />

        {address && !loading ? (
          <button
            type="button"
            className="search__clear"
            aria-label="Clear address"
            onClick={handleClear}
          >
            <CloseIcon />
          </button>
        ) : (
          !address && (
            <kbd className="search__kbd" aria-hidden="true">
              /
            </kbd>
          )
        )}

        <button
          type="submit"
          className="search__submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Searching
            </>
          ) : (
            <>
              Search
              <ArrowIcon />
            </>
          )}
        </button>

        <span className="search__progress" aria-hidden="true" />
      </form>

      {recentSearches.length > 0 && (
        <div className="recent">
          <span className="recent__title">Recent</span>

          <ul className="recent__list">
            {recentSearches.map((searchedAddress) => (
              <li className="chip" key={searchedAddress}>
                <button
                  type="button"
                  className="chip__main"
                  title={searchedAddress}
                  onClick={() => {
                    onAddressChange(searchedAddress);
                    onSearch(searchedAddress);
                  }}
                >
                  <ClockIcon />
                  <span className="chip__text">{searchedAddress}</span>
                </button>

                <button
                  type="button"
                  className="chip__remove"
                  aria-label={`Remove ${searchedAddress} from recent searches`}
                  onClick={() => onRemoveRecent(searchedAddress)}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="alert" role="alert">
          <span className="alert__mark" aria-hidden="true">
            !
          </span>
          {error}
        </div>
      )}
    </section>
  );
}
