import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { members } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { Avatar } from "../components/common/Avatar.jsx";
import { TeamTasks } from "../components/team/TeamTasks.jsx";

export function Team() {
  const { data } = useApp();
  const [selected, setSelected] = useState("");
  return (
    <>
      <Heading
        title="Team Members"
        eyebrow="BETTER, TOGETHER"
        description="A small team, doing meaningful things."
      />
      <div className="team-grid">
        {members.map((m) => {
          let tasks = data.tasks.filter((t) => t.assignee === m.id);
          return (
            <article className="member-card" key={m.id}>
              <Avatar id={m.id} />
              <h3>{m.name}</h3>
              <p>{m.role}</p>
              <a href={"mailto:" + m.email}>{m.email}</a>
              <div>
                <b>{tasks.length}</b> tasks assigned{" "}
                <span>
                  {tasks.filter((t) => t.status === "Completed").length}{" "}
                  completed
                </span>
              </div>
              <button
                onClick={() => {
                  setSelected(m.id);
                  document
                    .getElementById("team-tasks")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                View assigned tasks <ArrowRight size={15} />
              </button>
            </article>
          );
        })}
      </div>
      <section id="team-tasks">
        <h2>Assigned tasks</h2>
        <TeamTasks key={selected} member={selected} />
      </section>
    </>
  );
}
