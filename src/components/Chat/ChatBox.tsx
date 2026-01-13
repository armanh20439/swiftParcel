"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  senderEmail: string;
  message: string;
  timestamp: string;
}

const ChatBox = ({ parcelId, senderEmail, receiverEmail, onClose }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // ১. মেসেজ ফেচ করা (Polling)
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?parcelId=${parcelId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Chat sync error");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // প্রতি ৩ সেকেন্ড পর পর আপডেট হবে
    return () => clearInterval(interval);
  }, [parcelId]);

  // অটো স্ক্রল ডাউন
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ২. মেসেজ পাঠানো
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      parcelId,
      senderEmail,
      receiverEmail,
      message: newMessage,
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
      if (res.ok) {
        setNewMessage("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Send error");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 h-96 bg-white shadow-2xl rounded-2xl border flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom">
      {/* Header */}
      <div className="bg-[#00302E] p-4 text-white flex justify-between items-center">
        <h3 className="font-bold text-sm">SwiftChat Support</h3>
        <button onClick={onClose} className="btn btn-xs btn-circle btn-ghost">✕</button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`chat ${msg.senderEmail === senderEmail ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble text-xs ${msg.senderEmail === senderEmail ? 'bg-[#00302E] text-white' : 'bg-[#C8E46E] text-[#00302E]'}`}>
              {msg.message}
            </div>
            <div className="chat-footer opacity-50 text-[10px]">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="input input-sm input-bordered flex-1 text-xs focus:outline-none"
        />
        <button type="submit" className="btn btn-sm bg-[#C8E46E] text-[#00302E] border-none font-bold">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;