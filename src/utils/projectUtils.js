export const labelDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export function progress(data, id) {
  let tasks = data.tasks.filter((t) => t.projectId === id);
  return tasks.length
    ? Math.round(
        (tasks.filter((t) => t.status === "Completed").length / tasks.length) *
          100,
      )
    : 0;
}
