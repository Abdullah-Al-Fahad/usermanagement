import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import UserTable from '../components/UserTable';
import Toolbar from '../components/Toolbar';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Initialize Socket.IO
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io('https://usermanagement-hz1w.onrender.com', {
      auth: {
        token,
      },
    });

    // Debugging: Log connection status
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      if (error.message === 'Authentication error') {
        console.error('Authentication failed, reconnecting...');
        socket.auth.token = localStorage.getItem('token');
        socket.connect();
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Listen for real-time updates
    socket.on('usersUpdated', ({ action, userIds }) => {
      console.log('Received usersUpdated event:', { action, userIds }); // Debug log
      if (!action || !userIds || !Array.isArray(userIds)) {
        console.error('Invalid usersUpdated event data:', { action, userIds });
        return;
      }

      setUsers((prevUsers) => {
        if (action === 'delete') {
          return prevUsers.filter((user) => !userIds.includes(user.id));
        } else {
          return prevUsers.map((user) =>
            userIds.includes(user.id)
              ? { ...user, status: action === 'block' ? 'blocked' : 'active' }
              : user
          );
        }
      });
    });

    // Clean up the socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetchUsers();
  }, []);

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      console.log('Fetching users from the server...'); // Debug log
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Users fetched successfully:', response.data); // Debug log
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error); // Debug log
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    }
  };

  // Handle user selection
  const handleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Handle select all users
  const handleSelectAll = () => {
    setSelected((prev) => (prev.length === users.length ? [] : users.map((user) => user.id)));
  };

  // Handle block users
  const handleBlock = async () => {
    try {
      console.log('Blocking users with IDs:', selected); // Debug log
      const response = await axios.post(
        '/api/users/block',
        { userIds: selected },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 400) {
        // Handle the case where no active users were selected
        toast.warning(response.data.message);
      } else {
        setSelected([]);
        toast.success('Users blocked successfully');
      }
    } catch (error) {
      console.error('Error blocking users:', error); // Debug log
      if (error.response?.status === 400) {
        // Display the backend's specific message for no active users
        toast.warning(error.response.data.message);
      } else {
        toast.error(error.response?.data?.error || 'Failed to block users');
      }
    }
  };

  // Handle unblock users
  const handleUnblock = async () => {
    try {
      console.log('Unblocking users with IDs:', selected); // Debug log
      const response = await axios.post(
        '/api/users/unblock',
        { userIds: selected },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 400) {
        // Handle the case where no blocked users were selected
        toast.warning(response.data.message);
      } else {
        setSelected([]);
        toast.success('Users unblocked successfully');
      }
    } catch (error) {
      console.error('Error unblocking users:', error); // Debug log
      if (error.response?.status === 400) {
        // Display the backend's specific message for no blocked users
        toast.warning(error.response.data.message);
      } else {
        toast.error(error.response?.data?.error || 'Failed to unblock users');
      }
    }
  };
  
  // Handle delete users
  const handleDelete = async () => {
    try {
      console.log('Deleting users with IDs:', selected); // Debug log
      await axios.post(
        '/api/users/delete',
        { userIds: selected },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSelected([]);
      toast.success('Users deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error); // Debug log
      toast.error(error.response?.data?.error || 'Failed to delete users');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div>
      <Toolbar
        onBlock={handleBlock}
        onUnblock={handleUnblock}
        onDelete={handleDelete}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      <UserTable
        users={users}
        selected={selected}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
};

export default AdminPanel;