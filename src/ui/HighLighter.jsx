function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlighter({ text = "", query = "" }) {
  if (!query?.trim()) return <span>{text}</span>;

  const safeQuery = escapeRegExp(query.trim());
  const parts = text.split(new RegExp(`(${safeQuery})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-200 px-0.5 text-slate-900 dark:bg-indigo-500/40 dark:text-white"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

export default Highlighter;
