import React, { useState, useEffect } from 'react';
import './custom.css'
function Contact({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  
  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      {currentUserImage && currentUserName && (
        <div className="container mx-auto h-full flex flex-col">
          {/* Brand Section */}
          <div className="brand flex justify-center items-center py-5 border-b border-gray-700">
            <h3 className="text-2xl font-bold tracking-wider text-purple-500 uppercase">
              Chatty
            </h3>
          </div>

          {/* Contacts Section */}
          <div className="contacts flex-1 overflow-y-auto border-gray-900 custom-scrollbar focus-within:bg-black">
            {contacts.map((contact, index) => (
              <div
              className={`contact flex items-center gap-4 p-3 border-[1px] mx-[1px] border-black cursor-pointer transition-all ${
                index === currentSelected
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              key={index}
              tabIndex={0} // Makes the div focusable
              onClick={() => changeCurrentChat(index, contact)}
            >
              <div className="avatar flex-shrink-0">
                <img
                  src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                  alt="contact-Image"
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                />
              </div>
              <button className="text-lg font-semibold">{contact.username}</button>
            </div>
            
            ))}
          </div>

          {/* Current User Section */}
          <div className="current-user py-5 border-t border-gray-700 flex justify-between items-center">
            <div className="avatar flex items-center gap-4 ml-3"
            tabIndex={0}>
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="currentuserimage"
                className="w-14 h-14 rounded-full border-2 border-purple-500"
              />
              <button className="text-lg font-semibold">{currentUserName}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
