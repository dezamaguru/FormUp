import React from "react";
import { useRef, useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth";
import './Login.css';
import axios from '../../api/axios';
import { useNavigate, useLocation} from 'react-router-dom';
const LOGIN_URL = '/login';

function Login() {
    const { setAuth } = useAuth();
    
    const navigate = useNavigate();
    const location = useLocation();
    const from  = location.state?.from?.pathname  || "/home";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg]  = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit= async (e) => {
        e.preventDefault(); //prevent default behavoiur of form submission => page reload
        
        try{
            const response = await axios.post(LOGIN_URL, JSON.stringify({email, password}), 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const type = response?.data?.type;

            setAuth({email, type, accessToken});
            setEmail('');
            setPassword('');
            navigate(from, { replace: true});
            
        } catch(error){
            if(!error?.response){
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if(error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <div className='container-login'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className='container-imagine'>
                    <img className='login-image' src={`${process.env.PUBLIC_URL}../assets/login_picture.png`} alt='login' />
                </div>
        
                <div className='container-form'>
                    <p className="login-title"> Welcome!</p>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <input className='form-input' placeholder='Email' type='email' autoComplete='off' 
                            ref={userRef} onChange= { (e) => setEmail(e.target.value)} value= {email} required/>
                        <input className='form-input' placeholder='Password' type='password'autoComplete='off' 
                            onChange= { (e) => setPassword(e.target.value)} value= {password} required />
                        <button className="login-button">Sign in</button>
                    </form>
                </div>
            </div>
        </>
      );
}

export default Login;