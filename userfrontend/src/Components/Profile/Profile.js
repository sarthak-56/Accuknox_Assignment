import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Profile.css'

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchProfile();
  }, []);

  if (!profileData) return <div>Loading...</div>;

  return (
    <div>
      <div class="profile">
        <h1>Profile</h1>
        <div class="p">
          <p>Email: {profileData.email}</p>
          <p>Name: {profileData.name}</p>
        </div>
        <div class="friend">
          <Link to="/friends"><h3>Friends</h3></Link> {/* Use Link to redirect to /friends */}
          <Link to="/friends-request"><h3>Friends Request</h3></Link>
          <Link to="/search"><h3>Search friends</h3></Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
