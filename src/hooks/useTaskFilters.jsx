import { useState } from "react";
import { Search } from "lucide-react";
import { members, statuses } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { SearchBox } from "../components/common/SearchBox.jsx";

export function useTaskFilters(projectId, initialAssignee = "") {
  const { data } = useApp();
  const [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [priority, setPriority] = useState(""),
    [assignee, setAssignee] = useState(initialAssignee);
  let list = data.tasks.filter(
    (t) =>
      (!projectId || t.projectId === projectId) &&
      t.title.toLowerCase().includes(q.toLowerCase()) &&
      (!status || t.status === status) &&
      (!priority || t.priority === priority) &&
      (!assignee || t.assignee === assignee),
  );
  return {
    list,
    controls: (
      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} placeholder="Search tasks…" />
        {[
          ["Status", status, setStatus, statuses],
          ["Priority", priority, setPriority, ["Low", "Medium", "High"]],
          [
            "Assignee",
            assignee,
            setAssignee,
            members.map((m) => ({ value: m.id, label: m.name })),
          ],
        ].map(([label, value, set, options]) => (
          <select
            key={label}
            aria-label={label}
            value={value}
            onChange={(e) => set(e.target.value)}
          >
            <option value="">All {label.toLowerCase()}s</option>
            {options.map((o) => (
              <option key={o.value || o} value={o.value || o}>
                {o.label || o}
              </option>
            ))}
          </select>
        ))}
      </div>
    ),
  };
}
