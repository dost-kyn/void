import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'

import Posts from './pages/Posts'
import Authorization from './pages/Authorization'
import Registration from './pages/registration'


function App() {

  return (
    <>
      <Routes>
        <Route  path='/' element={<Posts/>}/>
        <Route  path='/authorization' element={<Authorization/>}/>
        <Route  path='/registration' element={<Registration/>}/>
      </Routes>
    </>
  )
}

export default App
