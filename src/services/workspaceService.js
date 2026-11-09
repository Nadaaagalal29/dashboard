export const statuses = ["To Do", "In Progress", "In Review", "Completed"];
export const members = [
  {
    id: "m1",
    name: "Alex Morgan",
    role: "Product Designer",
    initials: "AM",
    color: "#7865dc",
    email: "alex@example.com",
  },
  {
    id: "m2",
    name: "Jamie Chen",
    role: "Frontend Developer",
    initials: "JC",
    color: "#429c95",
    email: "jamie@example.com",
  },
  {
    id: "m3",
    name: "Sam Wilson",
    role: "Product Manager",
    initials: "SW",
    color: "#d38a4e",
    email: "sam@example.com",
  },
  {
    id: "m4",
    name: "Taylor Brooks",
    role: "UX Researcher",
    initials: "TB",
    color: "#c56892",
    email: "taylor@example.com",
  },
];
export function seed() {
  return {
    projects: [
      {
        id: "p1",
        name: "Website redesign",
        description: "A fresh digital experience for our next chapter.",
        status: "In Progress",
        start: "2026-11-01",
        due: "2026-12-15",
        color: "#7762de",
      },
      {
        id: "p2",
        name: "Mobile app launch",
        description: "Bring our workspace to everyone, everywhere.",
        status: "In Progress",
        start: "2026-10-20",
        due: "2026-12-30",
        color: "#419c95",
      },
      {
        id: "p3",
        name: "Brand identity",
        description: "Build a memorable and consistent brand system.",
        status: "Completed",
        start: "2026-10-01",
        due: "2026-11-10",
        color: "#d18b51",
      },
      {
        id: "p4",
        name: "Customer insights",
        description: "Turn customer conversations into better decisions.",
        status: "Planning",
        start: "2026-11-05",
        due: "2026-12-20",
        color: "#c26f9c",
      },
    ],
    tasks: [
      ["Design homepage wireframes", "p1", "m1", "High", "In Progress"],
      ["Build component library", "p1", "m2", "High", "In Review"],
      ["Review navigation flow", "p1", "m4", "Medium", "To Do"],
      ["Set up app architecture", "p2", "m2", "High", "Completed"],
      ["Write launch strategy", "p2", "m3", "Medium", "In Progress"],
      ["Finalize brand guidelines", "p3", "m1", "Medium", "Completed"],
      ["Approve color palette", "p3", "m3", "Low", "Completed"],
      ["Prepare interview questions", "p4", "m4", "Medium", "To Do"],
      ["Implement responsive layouts", "p1", "m2", "High", "To Do"],
      ["Review onboarding screens", "p2", "m1", "Low", "In Review"],
      ["Schedule customer interviews", "p4", "m3", "Low", "To Do"],
      ["Test app navigation", "p2", "m4", "Medium", "In Progress"],
    ].map((t, i) => ({
      id: "t" + i,
      title: t[0],
      projectId: t[1],
      assignee: t[2],
      priority: t[3],
      status: t[4],
      due: `2026-11-${String(12 + i).padStart(2, "0")}`,
      description:
        "Collaborate with the team and share the final deliverable for review.",
      updatedAt: new Date(2026, 10, 5, 10, i).toISOString(),
    })),
    activity: [],
  };
}
const KEY = "orbit-data-v1";
export function validate(data) {
  if (
    !data ||
    !Array.isArray(data.projects) ||
    !Array.isArray(data.tasks) ||
    !Array.isArray(data.activity)
  )
    throw new Error(
      "Saved workspace data is invalid. Clear site data to restore the demo.",
    );
  return data;
}
export function createService(storage) {
  let queue = Promise.resolve();
  return {
    async load() {
      await new Promise((r) => setTimeout(r, 250));
      const raw = storage.getItem(KEY);
      return raw ? validate(JSON.parse(raw)) : seed();
    },
    save(next) {
      const job = queue.then(async () => {
        await new Promise((r) => setTimeout(r, 180));
        validate(next);
        storage.setItem(KEY, JSON.stringify(next));
        return next;
      });
      queue = job.catch(() => {});
      return job;
    },
  };
}
export function removeProject(data, id) {
  return {
    ...data,
    projects: data.projects.filter((p) => p.id !== id),
    tasks: data.tasks.filter((t) => t.projectId !== id),
  };
}
