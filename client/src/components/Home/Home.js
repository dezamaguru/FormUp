import React from "react";
import useAuth from "../../hooks/useAuth";
import StudentPage from "../StudentPage/StudentPage";
import SecretarPage from "../SecretarPage/SecretarPage";
import AdminPage from "../AdminPage/AdminPage";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function Home() {
    const { auth } = useAuth();
    useFirebaseNotifications();

    return (
        <div>
            <ToastContainer/>

            {auth?.type === 'admin' && (
                <AdminPage />
            )}

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