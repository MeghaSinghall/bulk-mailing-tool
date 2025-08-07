import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Agents from '../Components/Agent';
import MailNow from '../Components/MailNow';
import BatchMail from '../Components/BatchMail';
import MailHistory from '../Components/MailHistory';
import Update from '../Components/Update';
import Logout from '../Components/Logout';
import Chat from '../Components/Generate';
import { useEffect, useState } from 'react';
import Example from '../Components/Editor';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const checkLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/verify_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.message !== 'done') {
        navigate('/login');
        return;
      }
    } catch (error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      checkLogin();
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Routes>
          <Route path="/" element={<Agents />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/mailnow" element={<MailNow />} />
          <Route path="/batch-mail" element={<BatchMail />} />
          <Route path="/mail-history" element={<MailHistory />} />
          <Route path="/update" element={<Update />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/generate-mail" element={<Chat />} />
          <Route path="/editor" element={<Example />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;