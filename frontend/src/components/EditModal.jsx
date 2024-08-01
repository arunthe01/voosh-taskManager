import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import BACKEND_URL from '../../consts';
import { useSetRecoilState } from 'recoil';
import { editTaskId } from '../store/Atoms';
import { Tasks } from '../store/Atoms';

Modal.setAppElement('#root'); // Ensure accessibility

function EditModal({ isOpen, onRequestClose, TaskId }) {
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' });
  const [errorState, setErrorState] = useState({ isValidTitle: true, isValidDescription: true });
  const[tasksList, setTasksLisk] = useSetRecoilState(Tasks);
  const setEditTaskId = useSetRecoilState(editTaskId);


  useEffect(() => {
    if (TaskId) {
      axios.get(`${BACKEND_URL}/taskManager/taskdetails`, {
        headers: {
          'Authorization': localStorage.getItem('TaskManagerToken'),
          'Content-Type': 'application/json',
        },
        params: { taskId: TaskId },
      }).then(res => {
        setFormData(res.data.task);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [TaskId]);

  const changeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAndAddTask = () => {
    const titleValid = formData.title.trim().length > 0;
    const descriptionValid = formData.description.trim().length > 0;

    setErrorState({
      isValidTitle: titleValid,
      isValidDescription: descriptionValid,
    });

    if (titleValid && descriptionValid) {
      addTask();
    }
  };

  const addTask = () => {
    axios.put(`${BACKEND_URL}/taskManager/editTask`, {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      taskId: TaskId,
    }, {
      headers: {
        'Authorization': localStorage.getItem('TaskManagerToken'),
        'Content-Type': 'application/json',
      },
    }).then(() => {
      setEditTaskId(''); // Clear the Recoil state
      onRequestClose(); // Close the modal
    }).catch(err => {
      console.error(err);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Task"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-90"
    >
      <div className='flex flex-col p-5 border border-sky-500 bg-white rounded-md shadow-lg w-full max-w-lg'>
        <h6 className='text-center mb-2 text-xl font-semibold'>Edit Task</h6>
        <input
          type="text"
          name="title"
          placeholder='Task title'
          className='border border-gray-300 p-2 my-1 rounded-md outline-none shadow-sm'
          onChange={changeHandler}
          value={formData.title}
        />
        <span className={`text-red-500 ${errorState.isValidTitle ? 'hidden' : ''}`}>Title cannot be empty</span>
        <textarea
          name="description"
          placeholder='Task description'
          className='border border-gray-300 p-2 my-1 rounded-md outline-none shadow-sm'
          onChange={changeHandler}
          value={formData.description}
        ></textarea>
        <span className={`text-red-500 ${errorState.isValidDescription ? 'hidden' : ''}`}>Description cannot be empty</span>
        <div className='my-2'>
          <label className='mr-1'>Status</label>
          <select
            id="status"
            name="status"
            className="bg-white border border-gray-300 rounded-md shadow-sm p-1 text-gray-700 outline-none"
            onChange={changeHandler}
            value={formData.status}
          >
            <option value="todo">Todo</option>
            <option value="inprogress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition'
          onClick={validateAndAddTask}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}

export default EditModal;
