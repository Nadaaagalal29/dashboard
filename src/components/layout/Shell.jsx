import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Columns3,
  Users,
  LogOut,
  Car,
  Bell,
} from "lucide-react";
import { useApp } from "../../context/WorkspaceContext.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { HeaderSearch } from "./HeaderSearch.jsx";

const nav = [
  ["/", "Dashboard", LayoutDashboard],
  ["/projects", "Projects", FolderKanban],
  ["/tasks", "Tasks", ListTodo],
  ["/board", "Kanban Board", Columns3],
  ["/team", "Team", Users],
];
export function Shell({ children }) {
  const { user, setUser } = useApp();
  return (
    <div className="app">
      <aside>
        <div className="brand">
          <Car /> CarLink
        </div>
        <div className="workspace">
          <span className="workspace-icon">S</span>
          <div>
            Studio workspace<small>Pro workspace</small>
          </div>
          <span className="online" />
        </div>
        <span className="nav-label">WORKSPACE</span>
        <nav>
          {nav.map(([path, name, Icon]) => (
            <NavLink key={path} to={path} end={path === "/"}>
              <Icon size={19} />
              {name}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="tip">
            <span>✦ A little more organized.</span>
            <p>Make room for your best work.</p>
            <div className="mini-line" />
          </div>
          <button
            className="logout"
            onClick={() => {
              sessionStorage.removeItem("orbit-user");
              setUser(null);
            }}
          >
            <LogOut size={17} />
            Sign out
          </button>
          <div className="profile">
            <Avatar id="m1" />
            <div>
              {user.name}
              <small>Workspace member</small>
            </div>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <HeaderSearch />
          <span className="header-right">
            <Bell size={19} />
            <Avatar id="m1" />
          </span>
        </header>
        <div className="content">{children}</div>
        <footer>
          Made for focused teams.<span>ORBIT WORKSPACE / 2026</span>
        </footer>
      </main>
    </div>
  );
}
