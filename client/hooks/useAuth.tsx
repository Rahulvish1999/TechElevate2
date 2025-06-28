import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  fullName: string;
  role: "student" | "faculty";
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  login: (fullName: string, role: "student" | "faculty") => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ccna-current-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (fullName: string, role: "student" | "faculty") => {
    const newUser: User = {
      id: fullName.toLowerCase().replace(/\s+/g, "_"),
      fullName,
      role,
      loginTime: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem("ccna-current-user", JSON.stringify(newUser));

    // Save user to users list if not exists
    const existingUsers = JSON.parse(
      localStorage.getItem("ccna-users") || "[]",
    );
    const userExists = existingUsers.find((u: User) => u.id === newUser.id);
    if (!userExists) {
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("ccna-users", JSON.stringify(updatedUsers));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ccna-current-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
