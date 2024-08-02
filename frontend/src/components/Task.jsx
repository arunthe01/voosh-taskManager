import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios';
import {Tasks} from '../store/Atoms';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../consts';
import { isOpenEditForm } from '../store/Atoms';
import { isOpenViewDetails } from '../store/Atoms';


function Task({ele,idx}) {
  const [taskList, setTaskList] = useRecoilState(Tasks);
  const [isOpenView, setIsOpenView] = useRecoilState(isOpenViewDetails);
  const [isOpenEdit, setIsOpenEditForm] = useRecoilState(isOpenEditForm);
  //console.log(isOpenEdit);


const navigateToPage = (id)=>{
  setIsOpenView(prev =>({...prev, isOpen:true,id:id}));
}

const navigateToEditPage = (id)=>{
  setIsOpenEditForm(prev =>({...prev,isOpen:true,id:id}));

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
                  <div className='flex md:justify-end m-2'> <button className='bg-red-500 px-2 py-1 rounded-md mr-1 text-white' onClick={()=>{handleDelete(ele._id)}}>Delete</button> <button className='bg-blue-500 px-2 py-1 rounded-md mr-1 text-white' onClick={()=>navigateToEditPage(ele._id)}>Edit</button> <button className='bg-blue-600 px-2 py-1 rounded-md mr-1 text-white' onClick={()=>navigateToPage(ele._id)}>View details</button> </div>
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

  // IST is UTC+5:30, which is 330 minutes ahead of UTC
  const istOffsetInMinutes = 330; // 5 hours 30 minutes
  const utcOffsetInMinutes = date.getTimezoneOffset();
  
  // Calculate IST time
  const istDate = new Date(date.getTime() + (istOffsetInMinutes + utcOffsetInMinutes) * 60000);

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