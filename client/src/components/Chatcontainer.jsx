import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import localhost from "../localhost.jsx";
function Chatcontainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  // Fetch messages when currentChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat && currentUser) { // Ensure currentChat and currentUser are not null
        try {
          const response = await axios.get(
            `${localhost}/api/message/getallmessage`,
            {
              params: {
                from: currentUser._id, 
                to: currentChat._id, 
              },
            }
          );
          setMessages(response.data); 
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  // Send message handler
  const handleSendMsg = async (msg) => {
    if (!currentChat || !currentUser) return; // Ensure currentChat and currentUser are defined
    try {
      await axios.post(`${localhost}/api/message/addmessage`, {
        from: currentUser._id, // Current user's ID
        to: currentChat._id, // Recipient's user ID
        message: msg, // Message content
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({
        fromSelf: true,
        message: msg,
      });
      setMessages(msgs);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (data) => {
        
        setArrivalMessage({ fromSelf: false, message: data });
      });      
    }
  }, [socket]);

  // Append the arrival message to the messages state
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && currentUser ? ( // Ensure currentChat and currentUser exist before rendering
        <div className="h-full w-full flex flex-col bg-gray-700">
          {/* Chat Header */}
          <div className="chat-header bg-gray-800 px-5 py-3 flex items-center gap-4 border-b border-gray-700">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                alt="currentuserimage"
                className="w-14 h-14 rounded-full border-2 border-purple-500"
              />
            </div>
            <div className="username">
              <h3 className="text-xl text-white font-semibold">
                {currentChat.username}
              </h3>
            </div>
          </div>

          {/* Chat Messages Section */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.fromSelf ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`message max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                    msg.fromSelf
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.fromSelf ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>

          {/* Chat Input Section */}
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h2 className="text-white">Select a chat to start messaging.</h2>
        </div>
      )}
    </>
  );
}

export default Chatcontainer;
