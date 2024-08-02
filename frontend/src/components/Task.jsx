import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios';
import {Tasks} from '../store/Atoms';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../consts';
function Task({ele,idx}) {
  const [taskList, setTaskList] = useRecoilState(Tasks);
  const navigate = useNavigate();


const navigateToPage = (id)=>{
    const toUrl = `/viewDetails?id=${id}`;
    navigate(toUrl);
}

const navigateToEditPage = (id)=>{
  const toUrl = `/editTask?id=${id}`;
    navigate(toUrl);
}

const handleDelete = (id) => {
  axios.delete(BACKEND_URL+'/taskManager/deleteTask', {
    headers: {
      'Authorization': localStorage.getItem('TaskManagerToken'),
      'Content-Type': 'application/json',
    },
    data: { taskId: id } // Make sure this matches your backend requirements
  })
  .then(res => {
    // Successfully deleted on the backend
    setTaskList(prevState => {
      const updatedColumns = prevState.columns.map(column => ({
        ...column,
        values: column.values.filter(item => item._id !== id), // Remove the item from the state
      }));


      return {
        ...prevState,
        columns: updatedColumns,
      };
    });
  })
  .catch(error => {
    // Handle errors here
    console.error('Error deleting task:', error);
  });
};

  return (
    <Draggable draggableId={ele._id} index={idx} key={ele._id}>
    {
        (provided)=>{ return <div
              ref={provided.innerRef} 
              {...provided.draggableProps} 
              {...provided.dragHandleProps}
              className='bg-sky-500/30 flex flex-col justify-between  rounded-md p-2'>
              <div>
                  <h6><b>{ele.title}</b></h6>
                  <p>{ele.description}</p>
                  
              </div>
              <div>
                  <p className='text-left'>created at:{formatISODateToIST(ele.createdAt)}</p>
                  <div className='float-right mt-2'> <button className='bg-red-500 px-2 py-1 rounded-md mr-1' onClick={()=>{handleDelete(ele._id)}}>Delete</button> <button className='bg-blue-300 px-2 py-1 rounded-md mr-1' onClick={()=>navigateToEditPage(ele._id)}>Edit</button> <button className='bg-blue-400 px-2 py-1 rounded-md mr-1' onClick={()=>navigateToPage(ele._id)}>View details</button> </div>
              </div>
          </div>
        }
    }
    </Draggable>
  )
}


const formatISODateToIST = (isoString) => {
  // Convert the ISO string to a Date object
  const date = new Date(isoString);

  // Convert the date to IST by adding 5 hours and 30 minutes
  const istOffset = 5.5 * 60; // IST is UTC+5:30, so 5.5 hours in minutes
  const utcMinutes = date.getUTCMinutes() + date.getUTCHours() * 60;
  const istMinutes = utcMinutes + istOffset;

  const istDate = new Date(date.getTime() + (istMinutes - utcMinutes) * 60000);

  // Helper function to format the time in 12-hour format
  const formatTime12Hour = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  // Format the full date and time in IST
  const formattedDate = `${istDate.toLocaleDateString()} ${formatTime12Hour(istDate)}`;

  return formattedDate;
};

export default Task