import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import localhost from '../localhost.jsx';
function Register() {
  const [value, setValue] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = value;

    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      toast.error('All fields are required');
      return false;
    } else if (confirmPassword !== password) {
      toast.error('Passwords do not match');
      return false;
    } else if (username.length < 3) {
      toast.error('Username must be at least 3 characters long');
      return false;
    } else if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/chat');
    }
  }, []);

  const handleChange = (event) => {
    setValue({
      ...value,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, password, username } = value;
      const { data } = await axios.post(`https://chatty-nnkp.onrender.com/api/auth/register`, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.message);
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate('/setAvatar');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="w-[90%] max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-col">
          <div className="text-center mb-6">
            <h1 className="text-2xl text-white font-bold">Register to Chatty</h1>
          </div>

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            className="p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            className="p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            className="p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
            className="p-3 mb-6 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-semibold transition duration-200"
          >
            Submit
          </button>

          <span className="text-gray-400 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
