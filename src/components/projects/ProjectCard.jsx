import { useNavigate } from "react-router-dom";
import { FolderKanban, ArrowUpRight, Pencil, CalendarDays } from "lucide-react";
import { useApp } from "../../context/WorkspaceContext.jsx";
import { progress } from "../../utils/projectUtils.js";
import { labelDate } from "../../utils/projectUtils.js";
import { Badge } from "../common/Badge.jsx";
import { Avatar } from "../common/Avatar.jsx";

export function ProjectCard({ project: p }) {
  const { data, setModal } = useApp();
  const navigate = useNavigate();
  let value = progress(data, p.id),
    tasks = data.tasks.filter((t) => t.projectId === p.id);
  return (
    <article className="project-card">
      <img
        className="project-cover"
        src={p.image || "./images/city.jpg"}
        alt={p.name + " cover"}
      />
      <div className="card-top">
        <span
          className="project-icon"
          style={{ background: p.color + "18", color: p.color }}
        >
          <FolderKanban size={21} />
        </span>
        <Badge>{p.status}</Badge>
      </div>
      <h3>
        <button
          className="text-button"
          onClick={() => navigate("/projects/" + p.id)}
        >
          {p.name}
          <ArrowUpRight size={16} />
        </button>
      </h3>
      <p>{p.description}</p>
      <div className="progress-label">
        <span>Progress</span>
        <b>{value}%</b>
      </div>
      <div className="progress">
        <i style={{ width: value + "%", background: p.color }} />
      </div>
      <div className="card-bottom">
        <div className="avatar-stack">
          {[...new Set(tasks.map((t) => t.assignee))].slice(0, 3).map((id) => (
            <Avatar key={id} id={id} />
          ))}
        </div>
        <small>
          <CalendarDays size={13} />
          {labelDate(p.due)}
        </small>
        <button
          aria-label={"Edit " + p.name}
          className="icon-button"
          onClick={() => setModal({ type: "project", item: p })}
        >
          <Pencil size={14} />
        </button>
      </div>
    </article>
  );
}
