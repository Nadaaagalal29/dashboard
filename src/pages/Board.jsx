import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { statuses } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { useTaskFilters } from "../hooks/useTaskFilters.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { Column } from "../components/kanban/KanbanColumn.jsx";

export function Board() {
  const { data, commit, busy } = useApp();
  const f = useTaskFilters();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );
  return (
    <>
      <Heading
        title="Kanban Board"
        description="See the flow. Find your focus. Move work forward."
        action="Create task"
      />
      {f.controls}
      <p className="board-help">
        Drag the task handle to another column, or open a card to change its
        status.
      </p>
      <DndContext
        sensors={sensors}
        onDragEnd={({ active, over }) => {
          if (!busy && over && statuses.includes(over.id)) {
            let t = data.tasks.find((t) => t.id === active.id);
            if (t.status !== over.id)
              commit(
                {
                  ...data,
                  tasks: data.tasks.map((x) =>
                    x.id === t.id
                      ? {
                          ...x,
                          status: over.id,
                          updatedAt: new Date().toISOString(),
                        }
                      : x,
                  ),
                },
                `Moved “${t.title}” to ${over.id}`,
              );
          }
        }}
      >
        <div className="kanban">
          {statuses.map((s) => (
            <Column
              key={s}
              status={s}
              list={f.list.filter((t) => t.status === s)}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
}
