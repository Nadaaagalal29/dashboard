import { members } from "../../services/workspaceService.js";

export function Avatar({ id }) {
  let m = members.find((x) => x.id === id);
  return m ? (
    <span title={m.name} className="avatar" style={{ background: m.color }}>
      {m.initials}
    </span>
  ) : null;
}
