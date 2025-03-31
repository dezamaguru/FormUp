import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    return  (
        // auth?.roles?.find(role => allowRoles?.include(role)) 
        //     ? <Outlet />
        //     : auth?.user 
        //         ? <Navigate to="/unauthorized" state={{ from: location}} replace />
        //         : <Navigate to="/" state={{ from: location}} replace /> 
        //     //sends user back to login page 

        auth?.accessToken // Check for accessToken
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;