import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import { removeProject } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { useTaskFilters } from "../hooks/useTaskFilters.jsx";
import { Empty } from "../components/common/Empty.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { progress } from "../utils/projectUtils.js";
import { labelDate } from "../utils/projectUtils.js";
import { TaskTable } from "../components/tasks/TaskTable.jsx";

export function ProjectDetail() {
  const { id } = useParams();
  const { data, setModal, commit, busy } = useApp();
  const navigate = useNavigate();
  const p = data.projects.find((x) => x.id === id);
  const f = useTaskFilters(id);
  if (!p) return <Empty />;
  return (
    <>
      <NavLink className="back" to="/projects">
        ← All projects
      </NavLink>
      <div className="detail-hero">
        <img src={p.image || "./images/city.jpg"} alt={p.name + " cover"} />
        <Heading title={p.name} description={p.description} action="Add task" />
      </div>
      <div className="detail-summary">
        <Badge>{p.status}</Badge>
        <span>
          {labelDate(p.start)} — {labelDate(p.due)}
        </span>
        <strong>{progress(data, id)}% complete</strong>
        <button onClick={() => setModal({ type: "project", item: p })}>
          <Pencil size={15} />
          Edit project
        </button>
        <button
          className="danger"
          disabled={busy}
          onClick={async () => {
            if (confirm("Delete this project and all its tasks?"))
              if (await commit(removeProject(data, id), "Project deleted"))
                navigate("/projects");
          }}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
      {f.controls}
      <TaskTable list={f.list} />
    </>
  );
}
