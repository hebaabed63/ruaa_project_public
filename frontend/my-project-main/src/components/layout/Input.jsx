import { useState } from "react";
import { useContext } from "react";
import Modal from "../Modal";
import Age from "./Age"
import { FormContext } from "../../contexts/FormContext";
import { UserContext } from "../../contexts/UserContext";

export default function Input() {
  const userData =useContext(UserContext);
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
    age: "",
    status: "",
    generalInfo: "",
    country: "",
    rememberMe: false,
  });

  const [modal, setModal] = useState({
    isVisible: false,
    type: "success", // أو "error"
    message: "",
  });

  const btnIsDisabled = !formInput.name || !formInput.email;
  
   const handleAgeChange = (value) => {
    setFormInput({ ...formInput, age: value });
  };
  const handleFormSubmit = (e) => {
  e.preventDefault();

  // الاسم: أحرف فقط
  if (!formInput.name) {
    setModal({ isVisible: true, type: "error", message: "الاسم مطلوب" });
    return;
  }
  if (!/^[\p{L} ]+$/u.test(formInput.name)) {
    setModal({ isVisible: true, type: "error", message: "الاسم يجب أن يحتوي أحرف فقط" });
    return;
  }

  // البريد الإلكتروني: تحقق متقدم
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formInput.email) {
    setModal({ isVisible: true, type: "error", message: "البريد الإلكتروني مطلوب" });
    return;
  }
  if (!emailRegex.test(formInput.email)) {
    setModal({ isVisible: true, type: "error", message: "صيغة البريد الإلكتروني غير صحيحة" });
    return;
  }

  // كلمة المرور: min6 + أحرف كبيرة وصغيرة وأرقام ورموز
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!formInput.password || formInput.password.length < 6) {
    setModal({ isVisible: true, type: "error", message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف" });
    return;
  }
  if (!passwordRegex.test(formInput.password)) {
    setModal({ isVisible: true, type: "error", message: "كلمة المرور يجب أن تحتوي أحرف كبيرة وصغيرة وأرقام ورموز" });
    return;
  }

  // تأكيد كلمة المرور
  if (formInput.password !== formInput.confirmPassword) {
    setModal({ isVisible: true, type: "error", message: "كلمتا المرور غير متطابقتين" });
    return;
  }

  // العمر
  if (formInput.age < 18 || formInput.age > 100) {
    setModal({ isVisible: true, type: "error", message: "العمر غير مسموح" });
    return;
  }

  // إذا كل شيء صح
  setModal({ isVisible: true, type: "success", message: "تم إرسال البيانات بنجاح!" });
};


  function handleDivClick(){ if(modal){ setModal(false); } }
  const btnColor = btnIsDisabled
  ? "bg-blue-900 cursor-not-allowed"
  : "bg-blue-600 hover:bg-blue-900";

   return (
    <div onClick={handleDivClick} className="max-w-md mx-auto p-5 bg-gray-100 rounded-lg">
      <h1 className=" text-blue-600">Hello {userData.name}</h1>
      <form className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-blue-600 font-medium mb-1">
            الاسم 
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formInput.name}
            placeholder="ادخل اسمك"
             onChange={(e) => {
           setFormInput({ ...formInput, name: e.target.value });
             }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-blue-600 font-medium mb-1">
            الايميل
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formInput.email}
            placeholder="ادخل ايميلك"
           onChange={(e) => {
            setFormInput({ ...formInput, email: e.target.value });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      <div>
        {/* Password Field */}
<div>
  <label htmlFor="password" className="block text-blue-600 font-medium mb-1">
    كلمة المرور
  </label>
  <input
    type="password"
    id="password"
    name="password"
    value={formInput.password}
    placeholder="ادخل كلمة المرور"
    onChange={(e) => setFormInput({ ...formInput, password: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* Confirm Password Field */}
<div>
  <label htmlFor="confirmPassword" className="block text-blue-600 font-medium mb-1">
    تأكيد كلمة المرور
  </label>
  <input
    type="password"
    id="confirmPassword"
    name="confirmPassword"
    value={formInput.confirmPassword}
    placeholder="اعد كتابة كلمة المرور"
    onChange={(e) => setFormInput({ ...formInput, confirmPassword: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* New Password Field */}
<div>
  <label htmlFor="newPassword" className="block text-blue-600 font-medium mb-1">
    كلمة المرور الجديدة
  </label>
  <input
    type="password"
    id="newPassword"
    name="newPassword"
    value={formInput.newPassword}
    placeholder="ادخل كلمة المرور الجديدة"
    onChange={(e) => setFormInput({ ...formInput, newPassword: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
{/* Age Field */}
<FormContext.Provider value={{ inputValue:formInput.age,handleChange:handleAgeChange  }}>
<Age/>
</FormContext.Provider>
 
      <label> جنسك:</label>
      <label>
        <input
          type="radio"
          value="ذكر"
          name="status"
          checked={formInput.status =="ذكر"}
          onChange={(e) => {
          setFormInput({ ...formInput, status: e.target.value });
        }}
        />
        ذكر
      </label>
      
      <label>
        <input
          type="radio"
          name="status"
          value="أنثى"
          checked={formInput.status == "أنثى"}
          onChange={(e) => {
          setFormInput({ ...formInput, status: e.target.value });
        }}
        />
        أنثى
      </label>
    </div>

        {/* General Info */}
        <div>
          <label htmlFor="generalInfo" className="block text-blue-600 font-medium mb-1">
            معلومات اخرى
          </label>
          <textarea
            id="generalInfo"
            name="generalInfo"
            value={formInput.generalInfo}
            placeholder="Enter additional info"
                          onChange={(e) => {
    setFormInput({ ...formInput, generalInfo: e.target.value });
  }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        {/* Country Select */}
        <div>
          <label htmlFor="country" className="block text-blue-600 font-medium mb-1">
            المدينة
          </label>
          <select
            id="country"
            name="country"
            value={formInput.country}
           onChange={(e) => {
            setFormInput({ ...formInput, country: e.target.value });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gaze">غزة</option>
            <option value="yafa">يافا</option>
            <option value="hyfa">حيفا</option>
          </select>
        </div>

        {/* Checkbox Field */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formInput.rememberMe}
             onChange={(e) => {
             setFormInput({ ...formInput, rememberMe: e.target.checked });
           }}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="rememberMe" className="ml-2 text-blue-600 font-medium">
            هل انت طالب
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={btnIsDisabled}
          onClick={handleFormSubmit}
            className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-200 ${btnColor}`}
        >
          Submit
        </button>
      </form>
      <Modal
        isVisible={modal.isVisible}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, isVisible: false })}
      />
    </div>
  );
}
