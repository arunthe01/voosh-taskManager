import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskList from './TaskList'; // Ensure TaskList is imported correctly

function TaskContainer({ tasklist, id , title}) {
  return (
      <Droppable droppableId={id.toString()}>
        {(provided) => (
              <div className='flex flex-col flex-shrink-0 gap-2 shadow-2xl shadow-indigo-500/40 p-5 rounded-lg overflow-y-auto ' style={{ height: '450px', width:'420px', boxShadow: '0px 0px 3.4px grey' }}
            ref={provided.innerRef} // Use ref here
            {...provided.droppableProps} // Spread droppableProps
          >
             <p className='text-center bg-blue-500 text-white m-0'>{title}</p>
            <TaskList tasklist={tasklist} /> 
            {provided.placeholder}
          </div>
        )}
      </Droppable>

  );
}

export default TaskContainer;
