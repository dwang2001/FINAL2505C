// src/App.js
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { AccessTime, Search, Clear } from '@mui/icons-material';


function ChangePassword() {
  const location = useLocation();
    
  const { user, details } = useContext(UserContext);
  const navigate = useNavigate();
  
  
  const [fullPassword, setfullPassword] = useState('');

  
  const handleChangePassword = async () => {
    try {
      const response = await http.put(`http://localhost:3001/general/change/${user.id}`, { fullPassword,tempPassword: null });
      alert('Your password has been updated.');
    } catch (error) {
      console.error('Error trying to change password:', error);
      alert('Error trying to change password. Please ensure your current password is correct.');
    }
  };
  
 


  return (
                     
    
        
    <Box sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  }}>.
      
      <h4 className="welcome-message">Change Password</h4>
      
      <Box sx={{ mt: 2}}>

          <br />
          <br />
          <input 
        type="fullPassword" 
        value={fullPassword} 
        onChange={(e) => setfullPassword(e.target.value)} 
        placeholder="New Password"
        style={{ height: '40px', width:'300px', fontSize: '18px' }} // Adjust the height value as need required 
/>
          <br />
          <br />
          <button 
            style={{ height: '40px', margin: 'auto', display: 'block', fontSize: '18px' }} 
            fullwidth="true"
            variant="contained" 
            type="button" 
            onClick={handleChangePassword}>
            Change
          </button>
      </Box>
  </Box>
);
 
};

export default ChangePassword;
