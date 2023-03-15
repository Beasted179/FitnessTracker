import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';

const NavBar = ({token, setToken}) => {
    const navigate = useNavigate()

    function logOut(){ 
        localStorage.removeItem('username')
        localStorage.removeItem('saved_token')
        localStorage.removeItem('id')
        setToken('')
        navigate('/login')
    }

    return (
        <nav className="nav-links">
            <Breadcrumbs >
                <Link to='/'>Home</Link>
                {token && <Link to='Activities'>Activities</Link>}
                {!token && <Link to='Register'>Register</Link>}
                {token && <Link to='Profile'>Profile</Link>}
                {!token && <Link to='Login'>Login</Link>}
                {token && <Button onClick={logOut}>Logout</Button>}
            </Breadcrumbs>
        </nav>
    )
}

export default NavBar