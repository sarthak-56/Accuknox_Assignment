import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FriendList.css'

const FriendList = ({ token }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
        const token = localStorage.getItem('token')
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/friends/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching friends');
        }
      }
      setLoading(false);
    };
    fetchFriends();
  }, [token]);

  return (
    <div>
      <h2>Your Friends</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;
