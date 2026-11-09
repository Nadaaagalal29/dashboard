import { useState } from "react";
import { Search } from "lucide-react";
import { statuses } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { SearchBox } from "../components/common/SearchBox.jsx";
import { ProjectCard } from "../components/projects/ProjectCard.jsx";
import { Pagination } from "../components/common/Pagination.jsx";
import { Empty } from "../components/common/Empty.jsx";

export function Projects() {
  const { data } = useApp();
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState(""),
    [page, setPage] = useState(1);
  let list = data.projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) &&
      (!filter || p.status === filter),
  );
  return (
    <>
      <Heading
        title="Projects"
        description="Big ideas, broken down into meaningful progress."
        action="Create project"
        type="project"
      />
      <div className="toolbar">
        <SearchBox
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Search projects…"
        />
        <select
          aria-label="Project status"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {["Planning", "In Progress", "Completed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span>{list.length} projects</span>
      </div>
      <div className="project-grid">
        {list.slice((page - 1) * 6, page * 6).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      {!list.length && <Empty />}
      <Pagination page={page} setPage={setPage} total={list.length} />
    </>
  );
}
