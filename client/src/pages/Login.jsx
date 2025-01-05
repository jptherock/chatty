import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import localhost from '../localhost.jsx';
function Login() {
  const [value, setValue] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/chat');
    }
  }, []);

  const navigate = useNavigate();

  const handleValidation = () => {
    const { email, password } = value;
    if (email === '' || password === '') {
      toast.error('All fields are required');
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValue({
      ...value,
      [event.target.name]: event.target.value,
    });
  
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (handleValidation()) {
        const { email, password } = value;
        const { data } = await axios.post(`${localhost}/api/auth/login`, {
          email,
          password,
        });
        const response = data.status;
        if (!response) {
          toast.error(data.message);
        }
        if (response) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.Usercheck));
          navigate('/chat');
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-black to-purple-600">
      <form
        onSubmit={(event) => handleSubmit(event)}
        className="bg-black p-8 rounded-lg shadow-white shadow-lg w-full max-w-md flex flex-col items-center "
      >
        <div className="brand mb-8 text-center">
          <img
            src="https://drive.google.com/uc?export=view&id=1gjfMnwTSwVEcOwFoVxJVn3xq3L3vkMXl"
                    alt="hello welcome to chatty"
            className="rounded-3xl w-16 h-16 mx-auto mb-2"
          />
          <h1 className="text-xl text-fuchsia-100 font-bold"> Login into Chatty</h1>
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
          className="w-full p-3 mb-6 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition duration-200"
        >
          Submit
        </button>

        <span className="text-gray-400 mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
