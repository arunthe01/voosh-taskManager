import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskList from './TaskList'; // Ensure TaskList is imported correctly

function TaskContainer({ tasklist, id , title}) {
  return (
      <Droppable droppableId={id.toString()}>
        {(provided) => (
              <div className='flex flex-col gap-2 flex-shrink-0 shadow-2xl shadow-indigo-500/40 p-5 rounded-lg overflow-y-auto w-full md:w-64 lg:w-1/4 h-96' style={{ boxShadow: '0px 0px 3.4px grey' }}
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
