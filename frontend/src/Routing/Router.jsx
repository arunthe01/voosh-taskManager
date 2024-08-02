import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import TasksPage from '../pages/TasksPage'
import { useRecoilState } from 'recoil'
import { isAuthenticated } from '../store/Atoms'
import { Navigate } from 'react-router-dom'

function Router() {
    const [isvalid] = useRecoilState(isAuthenticated);
    //console.log(isvalid);
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={isvalid?<Navigate to='/tasks' />:<LoginPage/>}/>
            <Route path='/login' element={isvalid?<Navigate to='/tasks' />:<LoginPage/>}/>
            <Route path='/signup' element={isvalid?<Navigate to='/tasks' />:<SignUpPage/>}/>
            <Route path='/tasks' element={isvalid?<TasksPage/>:<Navigate to='/login'/>}/>
        </Routes> 
    </BrowserRouter>
  )
}

export default Router