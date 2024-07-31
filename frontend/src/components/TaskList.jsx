import React from 'react'
import Task from './Task'

function TaskList({tasklist}) {
  return (

        <>
        {
            tasklist.map((ele,idx)=>{
                return <Task ele={ele} idx={idx} key={ele._id}/>
                })
        } 

        </>

  )
}

export default TaskList