import { useState } from "react";
let nextId = 3;
export default function Array() {
  const [nameInputValue, setNameInputValue] = useState("");
  const [names, setNames] = useState([
    { id: 1, name: "ruaa" },
    { id: 2, name: "shahed" },
  ]);
  // حالة تخزن القيمة المؤقتة للتعديل
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  function startEditing(id, currentName) {
    setEditId(id);
    setEditValue(currentName);
  }

  function handleEditButton() {
    if (!editValue.trim()) return; // منع الاسم الفاضي

    const updatedNames = names.map((name) => {
      if (name.id === editId) {
        return { ...name, name: editValue };
      }
      return name;
    });

    setNames(updatedNames);
    setEditId(null);
    setEditValue("");
  }
  function handleAddButton() {
    if (!nameInputValue.trim()) return; // منع الإضافة إذا فارغ
    setNames([...names, { id: nextId, name: nameInputValue }]);
    nextId = nextId + 1;
    setNameInputValue("");
  }
  function handleDeleteButton(id) {
    const newNames = names.filter((name) => {
      return name.id !== id;
    });
    setNames(newNames);
    if (editId === id) {
      setEditId(null);
      setEditValue("");
    }
  }

  return (
    <div className="p-6 font-sans max-w-md mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          value={nameInputValue}
          onChange={(e) => setNameInputValue(e.target.value)}
          className="border-2 border-blue-500 rounded px-3 py-2 flex-1 focus:outline-none focus:border-blue-700"
          placeholder="أدخل اسم جديد"
        />
        <button
          onClick={handleAddButton}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {names.map((name) => (
          <li
            key={name.id}
            className="bg-blue-50 border border-blue-300 px-4 py-3 rounded flex items-center justify-between"
          >
            {/* عرض الاسم أو حقل التعديل */}
            {editId === name.id ? (
              <div className="flex flex-1 gap-2 items-center">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border border-gray-400 rounded px-2 py-1 flex-grow"
                  autoFocus
                />
                <button
                  onClick={handleEditButton}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  save
                </button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditValue("");
                  }}
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                >
                  Delete
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium text-blue-900">{name.name}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(name.id, name.name)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteButton(name.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



