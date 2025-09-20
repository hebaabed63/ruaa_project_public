import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";

// TextInput
export const TextInput = ({ value, onChange, onBlur, placeholder, error }) => {
  return (
    <div className="relative flex flex-col pb-1.5 mb-3 border-b border-gray-400 transition-all duration-300 ease-in-out focus-within:border-b-primary">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full pl-2.5 pr-8 text-gray-700 bg-transparent text-sm py-1.5 outline-none border-none focus:ring-0 focus:border-none focus:outline-none"
        />
        <FiUser className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-300 ease-in-out" />
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

// EmailInput
export const EmailInput = ({ value, onChange, onBlur, placeholder, error }) => {
  return (
    <div className="relative flex flex-col pb-1.5 mb-3 border-b border-gray-400 transition-all duration-300 ease-in-out focus-within:border-b-primary">
      <div className="relative">
        <input
          type="email"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full pl-2.5 pr-8 text-gray-700 bg-transparent text-sm py-1.5 outline-none border-none focus:ring-0 focus:border-none focus:outline-none"
        />
        <FiMail className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-300 ease-in-out" />
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

// PasswordInput
export const PasswordInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  showPassword,
  toggleShowPassword
}) => {
  return (
    <div className="relative flex flex-col pb-1.5 mb-3 border-b border-gray-400 transition-all duration-300 ease-in-out focus-within:border-b-primary">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full pl-8 pr-8 text-gray-700 bg-transparent text-sm py-1.5 outline-none border-none focus:ring-0 focus:border-none focus:outline-none"
        />

        {/* أيقونة العين على اليسار */}
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute left-1.5 top-1/2 transform -translate-y-1/2 transition-transform duration-300 ease-in-out hover:scale-110"
        >
          {showPassword 
            ? <FiEye className="w-4 h-4 text-gray-400 hover:text-primary transition-colors duration-300 ease-in-out" /> 
            : <FiEyeOff className="w-4 h-4 text-gray-400 hover:text-primary transition-colors duration-300 ease-in-out" />}
        </button>

        {/* أيقونة القفل على اليمين */}
        <FiLock className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-300 ease-in-out" />
      </div>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};
