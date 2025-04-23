import { Link } from "react-router-dom";

function AdminRole() {
    return ( 
        <div>
            <h2>Admin Dashboard</h2>
            <li><Link to="/users">Manage Users</Link></li>
        </div>
    );
}

export default AdminRole;