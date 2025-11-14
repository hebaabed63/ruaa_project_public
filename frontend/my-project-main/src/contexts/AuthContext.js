import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";

// 1. Create context
export const AuthContext = createContext();

// 2. Create provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user activity
  const trackActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Add activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => trackActivity();
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [trackActivity]);

  // Load auth from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      const savedUser = localStorage.getItem("user");
      const savedAvatar = localStorage.getItem("user_avatar");

      if (savedToken && savedRole) {
        setToken(savedToken);
        setUserRole(savedRole);
        setIsAuthenticated(true);
        
        // Load user data
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
        
        // Validate token by fetching current user
        try {
          const userData = await getCurrentUser(savedToken);
          if (userData && userData.success && userData.data && userData.data.user) {
            setUser(userData.data.user);
            setUserRole(userData.data.role);
            localStorage.setItem("user", JSON.stringify(userData.data.user));
            localStorage.setItem("role", userData.data.role);
            console.log("Token validation successful:", userData);
          } else {
            // If token is invalid, logout
            console.log("Token validation failed: Invalid response structure", userData);
            // Only logout if we're not already on the login page
            if (window.location.pathname !== '/login') {
              logout();
            }
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          // Only logout if we're not already on the login page
          if (window.location.pathname !== '/login') {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Periodically validate token and check for inactivity
  useEffect(() => {
    if (!token) return;
    
    const interval = setInterval(async () => {
      // Check for inactivity (3 hours = 180 minutes = 10800000 milliseconds)
      const now = Date.now();
      const inactivityPeriod = now - lastActivity;
      
      // If user has been inactive for more than 3 hours, logout
      if (inactivityPeriod > 3 * 60 * 60 * 1000) {
        console.log("User inactive for 3 hours, logging out");
        logout();
        return;
      }
      
      // Validate token
      try {
        const userData = await getCurrentUser(token);
        if (userData && userData.success && userData.data && userData.data.user) {
          setUser(userData.data.user);
          setUserRole(userData.data.role);
          localStorage.setItem("user", JSON.stringify(userData.data.user));
          localStorage.setItem("role", userData.data.role);
          console.log("Periodic token validation successful:", userData);
        } else {
          // If token is invalid, logout
          console.log("Periodic token validation failed: Invalid response structure", userData);
          // Only logout if we're not already on the login page
          if (window.location.pathname !== '/login') {
            logout();
          }
        }
      } catch (error) {
        console.error("Periodic token validation failed:", error);
        // Only logout if we're not already on the login page
        if (window.location.pathname !== '/login') {
          logout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes for better responsiveness

    return () => clearInterval(interval);
  }, [token, lastActivity]);

  // Login function
  const login = (token, role, userData = null) => {
    console.log('Login function called with:', { token, role, userData });
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setUserRole(role);
    setIsAuthenticated(true);
    setLastActivity(Date.now()); // Reset activity timer on login
    
    // Save user data if provided
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
    // Redirect to login page
    window.location.href = '/login';
  };

  // Check if user is authenticated without redirecting
  const checkAuth = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      return false;
    }
    
    try {
      const userData = await getCurrentUser(savedToken);
      return userData && userData.success && userData.data && userData.data.user;
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        userRole, 
        token, 
        user,
        userAvatar,
        loading,
        login, 
        logout,
        trackActivity,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};