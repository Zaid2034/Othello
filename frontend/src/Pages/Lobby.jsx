/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect,useState,useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext} from '../UserContext';
import axios from 'axios';
import { Request } from '../Components/Request';
import { uniqBy } from 'lodash';

export const Lobby = () => {
    var [ws,setWs]=useState(null)
    const navigate=useNavigate()
    const [onlineUser,setOnlineUser]=useState({})
    const {username, id,setSelectedUserId,selectedUserId,turn,setTurn,setId,isPlaying,setIsPlaying,setSelectedUsername,selectedUsername} = useContext(UserContext);
    // const [isPlaying,setIsPlaying]=useState(false)
    const [request,setRequest]=useState(false)
    const idRef=useRef(id)
    const [requestList,setRequestList]=useState([])
    console.log('username is:',username)
    console.log('Playing is:',isPlaying)
    const isPlayingRef = useRef(isPlaying)
    console.log('Selected User is:',selectedUserId)
   // const [leaveLoseId,setLeaveLoseId]=useState(null)
    useEffect (() => {
        const token = localStorage.getItem ('token');
        connectTows (token);
        if(!id){
            navigate('/')
        }
        return ()=>{
           
        }
    }, []);
    useEffect(()=>{
        console.log('In lobby useEffect')
        isPlayingRef.current = isPlaying
        if(isPlaying)
        navigate ('/game')
    },[isPlaying])
    // useEffect(()=>{
    //     console.log('In useEffect of ws')
    //     if (ws && ws.readyState === WebSocket.OPEN) {
    //         console.log('In if of ws')
    //         ws.send(JSON.stringify({
    //             isPlaying: false,
    //             loserId: id
    //         }));
    //     }
    // },[ws])

    useEffect (() => {
        const isRefreshed = sessionStorage.getItem ('isRefreshed');
        if (isRefreshed) {
            sessionStorage.removeItem ('isRefreshed');
            navigate ('/');
        } else {
            sessionStorage.setItem ('isRefreshed', 'true');
        }

        return () => {
            sessionStorage.removeItem ('isRefreshed');
        };
    },[navigate]);
    // useEffect(()=>{
    //     if(leaveLoseId){
    //         if(leaveLoseId.userId==id){
    //             ws.send(JSON.stringify({
    //                 winnerId:leaveLoseId.playerId,
    //                 winnerName:"You"
    //             }))
    //         }
    //     }

    // },[leaveLoseId])

    function connectTows (token) {
        if (token) {
            const ws = new WebSocket (`ws://localhost:3000?token=${token}`);
            setWs (ws);
            ws.addEventListener ('message', handleMessage)
            ws.addEventListener('open', () => {
            console.log('WebSocket connection established');
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
    function showOnlineUser(onlinePeople){
        const people={}
        onlinePeople.forEach((user)=>{
            people[user.userId]=user.username
        })
        
        setOnlineUser(people)
    }

    function handleMessage(e){
        console.log(e.data)
        const messageData=JSON.parse(e.data)
        console.log('message data is:',messageData)
        if('online' in messageData){
            showOnlineUser(messageData.online)
        }
        if('request' in messageData){
            console.log('message Data is:',messageData)
            console.log ('id is:', idRef.current)
            console.log('playing is:',isPlayingRef.current)
            if(messageData.request.userId==id){
                if(!isPlayingRef.current){
                    console.log ('id is:', id);
                    console.log ('requested id is:', messageData.request.requestedId);
                    console.log ('message data is:', messageData.request);
                    // setSelectedUserId(messageData.request.requestedId)
                    // setRequest(true)
                    setRequestList (requestList => {
                    const newRequestList = [...requestList];
                    newRequestList.push ({
                        playername: messageData.request.username,
                        playerId: messageData.request.requestedId,
                    });
                    console.log ('new Request List:', newRequestList);
                    return newRequestList;
                    });
                }
                
            }
        }
        // if('boardState' in messageData){
        //     console.log('In board message')
        //     setLeaveLoseId({userId:messageData.boardState.userId,playerId:messageData.boardState.playerId})
            
        // }
        if('rejected' in messageData){
            console.log('In rejected')
            if(messageData.rejected.userId==id){
                alert(`${messageData.rejected.username} is already playing`)
            }
        }
        if('accept' in messageData && !isPlaying){
            if(messageData.accept.userId==id){
                setIsPlaying(true)
                setSelectedUserId(messageData.accept.requestedId)
                const requestedId = messageData.accept.requestedId
                console.log ('userId is:',requestedId)
                console.log('username is:',messageData.accept.requestedUsername)
                setSelectedUsername(messageData.accept.requestedUsername)
                console.log('Online user is:',onlineUser)
                setTurn(1) 
            }
        }
    }

    // if(isPlaying){
    //    
    // }
    function handleClick(userId,opponentName){
        console.log('In handle Click')
        ws.send(JSON.stringify({
            message:{
                userId:userId,
                username:onlineUser[id]  
            }
        }))
    }
    function playGame(playerId){
        ws.send(JSON.stringify({
            accepted:true,
            userId:playerId
        }))
        setIsPlaying (true)
    }
    console.log('id is:',id)
    function acceptGame(playerId){
        setSelectedUserId(playerId)
        setSelectedUsername (onlineUser[playerId])
        playGame(playerId)
    }
    function rejectGame(playerId){
        console.log('In reject game')
        setRequestList (requestList => {
            const newRequestList = [...requestList]
            const newRequestList2=newRequestList.filter(request=>request.playerId!=playerId)
            return newRequestList2
        })
    }
    const userRequestWithoutDupes=uniqBy(requestList,'playername')
    const onlineUserExcludedItself={...onlineUser}
    delete onlineUserExcludedItself[id]
    if(request){
        return <div>
            <button onClick={playGame}>Accept</button>
        </div>
    }
    return (
        <div className='flex'>
        <div className="flex flex-col gap-3 w-[50%]">
            {Object.keys (onlineUserExcludedItself).map (userId => (
                <div
                className="bg-slate-400"
                onClick={() => {
                    handleClick (userId,onlineUserExcludedItself[userId]);
                }}
                >
                {onlineUser[userId]}
                </div>
            ))}
        </div>
        <div>
            {userRequestWithoutDupes.map((request)=>{
                return <Request playername={request.playername} accept={()=>{acceptGame(request.playerId)}} reject={()=>{rejectGame(request.playerId)}}/>
            })}
        </div>
        </div>
        
    )
}
