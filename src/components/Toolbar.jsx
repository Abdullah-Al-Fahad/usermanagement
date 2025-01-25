import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faTrash, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Toolbar.css'; // Import the updated CSS

const Toolbar = ({ onBlock, onUnblock, onDelete, onLogout, currentUser }) => {
  return (
    <div className="toolbar-container">
      {/* Action Buttons (Block, Unblock, Delete) */}
      <ButtonGroup className="action-buttons">
        <Button variant="danger" onClick={onBlock} className="toolbar-button">
          <FontAwesomeIcon icon={faLock} /> Block
        </Button>
        <Button variant="success" onClick={onUnblock} className="toolbar-button">
          <FontAwesomeIcon icon={faUnlock} /> Unblock
        </Button>
        <Button variant="dark" onClick={onDelete} className="toolbar-button">
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
      </ButtonGroup>

      {/* User Info and Logout Button */}
      <div className="user-logout-section">
        {/* User Name */}
        <div className="user-info">
          {currentUser ? (
            <>
              
              <span className="user-name">Welcome, {currentUser.name}</span>
            </>
          ) : (
            <span>Loading user data...</span>
          )}
        </div>

        {/* Logout Button */}
        <Button variant="warning" onClick={onLogout} className="toolbar-button logout-button">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;