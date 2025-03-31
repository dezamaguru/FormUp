import React from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


function Home() {
    const { auth } = useAuth();
    console.log("Auth in Home:", auth);

    return (
        <div>
            <h1>Welcome, {auth?.email}!</h1>

            {auth?.type === 'admin' && (
                <div>
                    <h2>Admin Dashboard</h2>
                        <li><Link to="/users">Manage Users</Link></li>
                </div>
            )}

            {auth?.type === 'student' && (
                <div>
                    <h2>Student Dashboard</h2>
                </div>
            )}

            {auth?.type === 'secretar' && (
                <div>
                    <h2>Secretary Dashboard</h2>
                        <li><Link to="/users">View Users</Link></li>
                </div>
            )}

        </div>
    );
}

export default Home;