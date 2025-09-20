import React, { createContext, useState, useEffect } from "react";

// 1. Create context
export const AuthContext = createContext();

// 2. Create provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("user_avatar");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
      setIsAuthenticated(true);
      
      // تحميل بيانات المستخدم إن وجدت
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      if (savedAvatar) {
        setUserAvatar(savedAvatar);
      }
    }
  }, []);

  // Login function
  const login = (token, role, userData = null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setUserRole(role);
    setIsAuthenticated(true);
    
    // حفظ بيانات المستخدم إن تم تمريرها
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      if (userData.avatar) {
        setUserAvatar(userData.avatar);
        localStorage.setItem("user_avatar", userData.avatar);
      }
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("user_avatar");
    setToken(null);
    setUserRole(null);
    setUser(null);
    setUserAvatar(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        userRole, 
        token, 
        user,
        userAvatar,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
