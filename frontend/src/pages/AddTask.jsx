import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import AddForm from '../components/AddForm'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { navAt } from '../store/Atoms'

function AddTask() {

    const setState = useSetRecoilState(navAt);

    useEffect(()=>{
        setState('addtask');
    },[]);

  return (
    <div>
        <Navbar/>
        <AddForm/>
    </div>
  )
}

export default AddTask