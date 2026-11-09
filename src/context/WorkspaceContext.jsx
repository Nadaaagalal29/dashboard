import { createContext, useContext, useEffect, useState } from "react";
import { createService } from "../services/workspaceService.js";
const Context = createContext(null);
const api = createService(localStorage);
export const useApp = () => useContext(Context);
export function WorkspaceProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("orbit-user"));
    } catch {
      return null;
    }
  });
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [toast, setToast] = useState(""),
    [modal, setModal] = useState(null);
  async function load() {
    setError("");
    try {
      setData(await api.load());
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (toast) {
      let t = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  async function commit(next, message) {
    if (busy) return false;
    setBusy(true);
    try {
      const updated = {
        ...next,
        activity: [
          {
            id: crypto.randomUUID(),
            text: message,
            time: new Date().toISOString(),
          },
          ...next.activity,
        ].slice(0, 20),
      };
      await api.save(updated);
      setData(updated);
      setToast(message);
      return true;
    } catch (e) {
      setToast("Unable to save: " + e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <Context.Provider
      value={{
        user,
        setUser,
        data,
        error,
        load,
        commit,
        busy,
        toast,
        modal,
        setModal,
        setToast,
      }}
    >
      {children}
    </Context.Provider>
  );
}
