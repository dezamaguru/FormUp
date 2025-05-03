import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';
import useLogout from "../../hooks/useLogout";

const SideBar = () => {
    const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () =>{
        await logout();
        navigate('/');
    }

    return (
        <>
        <aside className="sidebar">
            <div className="logo">FormUp</div>
            <nav className="nav-links">
                <p><Link to='/home'>Home</Link></p>
                <p><Link to='/adeverinte'>Adeverinte</Link></p>
                <p><Link to='/cereri'>Cereri</Link></p>
                <p><Link to='/inbox'>Inbox</Link></p>
            </nav>
            <button className="sign-out" onClick={ () => signOut() }>Sign Out</button>
        </aside>
        </>
    )
};

 export default SideBar;