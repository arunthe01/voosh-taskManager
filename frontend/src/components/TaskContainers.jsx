import React, { useEffect } from 'react';
import TaskContainer from './TaskContainer';
import { DragDropContext } from 'react-beautiful-dnd';
import { useRecoilValue,useRecoilState } from 'recoil';
import { Tasks } from '../store/Atoms';
import axios from 'axios';
import BACKEND_URL from '../../consts';




function TaskContainers() {

    const [taskList, setTaskList] = useRecoilState(Tasks);

    //console.log(taskList);

    // useEffect(()=>{
    //      axios.get(BACKEND_URL+'/taskManager/tasks', {
    //         headers: {
    //           'Authorization': localStorage.getItem('TaskManagerToken'),
    //           'Content-Type': 'application/json',
    //         },
    //       }).then(response=>{
    //         const columns =  response.data.tasks;
    //         console.log(columns);
    //          setTaskList(prev => ({...prev,columns:columns}));
    //       })
    // },[]);



    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        let updatedColumns=null;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if(source.droppableId === destination.droppableId){
            const columnIndex = source.droppableId; // This should be an integer
            const column = taskList.columns[columnIndex];
            const sourceData = Array.from(column.values);

            // Remove the item from the source
            const changeElement = sourceData[source.index];
            sourceData.splice(source.index, 1);

            // Insert the item into the destination
            sourceData.splice(destination.index, 0,changeElement);

            // Create a new column object with updated values
            const updatedColumn = {
                ...column,
                values: sourceData,
            };

            // Update the columns array with the modified column
            updatedColumns = [...taskList.columns];
            updatedColumns[columnIndex] = updatedColumn;

            // Update the Recoil state with the new columns array
            setTaskList(prev => ({
                ...prev,
                columns: updatedColumns,
            }));

        }else{
            const sourceColumn = taskList.columns[source.droppableId];
            const destinationColumn = taskList.columns[destination.droppableId];

            const sourceData = Array.from(sourceColumn.values);
            const destinationData = Array.from(destinationColumn.values);

             // Remove the item from the source
             const changeElement = sourceData[source.index];
             sourceData.splice(source.index, 1);

             //adding to destination data array
             destinationData.splice(destination.index, 0,changeElement);


             const sourceUpdatedColumns = {
                ...sourceColumn,
                values:sourceData
             }

             const destinationUpdatedColumns = {
                ...destinationColumn,
                values:destinationData
             }

            // Update the columns array with the modified column
             updatedColumns = [...taskList.columns];
            updatedColumns[source.droppableId] = sourceUpdatedColumns;
            updatedColumns[destination.droppableId] = destinationUpdatedColumns;


            let status ='';

            if(destination.droppableId == 0){
                status='todo';
            }else if(destination.droppableId == 1){
                status='inprogress';
            }else{
                status='completed';
            }


            

            // Update the Recoil state with the new columns array
            setTaskList(prev => ({
                ...prev,
                columns: updatedColumns,
            }));
        }

        axios.put(BACKEND_URL+'/taskManager/tasksSeq',{
                source:source.droppableId,
                destination:destination.droppableId,
                columns:updatedColumns,
                updatedElementId:draggableId
        },{
            headers: {
                'Authorization': localStorage.getItem('TaskManagerToken'),  // Basic authentication header
                'Content-Type': 'application/json'  // Content type
              }
        }).then(res=>{
            console.log(res);
        })
        
    };

  return (

    <DragDropContext onDragEnd={onDragEnd}>

       <div className='flex justify-center md:justify-between flex-wrap gap-3'>
            <TaskContainer tasklist={taskList.columns[0].values} id={0} title={'Todo'}/>
            <TaskContainer tasklist={taskList.columns[1].values} id={1} title={'In Progress'}/>
            <TaskContainer tasklist={taskList.columns[2].values} id={2} title={'Done'}/>
        </div>
    </DragDropContext>
  )
}

export default TaskContainers