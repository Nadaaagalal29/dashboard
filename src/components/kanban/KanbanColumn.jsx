import { useDroppable } from "@dnd-kit/core";
import { DraggableTask } from "./DraggableTask.jsx";

export function Column({ status, list }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section
      ref={setNodeRef}
      className={"kanban-column " + (isOver ? "over" : "")}
    >
      <h3>
        <i className={status.toLowerCase().replaceAll(" ", "-")} />
        {status}
        <span>{list.length}</span>
      </h3>
      {list.map((t) => (
        <DraggableTask key={t.id} task={t} />
      ))}
      {!list.length && <div className="drop-hint">Drop a task here</div>}
    </section>
  );
}
