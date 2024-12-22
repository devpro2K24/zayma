// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./slice/authSlice"
// Import des slices


const store = configureStore({
  reducer: {
   authReducer  // Ajoute le reducer auth ici
    // Ajoute d'autres reducers si nécessaire
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactiver les vérifications si tu utilises des données non sérialisables comme `Date`
    }),
  devTools: process.env.NODE_ENV !== "production", // Active Redux DevTools uniquement en développement
});

// Typage du store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hook pour utiliser dispatch avec TypeScript
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
