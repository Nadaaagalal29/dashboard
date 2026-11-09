import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useApp } from "../../context/WorkspaceContext.jsx";
import { Empty } from "../common/Empty.jsx";
import { Pagination } from "../common/Pagination.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { Badge } from "../common/Badge.jsx";
import { labelDate } from "../../utils/projectUtils.js";

export function TaskTable({ list }) {
  const { data, setModal } = useApp();
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [list.map((t) => t.id).join(",")]);
  return (
    <>
      {list.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task name</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.slice((page - 1) * 6, page * 6).map((t) => (
                <tr key={t.id}>
                  <td>
                    <button
                      className="text-button task-title"
                      onClick={() => setModal({ type: "task", item: t })}
                    >
                      {t.title}
                    </button>
                  </td>
                  <td>
                    {data.projects.find((p) => p.id === t.projectId)?.name}
                  </td>
                  <td>
                    <Avatar id={t.assignee} />
                  </td>
                  <td>
                    <Badge>{t.priority}</Badge>
                  </td>
                  <td>
                    <Badge>{t.status}</Badge>
                  </td>
                  <td>{labelDate(t.due)}</td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={"Edit " + t.title}
                      onClick={() => setModal({ type: "task", item: t })}
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty />
      )}
      <Pagination page={page} setPage={setPage} total={list.length} />
    </>
  );
}
