import { useNavigate } from 'react-router-dom';
import './SideBar.css';
import useLogout from "../../hooks/useLogout";
import useAuth from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const { auth } = useAuth();

    const signOut = async () => {
        await logout();
        navigate('/');
    }

    return (
        <>
            <aside className="sidebar">
                <div className="logo">FormUp</div>
                <nav className="nav-links">
                    {(auth?.type === "secretar" || auth?.type === "student") && (
                        <>
                            <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
                            <NavLink to="/adeverinte" className={({ isActive }) => isActive ? "active-link" : ""}>Adeverinte</NavLink>
                            <NavLink to="/cereri" className={({ isActive }) => isActive ? "active-link" : ""}>Cereri</NavLink>
                            <NavLink to="/inbox" className={({ isActive }) => isActive ? "active-link" : ""}>Inbox</NavLink>
                        </>
                    )}

                    {auth?.type === "secretar" && (
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>Dashboard</NavLink>
                    )}

                    {auth?.type === "admin" && (
                        <>
                            <NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}>Utilizatori</NavLink>
                            <NavLink to="/adduser" className={({ isActive }) => isActive ? "active-link" : ""}>Adaugă Utilizator</NavLink>
                        </>
                    )}
                </nav>
                <button className="sign-out" onClick={() => signOut()}>Sign Out</button>
            </aside>
        </>
    )
};

export default SideBar;