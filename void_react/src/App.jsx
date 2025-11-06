import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'

import Posts from './pages/Posts'
import Authorization from './pages/Authorization'


function App() {

  return (
    <>
      <Routes>
        <Route  path='/' element={<Posts/>}/>
        <Route  path='/authorization' element={<Authorization/>}/>
      </Routes>
    </>
  )
}

export default App
