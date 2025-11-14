// =============================================================================
// Logout Confirmation Modal Component
// مكون نموذج تأكيد تسجيل الخروج
// =============================================================================

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { AuthContext } from '../../../../../contexts/AuthContext';

/**
 * مكون نموذج تأكيد تسجيل الخروج
 * Logout Confirmation Modal component
 */
export const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleConfirm = async () => {
    try {
      // Call the logout function from AuthContext
      logout();
      
      // Close modal
      onClose();
      
      // Redirect to landing page with smooth animation
      navigate('/', { 
        state: { fromLogout: true }, 
        replace: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to landing page even if API logout fails
      onClose();
      navigate('/', { 
        state: { fromLogout: true }, 
        replace: true 
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  هل أنت متأكد من تسجيل الخروج؟
                </h3>
                
                <div className="flex justify-center space-x-4 space-x-reverse mt-6">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onClose}
                  >
                    إلغاء
                  </Button>
                  
                  <Button
                  className="bg-red-600"
                    variant="danger"
                    size="md"
                    onClick={handleConfirm}
                  >
                    تأكيد
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};