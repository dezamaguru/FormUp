import React from "react";
import useAuth from "../../hooks/useAuth";
import StudentPage from "../StudentPage/StudentPage";
import SecretarPage from "../SecretarPage/SecretarPage";
import AdminPage from "../AdminPage/AdminPage";

function Home() {
    const { auth } = useAuth();

    return (
        <div>
            {/* <h1>Welcome, {auth?.email}!</h1> */}

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