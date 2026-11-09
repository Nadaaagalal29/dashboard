import { useTaskFilters } from "../hooks/useTaskFilters.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { TaskTable } from "../components/tasks/TaskTable.jsx";

export function Tasks() {
  const f = useTaskFilters();
  return (
    <>
      <Heading
        title="Tasks"
        description="A clear next step for every great idea."
        action="Create task"
      />
      {f.controls}
      <TaskTable list={f.list} />
    </>
  );
}
