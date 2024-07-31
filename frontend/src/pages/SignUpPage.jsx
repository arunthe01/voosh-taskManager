import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useSetRecoilState } from 'recoil';
import { navAt } from '../store/Atoms';
import SignupComponent from '../components/SignupComponent';

function SignUpPage() {
    const setState = useSetRecoilState(navAt);
    useEffect(()=>{
        setState('signup');
    },[]);

  return (
    <div>
        <Navbar/>
        <SignupComponent/>


    </div>
  )
}

export default SignUpPage