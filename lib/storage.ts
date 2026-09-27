import { openDB } from "idb";
import { AppState } from "./types";
import { initialState } from "./mock-data";

const DB_NAME = "hummers-app";
const STORE = "state";
const KEY = "main";

const cloneInitial = (): AppState => JSON.parse(JSON.stringify(initialState));

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) database.createObjectStore(STORE);
    },
  });
}

export async function loadState(): Promise<AppState> {
  if (typeof window === "undefined") return cloneInitial();
  const database = await db();
  return (await database.get(STORE, KEY)) || cloneInitial();
}

export async function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  const database = await db();
  await database.put(STORE, state, KEY);
}

export async function resetState() {
  const value = cloneInitial();
  await saveState(value);
  return value;
}
