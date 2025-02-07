"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextProps {
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [customerId, setCustomerId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ customerId, setCustomerId }}>
      {children}
    </UserContext.Provider>
  );
};
