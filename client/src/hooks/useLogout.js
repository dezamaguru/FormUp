import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
    const { auth, setAuth } = useAuth();
    
    const logout = async () => {
        try {
            const response = await axios('/logout', {
                headers: {
                    Authorization: `Bearer ${auth?.accessToken}`
                },
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        } finally {
            setAuth({});
        }
    }

    return logout;
}

export default useLogout;