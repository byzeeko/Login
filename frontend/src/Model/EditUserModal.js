import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element to enable screen reader accessibility

const EditUsernameModal = ({ isOpen, onRequestClose, onEditUser, userRole , editUserError}) => {
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');



  const handleEdit = () => {
    onEditUser(newUsername, newEmail, selectedRole);
    setNewUsername('');
    setNewEmail('');
    setSelectedRole('');
    console.log(newUsername);
    console.log(newEmail);
    console.log(selectedRole);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit User Modal"
    >
          {editUserError && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error editing user: {editUserError.response ? editUserError.response.data.message : editUserError.message}
        </div>
      )}
      <h2>Edit User</h2>
      <label>Username:</label>
      <input
        type="text"
        placeholder="Enter the new username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <label>Email:</label>
      <input
        type="text"
        placeholder="Enter the new email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />

      
         {/* Conditionally render role-related components only if userRole is 'admin' */}
      {userRole === 'admin' && (
        <div>
          <label>Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      )}
      

      <button onClick={handleEdit}>Save</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default EditUsernameModal;
