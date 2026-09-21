const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Wraps case-insensitive matches of `term` in <mark>
export default function Highlight({ text, term }) {
  const value = text ?? "";

  if (!term || !value) {
    return value;
  }

  const parts = value.split(new RegExp(`(${escapeRegExp(term)})`, "gi"));

  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part
  );
}
