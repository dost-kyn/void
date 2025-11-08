import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'


import Posts from './pages/Posts'
import Authorization from './pages/Authorization'
import Registration from './pages/registration'
import Profile from './pages/Profile'


function App() {

  return (
    <>
      <Routes>
        <Route  path='/posts' element={<Posts/>}/>
        <Route  path='/profile' element={<Profile/>}/>
        <Route  path='/authorization' element={<Authorization/>}/>
        <Route  path='/registration' element={<Registration/>}/>
      </Routes>
    </>
  )
}

export default App
