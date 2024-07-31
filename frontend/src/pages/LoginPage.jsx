import React,{useEffect} from 'react'
import Navbar from '../components/Navbar'
import LoginComponent from '../components/LoginComponent'
import { useSetRecoilState } from 'recoil';
import { navAt } from '../store/Atoms';

function LoginPage() {
    const setNavat = useSetRecoilState(navAt);
  

    useEffect(()=>{
      setNavat('login');
    },[])

  return (
    <>
        <Navbar/>
        <LoginComponent/>
    </>
  )
}

export default LoginPage