import React, { createContext, type ReactNode } from "react";
import type { User, UserContextType } from "../types/ContextTypes";


const UserContext = createContext<UserContextType | null>(null);
export default UserContext;

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const user: User = { name: "John", age: 18 };
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};


