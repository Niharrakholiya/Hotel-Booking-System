import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = Cookies.get('jwt_token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    Cookies.set("jwt_token", token, { expires: 7 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);