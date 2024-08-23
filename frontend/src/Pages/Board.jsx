/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React,{useState,useEffect, useContext,useRef} from 'react'
import { UserContext } from '../UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {checkLose, checkPosition, showValidPos } from '../GameLogic/gameLogic'

export const Board = () => {
  const [board,setBoard]=useState([])
  const {username,id,isPlaying,setIsPlaying,selectedUsername}=useContext(UserContext)
  const navigate=useNavigate()
  const [count,setCount]=useState(0)
  const [send,setSend]=useState(false)
  const {selectedUserId,turn}=useContext(UserContext)
  const [lose,setLose]=useState(false)
  const [ws,setWs]=useState(null)
  const [rejectedId,setRejectedId]=useState(null)
  const[myChance,setmyChance]=useState(turn?false:true)
  const [loseByRefresh,setLoseByRefresh]=useState(false)
  const countRef=useRef(count)
  useEffect (() => {
    const token = localStorage.getItem ('token');
    connectTows (token);

    // Set up beforeunload and unload event listeners
    window.addEventListener ('beforeunload', handleBeforeUnload);
    window.addEventListener ('unload', handleUnload);

    return () => {
      window.removeEventListener ('beforeunload', handleBeforeUnload);
      window.removeEventListener ('unload', handleUnload);
    };
  }, []);

const handleBeforeUnload = event => {
  // Set a temporary flag indicating a potential unload
  window.unloading = true;

  // Display the confirmation dialog
  event.preventDefault ();
  event.returnValue = ''; // Chrome requires returnValue to be set
};

const handleUnload = () => {
  if (window.unloading) {
    // Finalize the state change only if the unload happens
    console.log('In unload')
    setLoseByRefresh (true);
  }
};

  
  useEffect(()=>{
    countRef.current=count
    if(count>0){
      ws?.send (
        JSON.stringify ({
          rejected: true,
          username: username,
          userId:rejectedId
        })
      )
    }
  },[count])
  useEffect(()=>{
    if(!isPlaying){
      //console.log('Selected User is:',selectedUserId)
      navigate ('/lobby');
    }
  },[isPlaying])
  // useEffect(()=>{
  //   if(lose){
  //     ws.send(JSON.stringify({
  //       winnerId:selectedUserId,
  //       winnerName:selectedUsername
  //     }))
  //     setIsPlaying(false)
  //   }
  // },[lose]) 
  function connectTows(token){
      if(token){
        const ws = new WebSocket (`wss://othello-s6zk.onrender.com?token=${token}`);
        // const ws = new WebSocket (`ws://localhost:3000?token=${token}`)
        setWs(ws);
        ws.addEventListener('message',handleMessage)
        ws.addEventListener('open', () => {
            console.log('WebSocket connection established');
            const obj={
              userId:selectedUserId,
              username:username,
              playerId:id
            }
            console.log('obj is:',obj)
            ws.send(JSON.stringify({
              OpponentAccepted:true,
              userId:selectedUserId,
              username:username,
              playerId:id
            }));
        });
      }else{
        navigate('/')
      }
  }
  // useEffect(()=>{
  //   if(loseByRefresh){
  //     'In lose use effect'
  //     ws.send(JSON.stringify({
  //       winnerId:selectedUserId,
  //       winnerName:selectedUsername
  //     }))
  //   }

  // },[loseByRefresh])
  function handleMessage(e){
    const messageData=JSON.parse(e.data)
    // if('winnerId' in messageData){
    //   if(messageData.winnerId==id){
    //     alert(`Congratulation you win the game`)
    //     setIsPlaying(false)
    //   }
    // }
    if('boardState' in messageData){
      if(messageData.boardState.userId==id){
        showValidPos(messageData.boardState.board,turn)
        setBoard(messageData.boardState.board)
        setmyChance(true)
        const ansLose=checkLose(messageData.boardState.board,turn)
        if(!ansLose){
          alert (`You loses`);
          setIsPlaying(false)
        }
        
      }
    }
    if('request' in messageData){
      if(messageData.request.userId == id){
        setRejectedId(messageData.request.requestedId)
        setCount (countRef.current + 1)
      }
      
    }
    if ('accept' in messageData) {
      if (messageData.accept.userId == id) {
        setRejectedId (messageData.accept.requestedId);
        setCount (countRef.current + 1);
      }
    }
    if ('rejected' in messageData) {
      if (messageData.rejected.userId == id) {
        setIsPlaying(false)
        alert (`${messageData.rejected.username} is already playing`);
      }
    }
    if('isPlaying' in messageData){
      if(messageData.loserId==selectedUserId){
        alert('You win the game')
        setIsPlaying(false)
      }
    }
  }

  useEffect(()=>{
    setBoard([])
    for(let i=0;i<8;i++){
      const row=[]
      for(let j=0;j<8;j++){
        if((i==3 && j==3) || (i==4 && j==3) )
        row.push({col:j,turn:1});
        else if((i==3 && j==4) || (i==4 && j==4) || (i==2 && j==4))
        row.push({col:j,turn:0})
        else
        row.push ({col: j, turn: -1})

      }
      setBoard((board)=>{
        const newBoard=[...board]
        newBoard.push(row)
        return newBoard
      })
    }
  },[])
  
  useEffect(()=>{
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        setBoard((board)=>{
          const newBoard2=[...board]
          if(newBoard2[i][j].turn==-2){
            newBoard2[i][j].turn=-1;
          }
          return newBoard2
        })
      }
    }
    ws?.send(JSON.stringify({
      boardState:{
        board:board,
        playerId:id,
        userId:selectedUserId,
      }
    }))
  },[send])
  
  const handleClick=(row,col)=>{
    const newBoard=[...board]
    if(checkPosition(row,col,board,row,col,turn,0,newBoard)){
      setBoard((board)=>{
        newBoard[row][col].turn=turn
        return newBoard
      })
      setmyChance(false)
      setSend(!send)
    }else{
      console.log('Not valid move')
    }
    
  }
  return (
    <>
      <div className='flex flex-col justify-center items-center min-h-screen bg-wood-gradient'>
       {username?(<div>{username} vs {selectedUsername}</div>):null}
        {
          board.map((row,indexRow)=>(
            <div className='grid grid-cols-8 shadow-2xl'>
            {row.map((col,indexCol)=>{
              return (
                <div className='w-[50px] h-[50px] bg-green-500 flex justify-center items-center border border-black' onClick={()=>{
                  if((col.turn==-1 || col.turn==-2) && myChance)
                  handleClick(indexRow,col.col)
                  else
                  alert('Not your chance')
                }}>
                  {col.turn==1?(<div className='w-[40px] h-[40px] rounded-full bg-white shadow-xl border-1 border-black'></div>):col.turn==0?(<div className='w-[40px] h-[40px] bg-black rounded-full shadow-xl'></div>):col.turn==-2?(<div className='w-[10px] h-[10px] bg-black rounded-full shadow-xl'></div>):null}
                </div>
              )
            })}
            </div>
          ))
        }

      </div>
    </>
  )
}
