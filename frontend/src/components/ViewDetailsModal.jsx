import React from 'react'
import {useRecoilState } from 'recoil';
import { useState,useEffect } from 'react';
import { isOpenViewDetails } from '../store/Atoms';
import Modal from 'react-modal';
import axios from 'axios';
import BACKEND_URL from '../../consts';



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
  Modal.setAppElement('#root');

function ViewDetailsModal() {

    const [viewDetails,setViewDetails] = useRecoilState(isOpenViewDetails);
    const [task,setTask] = useState({title:'' , description:'', createdAt:'', updatedAt:'',status:''});

    const closeViewFormModal = ()=>{
        setViewDetails((prev)=> ({...prev,isOpen:false,id:''}));
    }




    useEffect(()=>{
        if(!viewDetails.id) return;
        axios.get(BACKEND_URL+'/taskManager/taskdetails',{
            headers: {
              'Authorization': localStorage.getItem('TaskManagerToken'),
              'Content-Type': 'application/json',
            },  params: {
              taskId: viewDetails.id
            }
          }).then(res=>{
            console.log(res.data.task);
            setTask(res.data.task);
          })
    },[viewDetails.id])

  return (
    <div className='flex justify-center m-5 rounded-5px'>

      <Modal
        isOpen={viewDetails.isOpen}
        onRequestClose={closeViewFormModal}
        contentLabel="Add Task Modal"
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-95 flex items-center justify-center"
      >
        <div className='flex flex-col justify-between rounded-md p-5  bg-white shadow-lg' style={{ width: '400px', height:'500px' }}>
          <div>
            <h6 className='text-center mb-5 flex justify-start font-semibold'>Task Details</h6>
            <div className='ml-2'> 
              <h2 className='font-semibold mb-3'>{`Title: ${task.title}`}</h2>
              <h2 className=' text-gray-500 font-bold mb-3'>{`Description: ${task.description}`}</h2>
              <p className='text-gray-400'>{`Created at: ${formatISODateToIST(task.createdAt)}`}</p>
            </div>
          </div>
          <div className='flex justify-end'>
            <button className=' my-2 p-1 text-black bg-gray-300 py-1 px-2 rounded-md' onClick={() => { closeViewFormModal()}}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ViewDetailsModal