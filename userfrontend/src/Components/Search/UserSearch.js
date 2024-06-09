import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSearch.css';

const UserSearchAndFriendRequest = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [friends, setFriends] = useState([]);


  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
  
        const response = await axios.get('http://127.0.0.1:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
  
    fetchFriends();
  }, []);
  

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/user/search/?q=${searchKeyword}`);
      setUsers(response.data);
    } catch (err) {
      setError('Error fetching users');
    }
    setLoading(false);
  };

  const handleSendRequest = async (userId) => {
    setIsSending(true);
    setError('');

    if (friends.some((friend) => friend.id === userId)) {
      setError('User is already a friend');
      return;
    }

    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found in localStorage');
        setIsSending(false);
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/user/send-friend-request/',
        { to_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(response.data.msg);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || 'You can not send request multiple times to one user');
      } else if (error.request) {
        setError('No response received from server');
      } else {
        setError(error.message);
      }
    }
    setIsSending(false);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search for users by name or email"
        />
        <button onClick={handleSearch}>Search</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => handleSendRequest(user.id)} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Request'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearchAndFriendRequest;
