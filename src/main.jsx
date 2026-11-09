import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import "./styles.css";
import "./reference.css";

createRoot(document.getElementById("root")).render(
  <WorkspaceProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </WorkspaceProvider>,
);
