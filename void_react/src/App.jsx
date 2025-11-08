import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'

<<<<<<< HEAD
import {  Route, Routes } from 'react-router-dom'
=======
import Posts from './pages/Posts'
import Authorization from './pages/Authorization'
import Registration from './pages/registration'

>>>>>>> 1ad5fbd2a5807707a753b681859c145ed8f256a7


import Posts from './pages/Posts'
import Profile from './pages/Profile'


function App() {

  return (
    <>
      <Routes>
<<<<<<< HEAD
        <Route  path='/posts' element={<Posts/>}/>
        <Route  path='/profile' element={<Profile/>}/>
=======
        <Route  path='/' element={<Posts/>}/>
        <Route  path='/authorization' element={<Authorization/>}/>
        <Route  path='/registration' element={<Registration/>}/>
>>>>>>> 1ad5fbd2a5807707a753b681859c145ed8f256a7
      </Routes>
    </>
  )
}

export default App
