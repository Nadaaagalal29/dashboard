import { CalendarDays } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useApp } from "../../context/WorkspaceContext.jsx";
import { Badge } from "../common/Badge.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { labelDate } from "../../utils/projectUtils.js";

export function DraggableTask({ task: t }) {
  const { setModal } = useApp();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: t.id });
  return (
    <article
      ref={setNodeRef}
      className="kanban-card"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px,${transform.y}px,0)`
          : undefined,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0,
      }}
    >
      <button
        className="drag-handle"
        aria-label={"Move " + t.title}
        {...listeners}
        {...attributes}
      >
        ⠿ Drag task
      </button>
      <Badge>{t.priority}</Badge>
      <button
        className="text-button"
        onClick={() => setModal({ type: "task", item: t })}
      >
        {t.title}
      </button>
      <div>
        <small>
          <CalendarDays size={13} />
          {labelDate(t.due)}
        </small>
        <Avatar id={t.assignee} />
      </div>
    </article>
  );
}
