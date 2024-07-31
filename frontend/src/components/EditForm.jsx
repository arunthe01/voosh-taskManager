import React from 'react'
import { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../consts';
import axios from 'axios';

function EditForm() { const navigate = useNavigate();
    const [formData,setFormData] = useState({title:'',description:'',status:'todo'});
    const [errorState,setErrorState] = useState({isValidTitle:true, isValidDescription:true});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get('id');


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
            setFormData(res.data.task);
          })
    },[])


    const changeHandler = (e)=>{
      setFormData(prev=>({...prev,[e.target.name]:e.target.value}));
    }


    const validateAndAddTask = ()=>{
      if(formData.title.trim().length == 0){
        setErrorState(prev=>({...prev,isValidTitle:false}));
      }else if(formData.description.trim().length == 0){
        setErrorState(prev=>({...prev,isValidDescription:false}));
      }else{
        setErrorState({isValidTitle:true,isValidDescription:true});
        addTask();
      }
    }

    const addTask=()=>{
        axios.put(BACKEND_URL+"/taskManager/editTask",{
            title: formData.title,
            description: formData.description,
            status: formData.status,   
            taskId:paramValue
            
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
                    <select id="status" name="status" className="bg-white border border-gray-300 rounded-sm shadow-sm p-1 text-gray-700 outline-none" onChange={changeHandler} value={formData.status}>
                        <option value="todo">Todo</option>
                        <option value="inprogress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
            </div>
            <button className='bg-blue-500 my-2 p-1 text-white' onClick={()=>{validateAndAddTask()}}>Submit</button>
        </div>
   </div>
  )
}


export default EditForm