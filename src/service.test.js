import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createService,
  seed,
  removeProject,
} from "./services/workspaceService.js";
test("CRUD data persists across service instances", async () => {
  const map = new Map();
  const storage = {
    getItem: (k) => map.get(k),
    setItem: (k, v) => map.set(k, v),
  };
  const api = createService(storage);
  let data = await api.load();
  data.projects.push({ id: "custom", name: "Test" });
  await api.save(data);
  assert.equal(
    (await createService(storage).load()).projects.at(-1).id,
    "custom",
  );
  data = removeProject(data, "custom");
  await api.save(data);
  assert.ok(!(await api.load()).projects.some((p) => p.id === "custom"));
});
test("deleting a project removes related tasks only", () => {
  const data = seed();
  const next = removeProject(data, "p1");
  assert.ok(!next.tasks.some((t) => t.projectId === "p1"));
  assert.equal(
    next.tasks.length,
    data.tasks.filter((t) => t.projectId !== "p1").length,
  );
  assert.equal(data.projects.length, 4);
});
test("storage failures reject without corrupting the next save", async () => {
  let fail = true;
  const api = createService({
    setItem: () => {
      if (fail) throw Error("Storage full");
    },
    getItem: () => null,
  });
  await assert.rejects(api.save(seed()), /Storage full/);
  fail = false;
  await api.save(seed());
});
