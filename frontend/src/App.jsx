/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useTransition } from 'react'
import { Board } from './Pages/Board'
import LoginSignUpForm from './Pages/LoginSignup'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserContextProvider } from './UserContext'
import { Lobby } from './Pages/Lobby'
import { Home } from './Pages/Home'

function App() {
  //axios.defaults.baseURL='https://othello-s6zk.onrender.com/'
  axios.defaults.baseURL = 'http://localhost:3000/'
  return (

    <UserContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginSignUpForm/>}/>
        <Route path='/lobby' element={<Lobby/>}/>
        <Route path='/game' element={<Board/>}/>
        <Route path="/home" element={<Home/>} />
      </Routes>
    </BrowserRouter>

    </UserContextProvider>
    
  )
}

export default App
