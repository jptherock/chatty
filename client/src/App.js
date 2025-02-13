
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/' element={<Register/>} />
    <Route path="/setAvatar" element={<SetAvatar />} />
    <Route path="/register" element={<Register />} /> 
    <Route path="/login" element={<Login />} />
    <Route path="/chat" element={<Chat />} />
  </Routes>
  </BrowserRouter>
}

export default App;
