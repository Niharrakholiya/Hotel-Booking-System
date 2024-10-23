import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Changed to named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = Cookies.get('jwt_token');
        if (token) {
          // Verify token hasn't expired
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token has expired
            logout();
          } else {
            setIsAuthenticated(true);
            setUserRole(decodedToken.role);
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication check failed');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      
      // Verify token has required fields and isn't expired
      if (!decodedToken.role) {
        throw new Error('Invalid token format: missing role');
      }

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new Error('Token has expired');
      }

      Cookies.set("jwt_token", token, { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });
      
      setIsAuthenticated(true);
      setUserRole(decodedToken.role);
      setError(null);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed: ' + err.message);
      logout();
    }
  };

  const logout = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
    setUserRole(null);
    setError(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userRole, 
        login, 
        logout,
        error,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
