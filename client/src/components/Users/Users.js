import {  useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import axios from "../../api/axios";
//import useRefreshToken from "../../hooks/useRefreshToken";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState();
    //const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate(); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController(); 

        const getUsers = async () => {
            try{
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                console.log(response.data); 
                isMounted && setUsers(response.data);
            }   catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request canceled:', error.message); // Handle cancellation gracefully
                } else {
                    console.error(error.response.data);
                        navigate('/', { state: { from: location }, replace: true });
                    }
                }         
        };

        getUsers();

        return () =>{
            isMounted = false;
            controller.abort(); 
        }
    },[axiosPrivate, navigate, location]);

    return (
        <article>
        <h2>Users List</h2>
        {users?.length 
            ? (
                <ul>
                    {users.map((user, i) => <li key={i}>{user?.email}</li>)}
                </ul>
            ) : (
                <p>No users to display</p>
            )}
            <br />
            <Link to="/home">Home</Link>
    </article>
    );
}

export default Users;