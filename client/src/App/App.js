import { Route, Routes } from 'react-router-dom';
import "./App.css"
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import AddUser from '../components/Users/AddUser';
import Users from '../components/Users/Users';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import PersistLogin from '../components/PersistLogin';
import Cereri from '../components/CereriPage/CereriPage';
import Adevererinte from '../components/AdeverintePage/AdeverintePage';
import AdeverintaSolicitata from '../components/AdeverintePage/AdeverintaSolicitata';
import SolicitareCerere from '../components/CereriPage/SolicitareCerere';
import ForumPage from '../components/ForumPage/ForumPage';
import useFirebaseNotifications from "../hooks/useFirebaseNotifications";
import { ToastContainer} from 'react-toastify';
import Dashboard from '../components/Charts/Dashboard';

function App() {
  useFirebaseNotifications();

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path='/' element={<Login />} />
          <Route element={<PersistLogin />}>

            <Route element={<RequireAuth />}>

              <Route path='/home' element={<Home />} />
              <Route path='/adduser' element={<AddUser />} />
              <Route path='/users' element={<Users />} />
              <Route path='/cereri' element={<Cereri />} />
              <Route path='/adeverinte' element={<Adevererinte />} />
              <Route path='/adeverinte/:id' element={<AdeverintaSolicitata />} />
              <Route path="/cereri/solicitari/:id" element={<SolicitareCerere />} />
              <Route path="/inbox" element={<ForumPage />} />
              <Route path='/dashboard' element={<Dashboard />} />

            </Route>
          </Route>
        </Route>"
      </Routes>
    </div>
  );
}

export default App;
