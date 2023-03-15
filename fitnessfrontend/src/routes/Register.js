import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {registerUser} from '../api';
import Button from '@mui/material/Button';
import  TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid'


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useOutletContext();
    //console.log(setToken);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
   async function submitRegistration() {   
       if (!username) {
           setErrorMessage("Username required.");
       } else if (password.length < 8){
           setErrorMessage("Password needs to be at least 8 characters.")
       } else if (password !== confirmPassword) {
           setErrorMessage("Passwords must match.")
       } else {
           setErrorMessage("");
           const user = {
                   username,
                   password,
           }
           
           const response = await registerUser(user);
           console.log(response)
           if (response.error) {
               setErrorMessage(response.message);
           } else {
               localStorage.setItem('token', response.token);
               setToken(response.token);
               navigate('Profile')
           }
       }
   }
   return (
   <section className="registerCss">
       
       <Grid sx={{display:'flex', justifyContent: 'center' }}>
            
            <Box sx={{display:'flex', width:'25ch',flexDirection:'column', alignItems:'center'}}>
            <h1 className="registerTitle">Register</h1>
            <TextField
                
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
            />
           <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
            />
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
            />
            
           <Button onClick={() => {submitRegistration()}}type="submit" variant="contained" color="primary" margin ="normal" >Register</Button>
           <p>{errorMessage}</p>
       </Box>
       </Grid>
   </section>
   )     
}

export default Register; 