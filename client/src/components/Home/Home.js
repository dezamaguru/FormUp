import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import StudentPage from "../StudentPage/StudentPage";
import SecretarPage from "../SecretarPage/SecretarPage";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import { ToastContainer } from "react-toastify";
import Users from '../Users/Users';
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

function Home() {
    const { auth } = useAuth();
    useFirebaseNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.type === 'admin') {
            navigate('/users', { replace: true });
        }
    }, [auth, navigate]);

    return (
        <div>
            <ToastContainer/>

            {auth?.type === 'student' && (
                <StudentPage />
            )}

            {auth?.type === 'secretar' && (
                <SecretarPage />
            )}
        </div>
    );
}

export default Home;