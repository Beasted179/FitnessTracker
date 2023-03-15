import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { getUserData } from '../api';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
const Profile = () => {
  const [token, setToken] = useOutletContext();
  console.log(token)
  const navigate = useNavigate()
  if (!token) {
    return (
      navigate('/login')
    );
  } else {
    return (
        <Box m={2}>
          <Typography variant="h4" component="h1" gutterBottom>{localStorage.getItem('username')}'s Profile</Typography>
          <Typography variant="body1" gutterBottom>User ID: {localStorage.getItem('id')}</Typography>
          <Typography variant="body1" gutterBottom>Username: {localStorage.getItem('username')}</Typography>
        </Box>
      );

  }

  
};

export default Profile;