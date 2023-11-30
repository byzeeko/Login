import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import EditUsernameModal from './Model/EditUserModal';
import { Table, Button } from 'react-bootstrap';

// ... (existing imports)

function Dashboard() {
  const { checkToken, refreshToken, isAuthenticated, userData } = useAuth();
  const [editUserError, setEditUserError] = useState(null); // State variable to hold the error
  const [userLogs, setUserLogs] = useState([]);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUserLogs = async () => {
    try {
      const response = await axios.get('http://localhost:1313/getAllLogs');
      setUserLogs(response.data);
    } catch (error) {
      console.error('Error fetching user logs:', error);
    }
  };

  const handleCheckTokenClick = () => {
    checkToken();
    refreshToken();
  };

  useEffect(() => {
    handleCheckTokenClick();
    // Fetch user logs when the component mounts
    fetchUserLogs();
  }, []);

  const editUser = async (userId) => {
    setSelectedUserId(userId);
    setIsEditUserModalOpen(true);
  };

  const handleEditUser = async (newUsername, newEmail, selectedRole) => {
    try {
      // Assuming you have an endpoint to handle both username and email editing
      const response = await axios.put(
        `http://localhost:1313/editUser/${selectedUserId}`,
        {
          newUsername,
          newEmail,
          selectedRole,
        }
      );
      console.log(response.data);
      // Refresh user logs after editing the user
      fetchUserLogs();
      setEditUserError(null);
      // Close the modal
      setIsEditUserModalOpen(false);
    } catch (error) {
      console.error('Error editing user:', error.response ? error.response.data.message : error.message);
      setEditUserError(error); // Store the error in the state variable
     
    }
  };

  return (
    <div>
    
    
    

      {isAuthenticated && userData && (
        <>
          {userData.role === 'admin' && (
            <div>
              <h2>User Logs:</h2>
              <ul>
                {userLogs.map((user) => (
                  <li key={user.id}>
                    ID: {user.id}, Username: {user.username}, Email: {user.email}, Created At: {user.createdAt}, Role: {user.role}
                    <button onClick={() => editUser(user.id)}>Edit User</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleCheckTokenClick}>Check Token</button>
            </div>
          )}

{userData.role === 'user' && (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h2>Your Identifiers:</h2>
          <Table striped bordered hover className="w-75">
            <tbody>
              <tr className='text-center'>
                <td >ID</td>
                <td >{userData.id}</td>
              </tr>
              <tr className='text-center'> 
                <td >Username</td>
                <td> {userData.username}</td>
              </tr>
              <tr className='text-center'>
                <td >Email</td>
                <td > {userData.email}</td>
              </tr >
              <tr className='text-center'>
                <td>Created At</td>
                <td>{userData.createdAt}</td>
              </tr>
              <tr className='text-center'>
                <td>Role</td>
                <td>{userData.role}</td>
              </tr>
            </tbody>
          </Table>
          <Button variant="primary" onClick={() => editUser(userData.id)}>
            Edit User
          </Button>
        </div>
      )}
    
  


          <EditUsernameModal
            isOpen={isEditUserModalOpen}
            onRequestClose={() => setIsEditUserModalOpen(false)}
            onEditUser={handleEditUser}
            userRole={userData.role}
            editUserError={editUserError}
           
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;