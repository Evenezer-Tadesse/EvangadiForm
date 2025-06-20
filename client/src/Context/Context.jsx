import { createContext, useReducer } from "react";

// Create the context
const AuthContext = createContext();

// Provider component
function AuthProvider({ children, reducer, initialState }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
