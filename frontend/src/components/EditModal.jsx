import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import BACKEND_URL from '../../consts';
import { Tasks } from '../store/Atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isOpenEditForm } from '../store/Atoms';
// Set the app element for accessibility
Modal.setAppElement('#root');

function EditModal() {

  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' });
  const [errorState, setErrorState] = useState({ isValidTitle: true, isValidDescription: true });
  const [isOpen,setIsOpen] = useRecoilState(isOpenEditForm);
  const setTasks = useSetRecoilState(Tasks);


  useEffect(()=>{
    if (!isOpen.id) {
      return;
    }
    //console.log(isOpen.id);
    axios.get(BACKEND_URL+'/taskManager/taskdetails',{
        headers: {
          'Authorization': localStorage.getItem('TaskManagerToken'),
          'Content-Type': 'application/json',
        },  params: {
          taskId: isOpen.id
        }
      }).then(res=>{
        //console.log(res.data.task);
        setFormData(res.data.task);
      })
},[isOpen])


  const changeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const closeAddFormModal =  () => setIsOpen(prev => ({...prev,isOpen:false,link:''}));
  const validateAndAddTask = () => {
    if (formData.title.trim().length === 0) {
      setErrorState(prev => ({ ...prev, isValidTitle: false }));
    } else if (formData.description.trim().length === 0) {
      setErrorState(prev => ({ ...prev, isValidDescription: false }));
    } else {
      setErrorState({ isValidTitle: true, isValidDescription: true });
      addTask();
    }
  }

  const addTask = () => {
    axios.put(BACKEND_URL + "/taskManager/editTask", {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      taskId:isOpen.id
    }, {
      headers: {
        'Authorization': localStorage.getItem('TaskManagerToken'),  // Basic authentication header
        'Content-Type': 'application/json'  // Content type
      }
    }).then((res) => {   
      //console.log(res);
      setTasks(prev => {
        if (res.data.editedTask.status === 'todo') {
            let todoValues = [...prev.columns[0].values]; 
            const indexToReplace =todoValues.findIndex(item => item.id === res.data.editedTask._id);
            todoValues.splice(indexToReplace,1,res.data.editedTask);
            console.log(todoValues,"arun new");
            return {
                ...prev,
                columns: [
                    { ...prev.columns[0], values: todoValues },
                    prev.columns[1],
                    prev.columns[2]
                ]
            };
        } else if (res.data.editedTask.status === 'inprogress') {
          let todoValues = [...prev.columns[1].values]; 
            const indexToReplace =todoValues.findIndex(item => item.id === res.data.editedTask._id);
            todoValues.splice(indexToReplace,1,res.data.editedTask);
            return {
                ...prev,
                columns: [
                    prev.columns[0],
                    { ...prev.columns[1], values: todoValues },
                    prev.columns[2]
                ]
            };
        } else {
          let todoValues = [...prev.columns[2].values]; 
            const indexToReplace =todoValues.findIndex(item => item.id === res.data.editedTask._id);
            todoValues.splice(indexToReplace,1,res.data.editedTask);
            //console.log(todoValues,"After editing");
            return {
                ...prev,
                columns: [
                    prev.columns[0],
                    prev.columns[1],
                    { ...prev.columns[2], values: todoValues }
                ]
            };
        }
    });
    setFormData({ title: '', description: '', status: 'todo' });
    closeAddFormModal();
      //navigate('/tasks');
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <div className='flex justify-center m-5 rounded-5px'>

      <Modal
        isOpen={isOpen.isOpen}
        onRequestClose={closeAddFormModal}
        contentLabel="Add Task Modal"
        className="flex items-center justify-center min-h-screen"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-95 flex items-center justify-center"
      >
        <div className='flex flex-col justify-between rounded-md p-5  bg-white shadow-lg' style={{ width: '400px', height:'500px' }}>
          <div>
            <h6 className='text-center mb-5 flex justify-start font-semibold'>Add Task</h6>
            <div className='ml-2'> 
              <label className='font-normal text-gray-500'>Title</label>
              <input type="text" name="title" className='border-0  bg-transparent outline-none  w-full' onChange={changeHandler} value={formData.title} />
              <hr></hr>
              <span className={`text-red-500 ${errorState.isValidTitle ? 'hidden' : ''}`}>Title cannot be empty</span>
              <label className='font-normal text-gray-500'>Description</label>
              <textarea name="description"  className='border-0 bg-transparent outline-none w-full h-32' onChange={changeHandler} value={formData.description}></textarea>              <hr></hr>
              <span className={`text-red-500 ${errorState.isValidDescription ? 'hidden' : ''}`}>Description cannot be empty</span>
            </div>
          </div>
          <div className='flex justify-end'>
            <button className=' my-2 mx-2 py-1 px-2 text-black bg-gray-200 rounded-md' onClick={() => { validateAndAddTask(); }}>Save</button>
            <button className=' my-2 p-1 text-black bg-gray-300 py-1 px-2 rounded-md' onClick={() => { closeAddFormModal() }}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditModal;
