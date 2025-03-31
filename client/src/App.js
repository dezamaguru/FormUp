import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import AddUser from './components/AddUser';
import Users from './components/Users/Users';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/adduser' element={<AddUser/>} />
          <Route path='/users' element={<Users/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
