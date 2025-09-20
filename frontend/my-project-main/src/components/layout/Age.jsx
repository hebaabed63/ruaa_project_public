import { useContext } from "react";
import { FormContext } from "../../contexts/FormContext";

export default function Age(){
  const inputContext=useContext(FormContext);
  return (
<>
  <label htmlFor="age" className="block text-blue-600 font-medium mb-1">
    العمر
  </label>
  <input
    type="number"
    id="age"
    name="age"
    value={inputContext.inputValue}
    placeholder="ادخل عمرك"
    onChange={(e) => inputContext.handleChange( e.target.value )}
    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    min="0"
  />
</>
);
}