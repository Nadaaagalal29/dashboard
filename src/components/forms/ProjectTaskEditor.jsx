import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
import {
  members,
  statuses,
  removeProject,
} from "../../services/workspaceService.js";
import { useApp } from "../../context/WorkspaceContext.jsx";

export function Editor({ type, item, projectId }) {
  const [image, setImage] = useState(item?.image || "");
  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    try {
      const url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(Error("Unable to read image"));
        reader.readAsDataURL(file);
      });
      setImage(url);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  const { data, commit, busy, setModal } = useApp();
  const project = type === "project";
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const escape = (e) => {
      if (e.key === "Escape" && !busy) setModal(null);
      if (e.key === "Tab") {
        const fields = [
          ...document.querySelectorAll(
            ".modal button:not(:disabled), .modal input, .modal select, .modal textarea",
          ),
        ];
        const first = fields[0],
          last = fields[fields.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", escape);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escape);
      document.body.style.overflow = old;
    };
  }, [busy]);
  async function submit(e) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.target));
    const title = String(values[project ? "name" : "title"] || "").trim();
    if (!title) return setError("A name is required.");
    if (project && values.due < values.start)
      return setError("The due date must be on or after the start date.");
    if (!project && !data.projects.length)
      return setError("Create a project before adding tasks.");
    const record = {
      ...item,
      ...values,
      ...(project ? { image } : {}),
      [project ? "name" : "title"]: title,
      id: item?.id || crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      ...(project ? { color: item?.color || "#7762de" } : {}),
    };
    const key = project ? "projects" : "tasks";
    let next = {
      ...data,
      [key]: item
        ? data[key].map((v) => (v.id === item.id ? record : v))
        : [record, ...data[key]],
    };
    if (
      await commit(
        next,
        `${project ? "Project" : "Task"} ${item ? "updated" : "created"}`,
      )
    )
      setModal(null);
  }
  async function del() {
    if (!confirm(`Delete this ${type}${project ? " and all its tasks" : ""}?`))
      return;
    let next = project
      ? removeProject(data, item.id)
      : { ...data, tasks: data.tasks.filter((t) => t.id !== item.id) };
    if (await commit(next, `${project ? "Project" : "Task"} deleted`)) {
      setModal(null);
      if (project) navigate("/projects");
    }
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) setModal(null);
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MAKE ROOM FOR PROGRESS</span>
            <h2 id="dialog-title">
              {item ? "Edit" : "Create"} {type}
            </h2>
          </div>
          <button
            disabled={busy}
            className="icon-button"
            aria-label="Close dialog"
            onClick={() => setModal(null)}
          >
            <X />
          </button>
        </div>
        <form onSubmit={submit}>
          {project && (
            <div className="upload-field">
              <label>
                Project image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadImage}
                />
                <span>Upload image · JPG, PNG or WebP · Up to 2 MB</span>
              </label>
              {image && (
                <div className="upload-preview">
                  <img src={image} alt="Project image preview" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setImage("")}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
          <label>
            {project ? "Project name" : "Task title"}
            <input
              autoFocus
              name={project ? "name" : "title"}
              defaultValue={item?.[project ? "name" : "title"] || ""}
              required
              maxLength={100}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              defaultValue={item?.description || ""}
              rows={3}
              maxLength={1000}
            />
          </label>
          {!project && (
            <label>
              Project
              <select
                aria-label="Project"
                name="projectId"
                defaultValue={
                  item?.projectId || projectId || data.projects[0]?.id
                }
                required
              >
                <option value="" disabled>
                  Select a project
                </option>
                {data.projects.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="form-grid">
            <label>
              Status
              <select
                aria-label="Status"
                name="status"
                defaultValue={item?.status || (project ? "Planning" : "To Do")}
              >
                {(project
                  ? ["Planning", "In Progress", "Completed"]
                  : statuses
                ).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {project ? (
              <label>
                Start date
                <input
                  type="date"
                  name="start"
                  defaultValue={
                    item?.start || new Date().toISOString().slice(0, 10)
                  }
                  required
                />
              </label>
            ) : (
              <label>
                Priority
                <select
                  aria-label="Priority"
                  name="priority"
                  defaultValue={item?.priority || "Medium"}
                >
                  {["Low", "Medium", "High"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            )}
            {!project && (
              <label>
                Assignee
                <select
                  aria-label="Assignee"
                  name="assignee"
                  defaultValue={item?.assignee || members[0].id}
                  required
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Due date
              <input
                type="date"
                name="due"
                defaultValue={item?.due || ""}
                required
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <div className="modal-actions">
            {item && (
              <button
                type="button"
                className="danger"
                disabled={busy}
                onClick={del}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button className="primary" disabled={busy}>
              {busy ? "Saving…" : "Save " + type}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
