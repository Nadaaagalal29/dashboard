# CarLink — React Project Management Dashboard

A complete responsive demo workspace built with React 18, React Router 7, Context, Vite 7, Recharts, dnd-kit, and Lucide icons. JavaScript and plain CSS; no backend credentials required.

## Run locally

Install Node.js 20.19+ or 22.12+ (Node 24 was used for verification).

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. Sign in with **any valid email** and **any password of at least six characters**. Do not enter a real password: this is mock authentication. The password is never stored. The session lasts until sign out or the browser tab session ends.

```sh
npm test
npm run build
npm run preview
```

`dist/` contains the production build. Serve it over HTTP; do not double-click index.html. Hash routing supports static hosting without route rewrite configuration.

## Features

- Validated mock login, protected routes, session persistence and logout.
- Calculated project/task counts, completion metrics, interactive status chart, and recent activity.
- Project create/read/update/delete, text search, status filters, six-item pagination, project details, dates and calculated task progress.
- Task create/read/update/delete, project association, assignee, priority, due date, all four workflow statuses, combined search/filters and pagination.
- Kanban dragging using dnd-kit; the card editor also provides an accessible status selector.
- Team directory, assignment totals, completed totals and member-filtered task lists.
- Async data loading and writes, loading/disabled states, persistence failures, retry on load, validation, empty states, save notifications, deletion confirmation and cascading project deletion.
- Responsive desktop/mobile layouts. Main-screen screenshots are included in `screenshots/`.

## Structure

```text
src/
  main.jsx                     Application startup and providers only
  App.jsx                      Routes, protected workspace and global overlays
  pages/                       Login, Dashboard, Projects, Tasks, Board, Team, ProjectDetail
  components/
    common/                    Avatar, Badge, Heading, SearchBox, Pagination, Empty
    layout/                    Shell, HeaderSearch
    projects/                  ProjectCard
    tasks/                     TaskTable
    kanban/                    DraggableTask, KanbanColumn
    team/                      TeamTasks
    forms/                     ProjectTaskEditor
  context/WorkspaceContext.jsx Session state, async data, saves and notifications
  hooks/useTaskFilters.jsx     Shared task search/filter state and controls
  services/workspaceService.js Async persistence, seed data and cascade helper
  utils/projectUtils.js        Date formatting and progress calculation
  service.test.js              Service tests
  styles.css                  Base layout styles
  reference.css               CarLink theme
public/images/                Bundled photographs
screenshots/                  Application screenshots
dist/                         Ready-to-host production build
```

## Data and assumptions

The lightweight local service deliberately simulates latency using async/await. Data is stored under `orbit-data-v1` in localStorage, and updates are committed to React state only after persistence succeeds. Storage errors are surfaced to the user. To reset the demo, remove that localStorage key in browser developer tools and refresh. Initial projects and tasks use fixed November 2026 dates. Team profiles are demo records. Project status is selected manually; percentage progress is calculated from completed tasks. Deleting a project also deletes its tasks after confirmation.

Mock authentication is a UI demonstration, not a security boundary. There is no remote API, multi-user synchronization, account registration, password recovery, team-member editing, or production authorization. Avoid sensitive data. Google Fonts is optional: system fallbacks work offline. Project images support local JPG, PNG and WebP upload, preview, replacement and removal (2 MB limit). Images persist in localStorage, subject to the browser storage quota.

## Hosting and submission

For Vercel or Netlify, import this directory, choose `npm run build`, and set the output directory to `dist`. GitHub publication and live deployment have not been performed as part of the ZIP delivery. This package includes source, lockfile, production assets, screenshots, and verification notes. Dependencies are excluded; use `npm ci`.

## AI assistance disclosure

This implementation was generated with OpenAI Codex and must not be represented as independently authored work. The supplied assessment limits AI implementation to 60% and requires at least 40% direct developer implementation. This ZIP alone does not meet that authorship limit. Review, understand, test, and make your own substantive implementation contributions before submission. No claim is made about satisfying that percentage.

See `VERIFICATION.md` for the checks performed and known limits.

## UI reference revision

The layout now follows the CarLink reference: navy navigation, blue actions, compact metric cards, progress donut, activity area chart, project image cards and split photo login. It is a recreation from the low-resolution illustrative PDF, not a pixel-exact copy. Photographs are replacements, bundled locally from Unsplash image URLs: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7 and https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b. Activity Overview counts task updates and recorded actions in the last seven calendar days.

## Component refactor

Pages compose reusable UI components. WorkspaceProvider owns shared state and persistence. App handles routes and protected access. main.jsx only mounts the provider, router and application. The UI, data keys and behavior are retained. This refactor does not change the documented local-service or uncontrolled-form approach.
