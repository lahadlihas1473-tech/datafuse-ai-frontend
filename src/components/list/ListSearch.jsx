import { useEffect, useRef, useState } from "react";
import { useSlashFocus } from "../../hooks/useSlashFocus";
import { CloseIcon, SearchIcon } from "../Icons";

const DEBOUNCE_MS = 300;

// Search box that writes to the URL (?search=) after a short pause, so
// results are shareable and the back button restores previous searches.
export default function ListSearch({
  value,
  onChange,
  loading,
  placeholder,
  label,
}) {
  const inputRef = useRef(null);
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  useSlashFocus(inputRef);

  // Follow outside changes (back/forward, clear) without an effect
  if (value !== syncedValue) {
    setSyncedValue(value);

    if (draft.trim() !== value) {
      setDraft(value);
    }
  }

  useEffect(() => {
    const next = draft.trim();

    if (next === value) {
      return undefined;
    }

    const timer = setTimeout(() => onChange(next), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange(draft.trim());
  };

  const handleClear = () => {
    setDraft("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <form
      className={`search search--list${loading ? " search--loading" : ""}`}
      role="search"
      onSubmit={handleSubmit}
    >
      <SearchIcon className="icon search__icon" />

      <input
        ref={inputRef}
        className="search__input"
        type="search"
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        spellCheck="false"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />

      {draft ? (
        <button
          type="button"
          className="search__clear"
          aria-label="Clear search"
          onClick={handleClear}
        >
          <CloseIcon />
        </button>
      ) : (
        <kbd className="search__kbd" aria-hidden="true">
          /
        </kbd>
      )}

      <span className="search__progress" aria-hidden="true" />
    </form>
  );
}
