import React, { useEffect } from 'react'
import { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {isAuthenticated} from '../store/Atoms';
import BACKEND_URL from '../../consts';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function LoginComponent() {

  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(isAuthenticated);
  const [loginState,setLoginState] = useState({email:'',password:''});
  const [errorState,setErrorState] = useState({isEmailInvalid:false, isPasswordInvalid:false});


  const changeHandler = (e)=>{
    setLoginState(prev => ({...prev, [e.target.name]:e.target.value}));
  }

  const validateAndHandleLogin = ()=>{
    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

   // console.log(EmailRegex.test(loginState.email));
    if (!EmailRegex.test(loginState.email)) {
      console.log("Invalid email format");
      setErrorState(prev => ({ ...prev, isEmailInvalid: true }));
    } else if (loginState.password.length <= 3) {
      console.log("Password too short");
      setErrorState(prev => ({ ...prev, isPasswordInvalid: true }));
    } else {
      // Clear errors if everything is valid
      setErrorState({
        isEmailInvalid: false,
        isPasswordInvalid: false
      });
      handleLogin();
    }


  }

  const handleLogin = ()=>{
     axios.post(BACKEND_URL+'/taskManager/login',{
        email:loginState.email,
        password:loginState.password
     }).then((res)=>{
         // console.log(res);
          localStorage.setItem('TaskManagerToken',res.data.token);
          setAuthState(res.data.token);
          navigate('/tasks');
     }).catch((err)=>{
          alert("User doesn't exist please signup!");
          navigate('/signup');
     })
  };

  return (
    <div className='flex justify-center mt-10' > 
        <div style={{width:'400px', borderWidth:'2.5px',boxShadow:'0px 0px 2px grey'}} className='p-4 border-solid  border-sky-500  rounded-md' >
            <label>Login</label>
            <div className='flex flex-col '>
                <input type="email" name="email" placeholder='Email' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm ' style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={loginState.email}/>
                <span className={`text-red-500 ${errorState.isEmailInvalid ? '':'hidden'}`}>Invalid Email</span>
                <input type="password" name="password" placeholder='Password' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm'style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={loginState.password}/>
                <span className={`text-red-500 ${errorState.isPasswordInvalid ? '':'hidden'}`}>Password should have minimum 4 characters</span>
                <button className='bg-blue-500 my-2 p-1 text-white' onClick={validateAndHandleLogin}>Login</button>
                <div className='flex justify-center'>
                  <GoogleLogin onSuccess={(credResp)=>{
                    let decodedCreds = jwtDecode(credResp.credential);
                    axios.post(BACKEND_URL+'/taskManager/auth/google',{
                      email:decodedCreds.email,
                      googleId:decodedCreds.sub
                   }).then((res)=>{
                       // console.log(res);
                        localStorage.setItem('TaskManagerToken',res.data.token);
                        setAuthState(res.data.token);
                        navigate('/tasks');
                   }).catch((err)=>{
                       if(err?.response?.data?.devCode == 'user-general-email-exists'){
                         alert(err?.response?.data?.message);
                       }
                     //  console.log(err.response);
                      
                   })

                  }} onError={()=>{
                     alert('try again something went wrong');
                  }}/>
                </div>
                <p className='flex justify-center my-2'>don't have an account ? <Link to="/signup" className='ml-1'>Signup</Link></p>
            </div>
        </div>
    </div>
  )
}

export default LoginComponent