import './App.css';
import { Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import AddUser from './components/AddUser';
import Users from './components/Users/Users';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path='/' element={<Login/>} />
            <Route element= { <RequireAuth/>}>  {/*sends straight to login page if not logged in*/ }

              <Route path='/home' element={<Home/>} />
              <Route path='/adduser' element={<AddUser/>} />
              <Route path='/users' element={<Users/>} />
              
            </Route>
          </Route>"
        </Routes>
    </div>
  );
}

export default App;
