import React from "react";
import {useState, useEffect} from 'react';
//import axios from 'axios';

function Users() {
    const [users, setUsers] = useState();

    useEffect(() => {
        let isMounted = true; 
        const controller = new AbortController(); 

        // const getUsers = async() => {
        //     try{
        //         axios.get("http://localhost:3001/users", {
        //             signal: controller.signal
        //         }).then( function (response) {
        //             console.log(response.data);
        //         });
        //         isMounted && setUsers(response.data);

        //     } catch(error) {
        //         console.error(error);
        //     }
        // }

        // getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
        
    },[]);

    return (
        <div>
            <article>
                <h2>Users List</h2>
                {users?.length 
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.firstName}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
            </article>
        </div>
    )
}

export default Users;