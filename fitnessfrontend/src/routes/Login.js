import { useState, useEffect } from 'react';
 import { loginUser } from '../api';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import  TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useOutletContext();
    const navigate = useNavigate();
    async function submitLogin() {
        const user = {
                username,
                password
        }
        console.log(user)
         const response = await loginUser(user);
        if (response.error) {
            setErrorMessage(response.message);
        } else {
            localStorage.setItem('token', response.token)
            localStorage.setItem('id', response.user.id)
            localStorage.setItem('username', response.user.username)
            setToken(response.token);
            
            navigate('/Profile')
        }
    }
    
    return (
    <section className="registerCss">
         <Grid sx={{display:'flex', justifyContent: 'center' }}>
            
            <Box sx={{display:'flex', width:'25ch',flexDirection:'column', alignItems:'center'}}>
            <h1 className="Login">Login</h1>
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
           <Button onClick={() => {submitLogin()}}type="submit" variant="contained" color="primary" margin ="normal" >Login</Button>
           <p>{errorMessage}</p>
       </Box>
       </Grid>
    </section>
    )     
};

export default Login; 