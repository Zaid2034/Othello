/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {createContext, useState, useEffect} from 'react';
import axios from 'axios';
export const UserContext = createContext ({});

export function UserContextProvider({children}) {
  const [username,setUsername]=useState('')
  const [id,setId]=useState('')
  const [selectedUserId, setSelectedUserId] = useState ('');
  const [selectedUsername, setSelectedUsername] = useState ('');
  const [turn,setTurn]=useState(0)
  const [ws, setWs] = useState (null)
  const [isPlaying,setIsPlaying]=useState(false)

  return (
    <UserContext.Provider
      value={{username,setUsername,id,setId,selectedUserId,setSelectedUserId,turn,setTurn,ws,setWs,isPlaying,setIsPlaying,selectedUsername,setSelectedUsername}}
    >
      {children}
    </UserContext.Provider>
  );
}
