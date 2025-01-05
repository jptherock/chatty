import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (msg.trim() !== "") {
      handleSendMsg(msg); // Pass the message to the parent
      setMsg(""); // Clear the input
    }
  };

  return (
    <div className="relative w-full bg-gray-800 p-4 border-t border-gray-700 flex items-center gap-3">
      {/* Emoji Picker Toggle */}
      <div className="relative">
        <BsEmojiSmileFill
          onClick={handleEmojiPicker}
          className="text-2xl text-gray-300 cursor-pointer hover:text-purple-500"
        />
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10">
            <Picker
              onEmojiClick={handleEmojiClick}
              disableAutoFocus={true}
              native
              theme="dark"
            />
          </div>
        )}
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="flex-1 bg-gray-900 text-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Send Button */}
      <button
        onClick={handleSubmit}
        className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center"
      >
        <IoMdSend className="text-xl" />
      </button>
    </div>
  );
}

export default ChatInput;
