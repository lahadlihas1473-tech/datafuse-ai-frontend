import { useId, useRef } from "react";
import { useSlashFocus } from "../hooks/useSlashFocus";
import { CloseIcon, SearchIcon } from "./Icons";

// Address search used by the Passport, Method 1 and Method 2 pages.
// Submits the typed address as it is; the pages decide what to request.
export default function SearchPanel({
  address,
  onAddressChange,
  onSearch,
  loading,
  error,
  recentSearches = [],
  onRemoveRecent,
  label = "Building address",
  hint = "Street and house number, optionally with postal code or city — e.g. Jan Provostlaan 16, Bilthoven",
}) {
  const inputRef = useRef(null);
  const inputId = useId();
  const hintId = useId();

  useSlashFocus(inputRef);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(address);
  };

  const handleClear = () => {
    onAddressChange("");
    inputRef.current?.focus();
  };

  return (
    <section className="search-panel" aria-label="Search">
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <label className="search-form__label" htmlFor={inputId}>
          {label}
        </label>

        <div className="search-form__row">
          <div className={`search${loading ? " search--loading" : ""}`}>
            <SearchIcon className="icon search__icon" />

            <input
              id={inputId}
              ref={inputRef}
              className="search__input"
              type="text"
              placeholder="Enter a building address"
              aria-describedby={hintId}
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
                <kbd className="search__kbd" title="Press / to focus the search">
                  /
                </kbd>
              )
            )}
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Searching
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>

        <p className="search-form__hint" id={hintId}>
          {hint}
        </p>
      </form>

      {recentSearches.length > 0 && (
        <div className="recent">
          <span className="recent__title">Recent searches</span>

          <ul className="recent__list">
            {recentSearches.map((searchedAddress) => (
              <li className="recent__item" key={searchedAddress}>
                <button
                  type="button"
                  className="recent__link"
                  onClick={() => {
                    onAddressChange(searchedAddress);
                    onSearch(searchedAddress);
                  }}
                >
                  {searchedAddress}
                </button>
                <button
                  type="button"
                  className="recent__remove"
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
          <strong className="alert__label">No result</strong>
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}
