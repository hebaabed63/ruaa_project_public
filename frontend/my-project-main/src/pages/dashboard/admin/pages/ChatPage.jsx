import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaComments, FaUser, FaSchool, FaSearch,FaSmile, FaPaperclip  } from 'react-icons/fa';
import { useChat } from '../hooks/useData';
import { FaStar } from 'react-icons/fa';

const ChatPage = () => {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    startConversation,
    sendMessage,
    setActiveConversation
  } = useChat();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeConversation) return;

    try {
      await sendMessage(activeConversation.id, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-120px)]" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden flex flex-col flex-1"
      >
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar Section */}
          <div className="border-l border-gray-200 dark:border-gray-700 flex flex-col w-full md:w-1/3">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
المحادثات              </h2>

             <div className="relative w-full mb-3">
  <input
    type="text"
    placeholder="Search"
    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    style={{ textAlign: 'left' }} />
  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" />
</div>

              {/* Horizontal Select Boxes */}
              <div className="flex space-x-1">
                <select className="flex-1 bg-gray-200 mx-2 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>المدارس</option>
                </select>

                <select className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>المعلمون</option>
                </select>

                <select className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>المشرفون</option>
                </select>
              </div>
            </div>

            {/* Schools List */}
            <div className="overflow-y-auto flex-1">
  {loading ? (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ) : error ? (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-red-500 dark:text-red-400 text-center">
        <p>حدث خطأ أثناء تحميل البيانات</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    </div>
  ) : conversations.length === 0 ? (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <FaComments className="mx-auto text-3xl mb-2" />
        <p>لا توجد محادثات</p>
      </div>
    </div>
  ) : (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {conversations.map((conversation) => {
        const lastMessage = conversation.messages?.[conversation.messages.length - 1];
        return (
          <motion.div
            key={conversation.id}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 cursor-pointer transition-colors ${
              activeConversation?.id === conversation.id
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => startConversation(conversation)}
          >
            <div className="flex items-start justify-between">
                  <div className="flex items-start">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-2 text-yellow-400 hover:text-yellow-500 transition-colors"
  >
    <FaStar className="h-6 w-6" />
  </motion.button>
</div>
              
              <div className="flex items-center">
               
                <div className="mr-3 flex flex-col">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
                    {conversation.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                    {lastMessage ? lastMessage.text : 'لا توجد رسائل بعد'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {lastMessage
                      ? new Date(lastMessage.timestamp).toLocaleDateString('ar-SA', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
                 <img
                  src={conversation.image || '/default-avatar.png'}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
              </div>

         
            </div>
          </motion.div>
        );
      })}
    </div>
  )}
</div>

          </div>

          {/* Chat Window */}
          <AnimatePresence>
            {activeConversation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700"
              >
              {/* Chat Header */}
<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-row-reverse items-center justify-between">
  <div className="flex flex-row-reverse items-center">
    <button
      onClick={() => setActiveConversation(null)}
      className="md:hidden ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    {/* <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ml-3">
      <FaUser className="text-blue-500 dark:text-blue-400" />
    </div> */}
    <div className="ml-3 text-right">
      <h3 className="font-medium text-gray-900 dark:text-white">Mestar Ali</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Last visit: Nov 14, 2024</p>
    </div>
  </div>
</div>


{/* Messages */}
<div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
  {/* Date Banner */}
  <div className="flex justify-center mb-4">
    <div className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-4 py-1 text-xs font-medium">
      Today, Nov 16
    </div>
  </div>

  {loading ? (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ) : error ? (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-red-500 dark:text-red-400 text-center">
        <p>حدث خطأ أثناء تحميل الرسائل</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    </div>
  ) : messages.length === 0 ? (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <FaComments className="mx-auto text-3xl mb-2" />
        <p>لا توجد رسائل بعد</p>
        <p className="text-sm mt-1">ابدأ بكتابة رسالة جديدة</p>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${message.from === 'parent' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${
              message.from === 'parent'
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-br-none'
                : 'bg-blue-500 text-white rounded-bl-none'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <p
              className={`text-xs mt-1 ${
                message.from === 'parent' ? 'text-gray-600 dark:text-gray-300' : 'text-blue-100'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )}
</div>


                {/* Message Input */}
     <div className="p-4 border-t border-gray-200 dark:border-gray-700">
  <div className="flex items-center space-x-2 flex-row-reverse">
    
    {/* Message Input Container */}
    <div className="relative flex-1">
      {/* Message Input */}
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        dir="rtl"   
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl py-3 px-12 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-right text-right"
        rows="1"
      />

      {/* Emoji Icon */}
      <button className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors">
        <FaSmile />
      </button>

      {/* Attachment Icon */}
      <button className="absolute left-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition-colors">
        <FaPaperclip />
      </button>
    </div>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSendMessage}
      disabled={!newMessage.trim()}
      className="p-3 bg-gray-700 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <FaPaperPlane />
    </motion.button>

  </div>
</div>




              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile back button when no conversation is selected */}
        {!activeConversation && (
          <div className="md:hidden p-4 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            اختر مدرسة من القائمة لبدء المحادثة
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatPage;
