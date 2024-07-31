import React from 'react'
import notes from '../assets/notes-01.png';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { navAt } from '../store/Atoms';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../store/Atoms';

function Navbar() {
    const value = useRecoilValue(navAt);
    const setAuth = useSetRecoilState(isAuthenticated);
    const navigate =useNavigate();

    const logout = (()=>{
        localStorage.removeItem("TaskManagerToken");
        setAuth('');
        navigate('/login');
    })
  return (
    <div className='h-16 flex justify-between items-center bg-blue-500 p-2'>
   
        <img src={notes} className='w-8'/>
        {
            value == 'login' ? (<Link className='text-white' to={'/signup'}> Signup</Link>):value=='signup'?(<Link className='text-white' to={'/login'}>Login</Link>):(<button className='bg-red-500 px-2 py-1 rounded-sm' onClick={()=>{logout()}}>Logout</button>)
        }
    </div>
  )
}

export default Navbar