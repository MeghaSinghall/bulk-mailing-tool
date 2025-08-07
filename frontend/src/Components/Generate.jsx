import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Chat = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [mailType, setMailType] = useState('Professional'); // New state for mail type
  const endOfMessagesRef = useRef(null);

  // Custom toast styles
  const toastOptions = {
    success: { icon: '✅', duration: 3000 },
    error: { icon: '❌', duration: 4000 },
    style: { borderRadius: '4px', padding: '8px 12px' },
  };

  // Initial welcome message
  useEffect(() => {
    setMessages([{ sender: 'bot', text: 'I can assist you with generating your emails. Please select the mail type and describe what you want in the email.' }]);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  // Simulate bot response for email generation
  const getBotResponse = (userMessage, mailType) => {
    return `Generating ${mailType} email based on: "${userMessage}"`;
  };

  // Handle sending a message
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) {
      toast.error('Please enter a message', toastOptions.error);
      return;
    }

    const newMessage = { sender: 'user', text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage, mailType);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
      setIsBotTyping(false);
      toast.success('Message sent', toastOptions.success);
    }, 1000);
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-800">Chatbot</h1>
        </div>
      </div>

      {/* Chat messages */}
      <div className="bg-white rounded-lg shadow p-6 flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Typing...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef}></div>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 bg-white shadow rounded-lg p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full  text-black placeholder-gray-400 border-2  p-2 rounded-lg focus:ring-0 resize-none overflow-y-auto"
          placeholder="Type your email content here..."
          rows="8"
        />
        <div className="flex gap-2">
          <select
            value={mailType}
            onChange={(e) => setMailType(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-3 py-2"
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
          </select>
          <button
            type="submit"
            className="   bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;