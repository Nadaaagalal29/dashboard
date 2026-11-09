import { Routes, Route, Navigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useApp } from "./context/WorkspaceContext.jsx";
import { Shell } from "./components/layout/Shell.jsx";
import { Editor } from "./components/forms/ProjectTaskEditor.jsx";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Projects } from "./pages/Projects.jsx";
import { ProjectDetail } from "./pages/ProjectDetail.jsx";
import { Tasks } from "./pages/Tasks.jsx";
import { Board } from "./pages/Board.jsx";
import { Team } from "./pages/Team.jsx";

function ProtectedWorkspace() {
  const { user, data, error, load } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Shell>
      {error ? (
        <div className="empty" role="alert">
          {error}
          <button onClick={load}>Retry</button>
        </div>
      ) : !data ? (
        <div className="empty">Loading your workspace…</div>
      ) : (
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="board" element={<Board />} />
          <Route path="team" element={<Team />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Shell>
  );
}

export default function App() {
  const { user, modal, toast } = useApp();
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/*" element={<ProtectedWorkspace />} />
      </Routes>
      {modal && <Editor key={modal.item?.id || modal.type} {...modal} />}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
    </>
  );
}
