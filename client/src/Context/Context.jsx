import { createContext, useReducer, useEffect } from "react";
import { initial, reducer } from "../Utility/reducer";
import { safeGet } from "../Utility/storage"; // Add if using utils

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Optional: Sync localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      const token = safeGet("token");
      const user = safeGet("user");

      if ((!token || !user) && (state.token || state.user)) {
        dispatch({ type: Type.REMOVE_USER });
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}
