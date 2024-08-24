/* eslint-disable no-unused-vars */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect,useState,useContext } from 'react'
import { UserContext } from '../UserContext'

export const Home = () => {
    const navigate=useNavigate()
    const [ws,setWs]=useState(null)
    const {id,setIsPlaying}=useContext(UserContext)
    useEffect (() => {
        const token = localStorage.getItem ('token');
        connectTows (token);
        return ()=>{
           
        }
        
    }, []);
    function connectTows (token) {
        if (token) {
            const ws = new WebSocket (`ws://localhost:3000?token=${token}`);
            //const ws = new WebSocket (`wss://othello-s6zk.onrender.com?token=${token}`)
            setWs (ws);
            ws.addEventListener('open', () => {
                console.log('WebSocket connection established');
                setIsPlaying(false)
                ws.send(JSON.stringify({
                    isPlaying: false,
                    loserId: id
                }));
            });
            console.log ('in connection to ws');
        } else {
            navigate ('/');
        }
    }
  return (
    <div className='flex justify-center items-center h-screen bg-slate-200'>
        <div className='flex flex-col w-[60%] h-[60%] p-2 items-center justify-center'>
            <button className='w-[30%] border rounded-xl p-2 mb-2 bg-white font-semibold' onClick={()=>{navigate('/lobby')}}>Play with Friends</button>
            <button className='w-[30%] border rounded-xl p-2 mb-2 bg-white font-semibold'>Play with CPU</button>
            <button className="w-[30%] border rounded-xl p-2 mb-2 bg-white font-semibold">Rules</button>
            <button className="w-[30%] border rounded-xl p-2 mb-2 bg-white font-semibold">About</button>
        </div>
    </div>
  )
}
