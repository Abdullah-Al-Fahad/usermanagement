import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserTable from '../components/UserTable';
import Toolbar from '../components/Toolbar';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch users');
    }
  };

  const handleSelect = (userId) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelected((prev) => (prev.length === users.length ? [] : users.map((user) => user.id)));
  };

  const handleBlock = async () => {
    try {
      await axios.post('/api/users/block', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      setSelected([]);
      toast.success('Users blocked successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to block users');
    }
  };

  const handleUnblock = async () => {
    try {
      await axios.post('/api/users/unblock', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      setSelected([]);
      toast.success('Users unblocked successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to unblock users');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post('/api/users/delete', { userIds: selected }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      setSelected([]);
      toast.success('Users deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete users');
    }
  };

  return (
    <div>
      <Toolbar onBlock={handleBlock} onUnblock={handleUnblock} onDelete={handleDelete} />
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