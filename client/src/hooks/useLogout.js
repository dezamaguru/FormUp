import axios from '../api/axios';
import useAuth from './useAuth';
import useAxiosPrivate from "./useAxiosPrivate";

const useLogout = () => {
    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const deleteFCMToken = async () => {
        try {
            await axiosPrivate.post('/users/fcm-token/delete');
        } catch {
            console.log("Eroare la stergerea fcm tokenului");
        }
    }

    const logout = async () => {
        try {
            const response = await axios('/logout', {
                headers: {
                    Authorization: `Bearer ${auth?.accessToken}`
                },
                withCredentials: true
            });

            deleteFCMToken();
        } catch (err) {
            console.error(err);
        } finally {
            setAuth({});
        }
    }

    return logout;
}

export default useLogout;