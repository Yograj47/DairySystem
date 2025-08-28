import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface DarkModeContextType {
  isDark: boolean;
  toggleDark: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setDark] = useState<boolean>(() => {
    // Load from localStorage on initial render
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isDark");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("isDark", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "isDark" && e.newValue) {
        setDark(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) throw new Error("useDarkMode must be used within DarkModeProvider");
  return context;
};
