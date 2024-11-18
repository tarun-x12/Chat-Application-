// app-store.js
import { create } from "zustand";
import AuthStore from "./auth-store";
import ChatStore from "./chat-store";

export const useAppStore = create((set, get) => ({
  auth: new AuthStore(set),
  chat: new ChatStore(set, get),
}));
