import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import './avatar.css';
import localhost from '../localhost.jsx';
function SetAvatar() {
  const api = 'https://api.multiavatar.com';
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const setProfile = async () => {
    try {
      if (selectedAvatar === undefined) {
        toast.error('Please select an avatar.');
      } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        const response = await axios.post(
          `https://chatty-nnkp.onrender.com/api/auth/setavatar/${user._id}`,
          {
            image: avatar[selectedAvatar],
          }
        );
        if (response.data.isSet) {
          user.isAvatarImageSet = response.data.isSet;
          user.avatarImage = response.data.user.avatarImage;
          localStorage.setItem('chat-app-user', JSON.stringify(user));
          navigate('/chat');
        }
      }
    } catch (error) {
      toast.error('Failed to set avatar. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = [];
        for (let i = 0; i < 8; i++) {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
          const buffer = Buffer.from(response.data);
          data.push(buffer.toString('base64'));
        }
        setAvatar(data);
      } catch (error) {
        toast.error('Failed to load avatars. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvatars();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
      {isLoading ? (
        <h1 className="text-white text-2xl font-bold">Loading Avatars...</h1>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">Pick an Avatar</h1>
            <p className="text-gray-200 mt-2">Choose an avatar that represents you!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {avatar.map((image, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedAvatar(index)}
                  className={`cursor-pointer p-2 rounded-lg border-4 transition-transform duration-200 transform hover:scale-105
                    ${selectedAvatar === index ? 'border-white' : 'border-transparent'}`}
                >
                  <img
                    className="w-32 h-32 rounded-full"
                    src={`data:image/svg+xml;base64,${image}`}
                    alt="avatar"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={setProfile}
            className="mt-8 bg-white text-purple-600 font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-purple-600 hover:text-white transition-colors duration-300"
          >
            Set Avatar
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default SetAvatar;
