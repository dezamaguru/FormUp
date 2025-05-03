import './App.css';
import { Route, Routes} from 'react-router-dom';
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import AddUser from '../components/AddUser';
import Users from '../components/Users/Users';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import PersistLogin from '../components/PersistLogin';
import Cereri from '../components/CereriPage/CereriPage';
import Adevererinte from '../components/AdeverintePage/AdeverintePage';
import AdeverintaSolicitata from '../components/AdeverintePage/AdeverintaSolicitata';
import CerereTip from '../components/CereriPage/CerereTip';
import SolicitareCerere from '../components/CereriPage/SolicitareCerere';
import ForumPage from '../components/ForumPage/ForumPage';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path='/' element={<Login/>} />
            <Route element={<PersistLogin/>}>

              <Route element= { <RequireAuth/>}>  {/*sends straight to login page if not logged in*/ }

                <Route path='/home' element={<Home/>} />
                <Route path='/adduser' element={<AddUser/>} />
                <Route path='/users' element={<Users/>} />
                <Route path='/cereri' element={<Cereri/>} />
                <Route path='/adeverinte' element={<Adevererinte/>} />
                <Route path='/adeverinte/:id' element={<AdeverintaSolicitata/>} />
                <Route path='/cereri/:id' element={<CerereTip/>}/>
                <Route path="/cereri/solicitari/:id" element={<SolicitareCerere />} />
                <Route path="/inbox" element={<ForumPage />} />
                
              </Route>
              
            </Route>
          </Route>"
        </Routes>
    </div>
  );
}

export default App;
