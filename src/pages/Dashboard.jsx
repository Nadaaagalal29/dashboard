import { NavLink } from "react-router-dom";
import {
  FolderKanban,
  ListTodo,
  ArrowRight,
  Check,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { statuses } from "../services/workspaceService.js";
import { useApp } from "../context/WorkspaceContext.jsx";
import { Heading } from "../components/common/Heading.jsx";
import { Empty } from "../components/common/Empty.jsx";

export function Dashboard() {
  const { data } = useApp();
  const complete = data.tasks.filter((t) => t.status === "Completed").length;
  const pct = data.tasks.length
    ? Math.round((complete / data.tasks.length) * 100)
    : 0;
  const chart = statuses.map((name, i) => ({
    name,
    value: data.tasks.filter((t) => t.status === name).length,
    color: ["#a9c7fc", "#2877ed", "#f5b34d", "#29ba8f"][i],
  }));
  const recent = data.activity.length
    ? data.activity.slice(0, 5)
    : data.tasks
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          text: t.title + " · " + t.status,
          time: t.updatedAt,
        }));
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 6 + i);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      updates: [
        ...data.tasks.map((t) => t.updatedAt),
        ...data.activity.map((a) => a.time),
      ].filter((v) => new Date(v).toDateString() === d.toDateString()).length,
    };
  });
  return (
    <>
      <Heading
        title="Dashboard"
        description="Welcome back! Here’s an overview of your projects."
      />
      <div className="metrics">
        {[
          ["Total Projects", data.projects.length, FolderKanban],
          ["Total Tasks", data.tasks.length, ListTodo],
          ["Completed", complete, Check],
          ["Pending Tasks", data.tasks.length - complete, Activity],
        ].map(([name, n, Icon], i) => (
          <div className="metric" key={name}>
            <span className={"metric-icon mi" + i}>
              <Icon size={24} />
            </span>
            <div>
              <strong>{n}</strong>
              <span>{name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-charts">
        <section className="panel">
          <h2>Project Progress</h2>
          <div className="chart-row">
            <div className="donut">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chart}
                    dataKey="value"
                    innerRadius={76}
                    outerRadius={99}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {chart.map((c) => (
                      <Cell key={c.name} fill={c.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-label">
                <strong>{pct}%</strong>
                <small>Tasks completed</small>
              </div>
            </div>
            <div className="legend">
              {chart.map((c) => (
                <div key={c.name}>
                  <i style={{ background: c.color }} />
                  {c.name}
                  <b>{c.value}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="section-title">
            <h2>Activity Overview</h2>
            <span className="muted">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={days}
              margin={{ top: 15, right: 15, bottom: 0, left: -25 }}
            >
              <defs>
                <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2877ed" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2877ed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#edf1f6" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#8994a8" }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#8994a8" }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="updates"
                name="Updates"
                stroke="#2877ed"
                strokeWidth={2.5}
                fill="url(#activityFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </div>
      <section className="panel dashboard-activity">
        <div className="section-title">
          <h2>Recent Activity</h2>
          <NavLink to="/tasks">
            View all tasks <ArrowRight size={15} />
          </NavLink>
        </div>
        <div className="activity-list">
          {recent.map((a) => (
            <div key={a.id}>
              <span className="activity-icon">
                <Check size={17} />
              </span>
              <div>
                <p>{a.text}</p>
                <small>
                  {new Date(a.time).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          ))}
          {!recent.length && <Empty />}
        </div>
      </section>
    </>
  );
}
