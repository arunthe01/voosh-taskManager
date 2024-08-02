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
    <div className='h-16 flex justify-between items-center bg-blue-500 p-2 w-screen'>
   
        <img src={notes} className='w-8'/>
        {
            value == 'login' ? (<div><button className='text-blue-500 rounded-md bg-white py-1 px-2 mr-2'>Login</button>  <Link className='text-white' to={'/signup'}> Signup</Link> </div>):value=='signup'?(<div><button className='text-blue-500 rounded-md bg-white py-1 px-2 mr-2'>Signup</button>  <Link className='text-white' to={'/login'}> Login</Link> </div>):(<button className='bg-red-500 px-2 py-1 px-2 rounded-md text-white' onClick={()=>{logout()}}>Logout</button>)
        }
    </div>
  )
}

export default Navbar