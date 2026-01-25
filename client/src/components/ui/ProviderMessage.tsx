import React, { useState } from "react";
import { X, Search, MessageCircle, Briefcase, Send, ArrowLeft } from "lucide-react";
import { searchConversations } from "../../services/messagesAPI";

// Types
interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  isSent: boolean; // true if sent by current user
}

interface Conversation {
  id: number;
  userId: number;
  userName: string;
  userType: "provider" | "seeker";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

interface MessagingSystemProps {
  userType: "provider" | "seeker";
}

// Dummy conversations for seekers
const providerConversations: Conversation[] = [
  {
    id: 1,
    userId: 101,
    userName: "Sarah Johnson",
    userType: "seeker",
    lastMessage: "Hi! I'm interested in your web development service.",
    timestamp: "2 min ago",
    unreadCount: 3,
    messages: [
      { id: 1, senderId: 101, senderName: "Sarah Johnson", message: "Hello! I saw your web development service.", timestamp: "10:30 AM", isSent: false },
      { id: 2, senderId: 0, senderName: "You", message: "Hi Sarah! Thanks for reaching out.", timestamp: "10:32 AM", isSent: true },
    ],
  },
  {
    id: 2,
    userId: 102,
    userName: "Michael Brown",
    userType: "seeker",
    lastMessage: "Hi! I'm interested in your web development service.",
    timestamp: "2 min ago",
    unreadCount: 3,
    messages: [
      { id: 1, senderId: 101, senderName: "Sarah Johnson", message: "Hello! I saw your web development service.", timestamp: "10:30 AM", isSent: false },
      { id: 2, senderId: 0, senderName: "You", message: "Hi Sarah! Thanks for reaching out.", timestamp: "10:32 AM", isSent: true },
    ],
  },
  {
    id: 3,
    userId: 102,
    userName: "Michael Brown",
    userType: "seeker",
    lastMessage: "Hi! I'm interested in your web development service.",
    timestamp: "2 min ago",
    unreadCount: 3,
    messages: [
      { id: 1, senderId: 101, senderName: "Sarah Johnson", message: "Hello! I saw your web development service.", timestamp: "10:30 AM", isSent: false },
      { id: 2, senderId: 0, senderName: "You", message: "Hi Sarah! Thanks for reaching out.", timestamp: "10:32 AM", isSent: true },
    ],
  },
  // add more provider conversations as needed
];

// Main Messaging Component
export const Message: React.FC<MessagingSystemProps> = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const conversations = userType === "provider" ? providerConversations : [];
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleConversationClick = (conversation: Conversation) => setSelectedConversation(conversation);
  const handleBackToList = () => setSelectedConversation(null);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-40 transition-all duration-300"
        style={{ backgroundColor: "#FFA500" }}
      >
        <div className="relative">
          <MessageCircle size={28} className="text-white" />
          {totalUnread > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#ff4444" }}>
              {totalUnread > 9 ? "9+" : totalUnread}
            </div>
          )}
        </div>
      </button>

      {/* Conversation List */}
      {isOpen && !selectedConversation && (
        <ConversationList
          userType={userType}
          conversations={conversations}
          onClose={() => setIsOpen(false)}
          onSelectConversation={handleConversationClick}
        />
      )}

      {/* Chat Window */}
      {isOpen && selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          userType={userType}
          onBack={handleBackToList}
          onClose={() => {
            setIsOpen(false);
            setSelectedConversation(null);
          }}
        />
      )}
    </>
  );
};

// Conversation List
const ConversationList: React.FC<{
  userType: "provider" | "seeker";
  conversations: Conversation[];
  onClose: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}> = ({ userType, conversations, onClose, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      console.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const data = await searchConversations(user.id, term);

      setFilteredConversations(
        data.map((c: any) => ({
          id: c.userId,
          userId: c.userId,
          userName: c.userName,
          userType: c.userType.toLowerCase(),
          lastMessage: c.lastMessage || "No messages yet",
          timestamp: c.timestamp
            ? new Date(c.timestamp).toLocaleTimeString()
            : "",
          unreadCount: Number(c.unreadCount),
          messages: []
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="rounded-t-2xl p-5 sm:p-6" style={{ backgroundColor: "#FFA500" }}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Messages</h2>
                <p className="text-white text-opacity-90 text-xs sm:text-sm mt-1">Chat with service providers</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 sm:p-5 border-b border-gray-200" style={{ backgroundColor: "#F8FFE5" }}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5" style={{ color: "#FFA500" }} />
            </div>
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border-2 border-gray-200 pl-11 pr-4 py-3 rounded-lg outline-none text-sm sm:text-base"
              onFocus={(e) => { e.target.style.borderColor = "#FFA500"; e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {loading && (
          <p className="text-center text-sm text-gray-500 py-4">
            Searching conversations...
          </p>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <MessageCircle size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map(conv => (
                <ConversationItem key={conv.id} conversation={conv} userType={userType} onClick={() => onSelectConversation(conv)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Conversation Item
const ConversationItem: React.FC<{ conversation: Conversation; userType: "provider" | "seeker"; onClick: () => void }> = ({ conversation, onClick }) => {
  return (
    <div className="p-4 sm:p-5 hover:bg-gray-50 cursor-pointer transition-all duration-200" onClick={onClick}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F8FFE5" }}>
          <Briefcase size={24} style={{ color: "#FFA500" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{conversation.userName}</h3>
            <span className="text-xs text-gray-500 flex-shrink-0">{conversation.timestamp}</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm truncate">{conversation.lastMessage}</p>
        </div>
        {conversation.unreadCount > 0 && (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FFA500" }}>
            <span className="text-white font-bold text-xs sm:text-sm">{conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Window
const ChatWindow: React.FC<{ conversation: Conversation; userType: "provider" | "seeker"; onBack: () => void; onClose: () => void }> = ({ conversation, onBack, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: messages.length + 1,
      senderId: 0,
      senderName: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="rounded-t-2xl p-4 sm:p-5" style={{ backgroundColor: "#FFA500" }}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"><ArrowLeft size={24} /></button>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F8FFE5" }}>
              <Briefcase size={20} style={{ color: "#FFA500" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{conversation.userName}</h2>
              <p className="text-white text-opacity-90 text-xs">Online</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"><X size={24} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" style={{ backgroundColor: "#F8FFE5" }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] sm:max-w-[60%] rounded-2xl px-4 py-3 ${msg.isSent ? "rounded-br-none" : "rounded-bl-none"}`}
                style={{ backgroundColor: msg.isSent ? "#FFA500" : "#ffffff", color: msg.isSent ? "#ffffff" : "#374151", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <p className="text-sm sm:text-base break-words">{msg.message}</p>
                <p className={`text-xs mt-1 ${msg.isSent ? "text-white text-opacity-80" : "text-gray-500"}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 border-2 border-gray-200 px-4 py-3 rounded-full outline-none text-sm sm:text-base"
              onFocus={(e) => { e.target.style.borderColor = "#FFA500"; e.target.style.boxShadow = "0 0 0 3px rgba(255, 165, 0, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
            />
            <button onClick={handleSendMessage} className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{ backgroundColor: "#FFA500" }}>
              <Send size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Message;