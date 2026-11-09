import { useTaskFilters } from "../../hooks/useTaskFilters.jsx";
import { TaskTable } from "../tasks/TaskTable.jsx";

export function TeamTasks({ member }) {
  const f = useTaskFilters(undefined, member);
  return (
    <>
      {f.controls}
      <TaskTable list={f.list} />
    </>
  );
}
