import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import  useAxiosPrivate  from '../../hooks/useAxiosPrivate';
import './SideBar.css';

const SideBar = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const logout =  async() => {
        try {
            await axiosPrivate.get('/logout', {
                withCredentials: true,
            });
            console.log('Logout reușit');
            navigate('/', {state: { from: location }, replace: true});
        } catch (err) {
            console.error('Eroare la logout: ', err);
        }
    }

    return (
        <>
        <aside className="sidebar">
            <div className="logo">FormUp</div>
            <nav className="nav-links">
                <p><Link to='/home'>Home</Link></p>
                <p><Link to='/cereri'>Cereri</Link></p>
                <p><Link to='/adeverinte'>Adeverinte</Link></p>
                <p><Link>Altceva</Link></p>
            </nav>
            <button className="sign-out" onClick={ () => logout() }>Sign Out</button>
        </aside>
        </>
    )
};

 export default SideBar;