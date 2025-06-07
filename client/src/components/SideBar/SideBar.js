import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';
import useLogout from "../../hooks/useLogout";
import useAuth from '../../hooks/useAuth';

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
                    <p><Link to='/home'>Home</Link></p>
                    <p><Link to='/adeverinte'>Adeverinte</Link></p>
                    <p><Link to='/cereri'>Cereri</Link></p>
                    <p><Link to='/inbox'>Inbox</Link></p>
                    {auth?.type === "secretar" && (
                        <p><Link to='/dashboard'>Dashboard</Link></p>
                    )}
                </nav>
                <button className="sign-out" onClick={() => signOut()}>Sign Out</button>
            </aside>
        </>
    )
};

export default SideBar;