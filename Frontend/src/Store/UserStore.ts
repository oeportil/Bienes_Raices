import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserData } from "../types";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null as UserData | null, // Estado inicial del usuario
      setUser: (userData: UserData) => set({ user: userData }), // Acción para establecer el usuario
      clearUser: () => set({ user: null }), // Acción para limpiar el estado del usuario
    }),
    {
      name: "user-storage", // Nombre de la clave en localStorage
      getStorage: () => localStorage, // Define el almacenamiento a usar (localStorage en este caso)
    }
  )
);

export default useUserStore;
