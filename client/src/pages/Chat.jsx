import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import Contacts from '../components/Contact';
import Chatcontainer from '../components/Chatcontainer.jsx';
import localhost from '../localhost.jsx';

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile view for screen width <= 768px
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch user from localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const user = localStorage.getItem('chat-app-user');
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(JSON.parse(user));
    };

    fetchUser();
  }, [navigate]);

  // Initialize socket and emit "add-user" when currentUser is available
  useEffect(() => {
    if (currentUser) {
      socket.current = io("https://chatty-nnkp.onrender.com");
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);

  // Fetch contacts when currentUser is available
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(
            `https://chatty-nnkp.onrender.com/api/auth/allusers/${currentUser._id}`
          );
          setContacts(response.data);
          setIsLoaded(true);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

  // Change current chat
  const handleChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
      <div className="h-[90vh] w-[90vw] bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {isMobile && currentChat ? (
          // Mobile view: Show chat container only
          <Chatcontainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
        ) : (
          <>
            {/* Sidebar and Contacts */}
            <div
              className={`h-full ${
                isMobile ? (currentChat ? 'hidden' : 'w-full') : 'md:w-1/3'
              } bg-gray-900 text-white flex flex-col justify-between`}
            >
              <Contacts
                contacts={contacts}
                currentUser={currentUser}
                changeChat={handleChange}
              />
            </div>

            {/* Chat Container */}
            {!isLoaded ? (
              <div
                className={`h-full ${
                  isMobile ? 'w-full' : 'md:w-2/3'
                } flex items-center justify-center bg-gray-700`}
              >
                <p className="text-gray-300 text-2xl font-light">Loading...</p>
              </div>
            ) : currentChat === null ? (
              <div
                className={`h-full ${
                  isMobile ? 'w-full' : 'md:w-2/3'
                } flex items-center justify-center bg-gray-700`}
              >
                <p className="text-gray-300 text-2xl font-light">
                  Select a contact to start chatting ✨
                </p>
              </div>
            ) : (
              <div
                className={`h-full ${
                  isMobile ? 'w-full' : 'md:w-2/3'
                } bg-gray-700`}
              >
                <Chatcontainer
                  currentChat={currentChat}
                  currentUser={currentUser}
                  socket={socket}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
