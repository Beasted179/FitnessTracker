import NavBar from "../components/NavBar"
import {Outlet} from 'react-router-dom'
import { useState } from "react"

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const Home = () => {
    const [token, setToken] = useState(localStorage.getItem("saved_token"));
    return (
    <div>
        <header>
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography margin={1} variant="h6" gutterBottom>FitnessTracker</Typography>
                <NavBar token = {token} setToken = {setToken}/>
            </Stack>
        </header>
        <main>
            <Outlet context={[token, setToken]}/>
        </main>
    </div>
    
    
)

}

export default Home