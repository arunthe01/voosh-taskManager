import React, { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar';
import { useSetRecoilState } from 'recoil';
import { navAt } from '../store/Atoms';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../../consts';


function ViewDetails() {
    const setNavState = useSetRecoilState(navAt);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get('id');
    const [task,setTask] = useState({title:'' , description:'', createdAt:'', updatedAt:'',status:''});
    useEffect(()=>{
        setNavState('tasks');
    },[])

    useEffect(()=>{
        axios.get(BACKEND_URL+'/taskManager/taskdetails',{
            headers: {
              'Authorization': localStorage.getItem('TaskManagerToken'),
              'Content-Type': 'application/json',
            },  params: {
              taskId: paramValue
            }
          }).then(res=>{
            //console.log(res.data.task);
            setTask(res.data.task);
          })
    },[])

  return (
    <>
        <Navbar/>
        <div className='flex justify-center align-center'>
            <div style={{width:'400px',height:'310px', borderWidth:'2.5px',boxShadow:'0px 0px 5px grey'}} className='p-4 m-5 border-solid  border-sky-500  rounded-md flex flex-col justify-between gap-5' >
                    <h6 className='font-bold'>Task details</h6>
                    <h2 className='font-semibold'>{`Title: ${task.title}`}</h2>
                    <h2>{`Description: ${task.description}`}</h2>
                    <h2>{`Status: ${task.status}`}</h2>
                    <Link to="/tasks" className='bg-blue-500 text-center text-white float-right rounded-md'>Cancel</Link>
            </div>
        </div>
    </>
  )
}

export default ViewDetails