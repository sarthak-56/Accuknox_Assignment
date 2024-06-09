import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Components/Home/Home';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import FriendList from './Components/FriendList/FriendList';
import FriendRequestList from './Components/FriendRequest/FriendRequestList'
import UserSearch from './Components/Search/UserSearch';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/friends" element={<FriendList/>} />
        <Route path="/friends-request" element={<FriendRequestList/>} />
        <Route path="/search" element={<UserSearch/>} />
      </Routes>
    </Router>
  );
};


export default App;
