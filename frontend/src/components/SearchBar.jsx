import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil';
import { Tasks } from '../store/Atoms';
import axios from 'axios';
import BACKEND_URL from '../../consts';

function SearchBar() {

 
  const navigate = useNavigate();
  const [searchQuery,setSearchQuery] = useState('');
  const setTasks = useSetRecoilState(Tasks);
  const [sortBy,setSortBy] = useState('date_modified');

  let timeout = null;

  useEffect(()=>{
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      axios.get(BACKEND_URL+'/taskManager/searchTasks',{
        headers: {
          'Authorization': localStorage.getItem('TaskManagerToken'),
          'Content-Type': 'application/json',
        },  params: {
          search: searchQuery,
          sortBy:sortBy
        }
      }).then(response=>{
        setTasks(prev =>({...prev, columns:response.data.tasks}));
      }).catch(err=>{
          console.error(err);
      });
    },200);
  },[searchQuery,sortBy]);





  const changeSearchHandler = (e)=>{
      setSearchQuery(e.target.value);
  }


  const navigateToAddTask = ()=>{
    navigate('/addTask');
  };
  
  return (
    <div className='m-1'>
        <button className='bg-blue-500 p-2 rounded-md text-center w-32 text-white my-2' onClick={()=>navigateToAddTask()}>Add Task</button>
        <div className='flex justify-between items-center mb-5 p-1 rounded-md px-2 flex-wrap' style={{boxShadow:'0px 0px 3.4px grey'}}>
            
            <div>
                <label className='mr-1'>Search:</label>
                <input style={{boxShadow:'0px 0px 1px grey'}} type='text' className='border-0 p-1 my-1 bg-transparent outline-none border rounded-sm w-32 md:w-64' placeholder='search..' value={searchQuery} onChange={changeSearchHandler}/>
            </div>

            <div>
                <label className='mr-1'>SortBy:</label>
                <select id="sortOptions" name="sortOptions" className="bg-white border border-gray-300  shadow-sm p-1 text-gray-700 outline-none rounded-md" value={sortBy} onChange={(e)=>{setSortBy(e.target.value)}}>
                    <option value="default"></option>
                    <option value="updatedAt">Date Modified</option>
                    <option value="title">title</option>
                    <option value="description">description</option>
                </select>
            </div>
        </div>
    </div>
  )
}

export default SearchBar