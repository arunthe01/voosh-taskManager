import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import BACKEND_URL from '../../consts';



function AddForm() {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({title:'',description:'',status:'todo'});
    const [errorState,setErrorState] = useState({isValidTitle:true, isValidDescription:true});


    const changeHandler = (e)=>{
      setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
    }

  



    const validateAndAddTask = ()=>{
      console.log(formData);
      if(formData.title.trim().length == 0){
        console.log('helllo')
        setErrorState(prev=>({...prev,isValidTitle:false}));
      }else if(formData.description.trim().length == 0){
        setErrorState(prev=>({...prev,isValidDescription:false}));
      }else{
        setErrorState({isValidTitle:true,isValidDescription:true});
        addTask();
      }
    }

    const addTask=()=>{
        axios.post(BACKEND_URL+"/taskManager/addTask",{
            title: formData.title,
            description: formData.description,
            status: formData.status,  
        }, {
          headers: {
            'Authorization': localStorage.getItem('TaskManagerToken'),  // Basic authentication header
            'Content-Type': 'application/json'  // Content type
          }
        }).then((res)=>{
          navigate('/tasks');
        }).catch(err=>{
            console.log(err);
        });
    }

    

  return (
    <div className='flex justify-center m-5'>
        <div  className='flex flex-col rounded-md p-5 border border-2 border-sky-500'
              style={{ width: '500px', boxShadow: '0px 0px 4px grey' }}>
            <h6 className='text-center mb-2'> Add Task</h6>
            <input type="text" name="title" placeholder='Task title' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm' style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={formData.title}/>
            <span className={`text-red-500 ${errorState.isValidTitle? 'hidden' :''}`}> title cannot be empty</span>
            <textarea name="description" placeholder='Task description' className='border-0 p-2 my-1 bg-transparent outline-none border rounded-sm' style={{boxShadow:'0px 0px 2px grey'}} onChange={changeHandler} value={formData.description}></textarea>
            <span className={`text-red-500 ${errorState.isValidDescription? 'hidden' :''}`}> description cannot be empty</span>
            <div className='m-2'>
                    <label className='mr-1'>Status</label>
                    <select id="status" name="status" className="bg-white border border-gray-300 rounded-sm shadow-sm p-1 text-gray-700 outline-none" onChange={changeHandler}>
                        <option value="todo">Todo</option>
                        <option value="inprogress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
            </div>
            <button className='bg-blue-500 my-2 p-1 text-white' onClick={()=>{validateAndAddTask()}}>Submit</button>
            <button className='bg-red-500 my-2 p-1 text-white' onClick={()=>{ navigate('/tasks')}}>Go back</button> 
        </div>
   </div>
  )
}

export default AddForm