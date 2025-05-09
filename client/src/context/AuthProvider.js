import { createContext, useState } from "react";

const AuthContext = createContext({}); //creates a global state for the app

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value = {{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;