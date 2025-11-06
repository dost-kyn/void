import { useState } from 'react'

import './App.css'

import Posts from './pages/Posts'
import {  Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route  path='/posts' element={<Posts/>}/>
      </Routes>
    </>
  )
}

export default App
