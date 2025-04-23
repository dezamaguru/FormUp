import { Link } from "react-router-dom";
import  useAxiosPrivate  from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

function SecretarRole() {
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
        <div>
            <h2>Secretary Dashboard</h2>
            <li><Link to="/users">View Users</Link></li>
            <li><Link to='/adeverinte'>Adeverinte</Link></li>
            <br/>
            <br/>
            <button onClick={() => logout()}>Log out</button>
        </div>
    );
}

export default SecretarRole;