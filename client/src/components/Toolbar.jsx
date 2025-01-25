import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock, faTrash } from '@fortawesome/free-solid-svg-icons';

const Toolbar = ({ onBlock, onUnblock, onDelete }) => {
  return (
    <ButtonGroup className="mb-3">
      <Button variant="danger" onClick={onBlock}>
        Block
      </Button>
      <Button variant="success" onClick={onUnblock}>
        <FontAwesomeIcon icon={faUnlock} />
      </Button>
      <Button variant="dark" onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </ButtonGroup>
  );
};

export default Toolbar;