import { Link } from "react-router-dom";
import SideBar from "../SideBar/SideBar";

function SecretarRole() {

    return (
        <div className="student-page">
            <SideBar />
            <div>
                <h2>Secretary Dashboard</h2>
                <li><Link to="/users">View Users</Link></li>
                <li><Link to='/adeverinte'>Adeverinte</Link></li>
            </div>
        </div>
    );
}

export default SecretarRole;