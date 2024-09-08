import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login';
import UserPage from './UserPage';
import AdminPage from './AdminPage';
import MainApp from './MainApp'; // The main app component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-page" element={<UserPage/>} />
        <Route path="/admin-page" element={<AdminPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
