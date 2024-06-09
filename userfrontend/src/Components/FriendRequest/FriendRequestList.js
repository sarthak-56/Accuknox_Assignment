import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequestList = ({ token }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const token = localStorage.getItem('token')
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/friend-requests/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriendRequests(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please login again.');
        } else {
          setError('Error fetching friend requests');
        }
      }
      setLoading(false);
    };
    fetchFriendRequests();
  }, [token]);

  const handleAccept = async (friendRequestId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://127.0.0.1:8000/api/user/accept-friend-request/', 
      { friend_request_id: friendRequestId }, 
      { headers: { Authorization: `Bearer ${token}` } });
      setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== friendRequestId));
    } catch (error) {
      console.error('Error accepting friend request', error);
    }
  };

  const handleReject = async (friendRequestId) => {
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://127.0.0.1:8000/api/user/reject-friend-request/', 
      { friend_request_id: friendRequestId }, 
      { headers: { Authorization: `Bearer ${token}` } });
      setFriendRequests((prevRequests) => prevRequests.filter((request) => request.id !== friendRequestId));
    } catch (error) {
      console.error('Error rejecting friend request', error);
    }
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {friendRequests.map((friendRequest) => (
          <li key={friendRequest.id}>
            {friendRequest.from_user.name} sent you a friend request.
            <button onClick={() => handleAccept(friendRequest.id)}>Accept</button>
            <button onClick={() => handleReject(friendRequest.id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestList;
