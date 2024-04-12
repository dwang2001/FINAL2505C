import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { AccessTime, Search, Clear } from '@mui/icons-material';


function Reset() {
  const navigate = useNavigate();
  const [icnumber, seticnumber] = useState('');
  const randomPassword = Math.random().toString(36).slice(-8);
  
  
  const handleResetPassword = async () => {

    // Fetch user's email using axios

   
    try {
      const response = await http.get(`http://localhost:3001/general?search=${icnumber}`);
      const data = response.data;  
      const email = data[0].email

      console.log(data[0])

      const updatedData1 = {
        ...data[0],
        randomPassword, 
        };
                   
      await http.post('http://localhost:3001/general/reset-password', updatedData1);
      alert('Password reset email sent successfully.');
      
      await http.get(`http://localhost:3001/general/searchid?email=${email}`)
  .then((res) => {
    const userId = Array.isArray(res.data) ? res.data[0].id : res.data.id;
    const updatedData = {
      tempPassword: randomPassword,
    };
    http.put(`http://localhost:3001/general/reset/${userId}`, updatedData)
      .then((res) => {
        console.log(res.data);
        
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  });
     
    alert(`Temporary password has been sent to your email ${email}.`); 
    } catch (error) {
      console.error('Error sending email to reset password:', error);
      alert('Error sending email to reset password. Please ensure that your IC number is correct or verify your email address with our staff.');
    }

    
  };




  return (
    <Box sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  }}>.
      <h1 className="welcome-message">Password Reset</h1>
      <h3 className="welcome-message3">Please enter your IC number to reset your password. Check your email for the temporary password.</h3>
      <Box sx={{ mt: 2}}>
      <input 
        type="icnumber" 
        value={icnumber} 
        onChange={(e) => seticnumber(e.target.value)} 
        placeholder="IC number"
        style={{ height: '40px', width:'300px', fontSize: '18px' }} // Adjust the height value as need required 
/>
          <br />
          <br />
          <button 
            style={{ height: '40px', margin: 'auto', display: 'block', fontSize: '18px' }} 
            fullwidth="true"
            variant="contained" 
            type="button" 
            onClick={handleResetPassword}>
            Reset
          </button>
      </Box>
  
   
  </Box>
);
 
};

export default Reset;
