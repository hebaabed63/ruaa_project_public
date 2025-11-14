import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FaComments, FaPaperPlane, FaTimes, FaSchool, FaCircle } from 'react-icons/fa';

// contacts: [{ id, schoolName, managerName }]
const ChatWidget = ({ isOpen, onClose, contacts = [] }) => {
  const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);
  const [input, setInput] = useState('');
  const [messagesMap, setMessagesMap] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    // Initialize empty threads for contacts if not exists
    setMessagesMap((prev) => {
      const next = { ...prev };
      contacts.forEach((c) => {
        if (!next[c.id]) {
          next[c.id] = [
            { id: 'sys1', from: 'manager', text: `أهلاً بك! أنا ${c.managerName}. كيف أستطيع مساعدتك؟`, time: new Date().toLocaleTimeString() }
          ];
        }
      });
      return next;
    });
    if (!activeContactId && contacts[0]) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesMap, activeContactId, isOpen]);

  const activeContact = useMemo(() => contacts.find(c => c.id === activeContactId), [contacts, activeContactId]);
  const thread = messagesMap[activeContactId] || [];

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeContactId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeContactId]: [
        ...(prev[activeContactId] || []),
        { id: `me-${Date.now()}`, from: 'parent', text: trimmed, time: new Date().toLocaleTimeString() }
      ]
    }));
    setInput('');
    // Simulate manager auto-reply
    setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [activeContactId]: [
          ...(prev[activeContactId] || []),
          { id: `mgr-${Date.now()}`, from: 'manager', text: 'تم استلام رسالتك، سنقوم بالرد بالتفصيل قريبًا.', time: new Date().toLocaleTimeString() }
        ]
      }));
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-[28rem] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <FaComments className="text-blue-600" />
          دردشة مع مدراء مدارس أبنائك
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-200" dir="rtl">
        {/* Contacts list */}
        <div className="col-span-1 max-h-96 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContactId(c.id)}
              className={`w-full text-right px-3 py-3 flex items-center gap-2 hover:bg-gray-50 transition ${activeContactId === c.id ? 'bg-blue-50' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <FaSchool />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-800 truncate">{c.schoolName}</div>
                <div className="text-xs text-gray-500 truncate">{c.managerName}</div>
              </div>
              <FaCircle className="text-green-500 text-[8px] ms-auto" />
            </button>
          ))}
          {contacts.length === 0 && (
            <div className="p-4 text-sm text-gray-500">لا توجد مدارس مرتبطة لعرض الدردشة.</div>
          )}
        </div>

        {/* Thread */}
        <div className="col-span-2 flex flex-col h-96">
          {/* Active contact heading */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="text-sm text-gray-700">
              {activeContact ? (
                <>
                  تتحدث الآن مع <span className="font-semibold">{activeContact.managerName}</span> - {activeContact.schoolName}
                </>
              ) : 'اختر محادثة من القائمة'}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {thread.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'parent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow ${
                  m.from === 'parent' ? 'bg-blue-50 text-gray-800 rounded-br-sm' : 'bg-green-50 text-gray-800 rounded-bl-sm'
                }`}>
                  <div>{m.text}</div>
                  <div className="text-[10px] text-gray-500 mt-1 text-left">{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={activeContact ? `اكتب رسالة إلى ${activeContact.managerName}...` : 'اختر محادثة للبدء'}
                disabled={!activeContact}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={!activeContact || !input.trim()}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition ${
                  !activeContact || !input.trim() ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FaPaperPlane />
                إرسال
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;

