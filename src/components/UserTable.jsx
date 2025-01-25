import React from 'react';
import './UserTable.css'; // Custom CSS for styling

const UserTable = ({ users, selected, onSelect, onSelectAll }) => {
  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === users.length && users.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={selected.includes(user.id) ? 'selected-row' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  onChange={() => onSelect(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
              <td>{new Date(user.registrationTime).toLocaleString()}</td>
              <td>
                <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;