import { useState } from 'react'
import {  Route, Routes } from 'react-router-dom'
import './App.css'


import Screensaver from './pages/Screensaver'
import Chat from './pages/Chat'
import Posts from './pages/Posts'
import Friends from './pages/Friends'
import Messages from './pages/Messages'
import Authorization from './pages/Authorization'
import Registration from './pages/Registration'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'

import AdminUsers from './pages/admin_panel/AdminUsers'
import AdminPosts from './pages/admin_panel/AdminPosts'
import AdminCategories from './pages/admin_panel/AdminCategories'

function App() {

  return (
    <>
      <Routes>
        <Route  path='/posts' element={<Posts/>}/>
        <Route  path='/chat/:id' element={<Chat/>}/>
        <Route  path='/profile/:id' element={<Profile/>}/>
        <Route path="/user/:id" element={<UserProfile />} /> 
        <Route  path='/' element={<Screensaver/>}/>
        <Route  path='/friends' element={<Friends/>}/>
        <Route  path='/messages' element={<Messages/>}/>
        <Route  path='/authorization' element={<Authorization/>}/>
        <Route  path='/registration' element={<Registration/>}/>


        <Route  path='/adminUsers' element={<AdminUsers/>}/>
        <Route  path='/adminPosts' element={<AdminPosts/>}/>
        <Route  path='/adminCategories' element={<AdminCategories/>}/>
      </Routes>
    </>
  )
}

export default App
