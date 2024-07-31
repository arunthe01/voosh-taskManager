import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import BACKEND_URL from '../../consts';


function SignupComponent() {

  const navigate = useNavigate();


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
    axios.post(BACKEND_URL+'/taskManager/signup',{
       email:loginState.email,
       password:loginState.password
    }).then((res)=>{
        alert("user Created successfuly, please login!");
        setLoginState({email:'',password:''});
    }).catch((err)=>{
      if(err.response.data.message){
         if(confirm("email is registered already please login!!")){
            setLoginState({email:'',password:''});
         }

      }
    });
 };


  return (
    <div className='flex justify-center mt-10' > 
        <div style={{width:'400px', borderWidth:'2.5px',boxShadow:'0px 0px 5px grey'}} className='p-4 border-solid  border-sky-500  rounded-md' >
            <label>Signup</label>
            <div className='flex flex-col '>
               <input type="email" name="email" placeholder='Email' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm ' style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={loginState.email}/>
                <span className={`text-red-500 ${errorState.isEmailInvalid ? '':'hidden'}`}>Invalid Email</span>
                <input type="password" name="password" placeholder='Password' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm'style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={loginState.password}/>
                <span className={`text-red-500 ${errorState.isPasswordInvalid ? '':'hidden'}`}>Password should have minimum 4 characters</span>
                <button className='bg-blue-500 my-2 p-1 text-white' onClick={validateAndHandleLogin}>Signup</button>
                <p className='flex justify-center my-2'>Already have an account? <Link to='/login' className='ml-1'>Login</Link></p>
            </div>
        </div>
    </div>
  )
}

export default SignupComponent