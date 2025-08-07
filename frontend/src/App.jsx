import { useEffect, useState } from 'react';
import Landing from './Pages/Landing';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import LoginSignupPage from './Pages/Login';
import { useNavigate } from 'react-router-dom';


function App() {
 

  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginSignupPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

      </Routes>
    </div>
  );
}

export default App;