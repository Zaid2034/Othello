/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const Request = ({playername,accept,reject}) => {
  return (
    <div className='flex'>
        <div className='mr-2'>{playername}</div>
        <button className='mr-2' onClick={()=>{accept()}}>Accept</button>
        <button onClick={reject}>Reject</button>
    </div>
  )
}
