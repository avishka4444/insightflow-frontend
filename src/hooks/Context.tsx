import { useContext } from "react";
import type { UserContextType } from "../types/ContextTypes";
import UserContext from "../context/UserContext";

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
