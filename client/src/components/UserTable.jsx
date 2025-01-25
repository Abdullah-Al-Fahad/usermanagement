import React from 'react';
import { Table } from 'react-bootstrap';

const UserTable = ({ users, selected, onSelect, onSelectAll }) => {
  return (
    <Table striped bordered hover responsive>
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
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.includes(user.id)}
                onChange={() => onSelect(user.id)}
              />
            </td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.lastLogin).toLocaleString()}</td>
            <td className={user.status === 'active' ? 'text-success' : 'text-danger'}>
              {user.status}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;