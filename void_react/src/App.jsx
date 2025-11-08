import { useState } from 'react'

import './App.css'

import {  Route, Routes } from 'react-router-dom'


import Posts from './pages/Posts'
import Profile from './pages/Profile'


function App() {

  return (
    <>
      <Routes>
        <Route  path='/posts' element={<Posts/>}/>
        <Route  path='/profile' element={<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
