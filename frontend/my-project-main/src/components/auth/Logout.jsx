import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { logoutService } from "../../services/authService";
import { showAlert } from "../../utils/SweetAlert";
import usePageTitle from "../../hooks/usePageTitle";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Set page title
  usePageTitle("تسجيل الخروج");

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the logout service to invalidate the token on the backend
        await logoutService();
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        // Clear local authentication state
        logout();
        
        // Show success message
        showAlert("success", "تم تسجيل الخروج بنجاح");
        
        // Redirect to login page
        navigate("/login");
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
};

export default Logout;