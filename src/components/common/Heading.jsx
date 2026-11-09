import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useApp } from "../../context/WorkspaceContext.jsx";

export function Heading({
  eyebrow = "YOUR WORKSPACE, AT A GLANCE",
  title,
  description,
  action,
  type = "task",
}) {
  const { setModal } = useApp();
  const { id: projectId } = useParams();
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && (
        <button
          className="primary"
          onClick={() => setModal({ type, projectId })}
        >
          <Plus size={18} />
          {action}
        </button>
      )}
    </div>
  );
}
