import { create } from "zustand";
import { UserData } from "../types";

export const useUserStore = create((set) => ({
  user: null, //Estado inicial del user
  setUser: (userData: UserData) => set({ user: userData }), // Acción para establecer el usuario
  clearUser: () => set({ user: null }), // Acción para limpiar el estado del usuario
}));

export default useUserStore;
