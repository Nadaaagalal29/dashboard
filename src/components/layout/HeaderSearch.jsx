import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { useApp } from "../../context/WorkspaceContext.jsx";

export function HeaderSearch() {
  const { data } = useApp();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const matches =
    q.trim() && data
      ? [
          ...data.projects
            .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
            .map((p) => ({
              id: p.id,
              label: p.name,
              path: "/projects/" + p.id,
            })),
          ...data.tasks
            .filter((t) => t.title.toLowerCase().includes(q.toLowerCase()))
            .map((t) => ({ id: t.id, label: t.title, path: "/tasks" })),
        ].slice(0, 6)
      : [];
  return (
    <div className="header-search">
      <Search size={17} />
      <input
        aria-label="Search workspace"
        placeholder="Search projects and tasks…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q && (
        <div className="search-results">
          {matches.length ? (
            matches.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  navigate(m.path);
                  setQ("");
                }}
              >
                {m.label}
                <ArrowRight size={14} />
              </button>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}
    </div>
  );
}
