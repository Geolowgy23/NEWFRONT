import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.module.css'; // Import the CSS file

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect if token is missing
    } else {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setName(response.data.name);
          setAddress(response.data.address);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('Failed to fetch profile data. Please log in again.');
          navigate('/login'); // Redirect to login if error occurs
        }
      };
      fetchProfileData();
    }
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put('http://localhost:5000/api/profile/update', {
        name,
        address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.response?.data || 'Unknown error occurred'}`);
    }
  };

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <h2>Profile</h2>
        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="profileForm">
            <div className="formField">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profileInput"
                required
              />
            </div>
            <div className="formField">
              <label>Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="profileInput"
                required
              />
            </div>
            <button type="submit" className="submitButton">Update Profile</button>
          </form>
        ) : (
          <div className="profileDetails">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Address:</strong> {address}</p>
            <button onClick={() => setIsEditing(true)} className="editButton">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}
