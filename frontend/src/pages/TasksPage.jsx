import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import TaskContainer from '../components/TaskContainer'
import TaskContainers from '../components/TaskContainers'
import { useSetRecoilState } from 'recoil'
import { navAt } from '../store/Atoms'
import SearchBar from '../components/SearchBar'

function TasksPage() {

    const setNavState = useSetRecoilState(navAt);

    useEffect(()=>{
            setNavState('tasks');
    },[])
  return (
     <>
        <Navbar/>
        <div className='flex flex-col items-between mx-5 my-3'>
            <SearchBar/>
            <TaskContainers/>
        </div>
    </>
  )
}

export default TasksPage