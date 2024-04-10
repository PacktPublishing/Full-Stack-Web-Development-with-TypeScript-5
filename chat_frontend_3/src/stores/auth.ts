import { writable } from "svelte/store";
import axios from "axios";

function setAxiousAuth(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function createAuthStore() {
  const token = localStorage.getItem("authToken");
  if (token) {
    setAxiousAuth(token);
  }
  const { subscribe, set, update } = writable<string | null>(token);

  return {
    subscribe,
    set: (value: string) => {
      localStorage.setItem("authToken", value);
      set(value);
      if (value) {
        setAxiousAuth(value);
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    },
    remove: () => {
      localStorage.removeItem("authToken");
      set(null);
      delete axios.defaults.headers.common["Authorization"];
    },
  };
}

export const authToken = createAuthStore();
