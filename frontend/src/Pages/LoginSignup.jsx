/* eslint-disable no-unused-vars */
import React, { useState,useContext, useEffect } from "react";
// import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'
import { UserContext } from "../UserContext";
import axios from "axios";
// import {useGoogleLogin} from '@react-oauth/google';
// import {helix} from 'ldrs';
import {jwtDecode} from 'jwt-decode'
// helix.register ();
const LoginSignUpForm = () => {
  const navigate=useNavigate()
  const [isLoginSignUp, setIsLoginSignUp] = useState ('login');
  const {username,setUsername,id,setId} = useContext(UserContext);
  const [formData, setFormData] = useState ({
    email: '',
    username: '',
    password: '',
  });
  //Schema for form validation
  const userSignInSchema = yup.object ().shape ({
    email: yup
      .string ()
      .email ('Invalid email format')
      .required ('Email is required')
      .max (50, 'Email must be at most 50 characters long')
      .trim (),
    password: yup
      .string ()
      .required ('Password is required')
      .min (6, 'Password must be at least 6 characters long'),
  });
  const userSignUpSchema = yup.object ().shape ({
    email: yup
      .string ()
      .email ('Invalid email format')
      .required ('Email is required')
      .max (50, 'Email must be at most 50 characters long')
      .trim (),
    username: yup
      .string ()
      .required ('Username is required')
      .min (3, 'Username must be at least 3 characters long')
      .max (30, 'Username must be at most 30 characters long')
      .trim ()
      .lowercase ('Username must be lowercase'),
    password: yup
      .string ()
      .required ('Password is required')
      .min (6, 'Password must be at least 6 characters long'),
  });
  useEffect(()=>{
    const token=localStorage.getItem('token')
    if(token){
      try{
        axios.get('/profile',{
          headers:{
            Authorization:'Bearer '+token
          }
        }).then((res)=>{
          if(res.data.message=='OK'){
            setId(res.data.userId)
            setUsername(res.data.username)
            console.log('res in use effect:',res)
            navigate('/lobby')
          }
        })

      }catch(err){
        alert(`${err} ${err.response.data.message}`)
      }
        
    }
    return ()=>{   
    }
  },[])

  //Google authentication


  const handleChange=(e)=>{
    const {name,value}=e.target
    setFormData({
      ...formData,
      [name]:value
    })
    
  }

  //Form Submit
  const handleSubmit = async e => {
    e.preventDefault ();
    let schema;
    if (isLoginSignUp === 'login') {
      schema = userSignInSchema;
    } else {
      schema = userSignUpSchema;
    }
    try {
      await schema.validate (formData, {abortEarly: false});
      const email = formData.email;
      const username = formData.username;
      const password = formData.password;
      let res;
      if (isLoginSignUp === 'login') {
        try{
        //   setIsLoading (true);
          res = await axios.post ('/signin', {email, password});
        //   setIsLoading (false);
          setId(res.data.userId)
          setUsername(res.data.username)
          console.log('res is in login:',res.data)
        }catch(err){
        //   setIsLoading (false);
          alert(`${err} ${err.response.data.message}`)
        }
      } else {
          try{
            // setIsLoading (true);
            res = await axios.post ('/signup', {email, username, password});
            // setIsLoading (false);
            setId(res.data.userId)
            setUsername(res.data.username)
          }catch(err){
            // setIsLoading (false);
            alert (`${err} ${err.response.data.message}`);
          }
      }
      localStorage.setItem ('token', res.data.token);
    //   setisLoggedIn (true);
       navigate ('/lobby');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach (err => {
          validationErrors[err.path] = err.message;
          alert(err.message)
        });
      }
    }
};
  return (

    <div className="relative flex items-center justify-center md:bg-wood-gradient bg-cover bg-center" style={{backgroundImage: `url(https://allsafal.com/wp-content/uploads/2022/01/Othello-Game.png)`}} >
      <div className="absolute inset-0 bg-black opacity-50" />
      <form className="relative z-10 w-[320px] sm:w-[375px] max-w-md min-h-screen px-6 py-4 bg-green-100 bg-white md:shadow-md" onSubmit={handleSubmit}>
        <h4 className="mb-2 text-3xl font-semibold mt-8 ">{isLoginSignUp==='login'?"Login to your account":"Create your new account"}</h4>
        <p className="text-[#878787] font-medium text-sm ">{isLoginSignUp === 'signup'? 'Create an account to start looking for the food you like': 'Please signin to your account'}</p>
        
        <div className={`flex flex-col gap-y-2  ${isLoginSignUp==='login'? 'mt-8':'mt-1'}`}>
          <div className="h-[20px] font-medium text-sm mb-1">Email Address</div>
          <input 
            value={formData.email}
            type="email" 
            name='email'
            placeholder="Email Address" 
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" 
            required
            onChange={handleChange}
          />
        </div>
        
        {isLoginSignUp==='signup' && 
          <div className="flex flex-col gap-2">
            <div className="h-[20px] font-medium text-sm">User Name</div>
              <input 
                value={formData.username}
                type="text" 
                name='username'
                placeholder="User Name" 
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" 
                required
                onChange={handleChange} 
              />

          </div>
        }

        <div className="flex flex-col gap-2 ">
          <div className="h-[20px] font-medium text-sm">Password</div>
          <input 
            value={formData.password}
            type="password" 
            name='password'
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary" 
            required 
            onChange={handleChange}
          />   
        </div>

        {/* {isLoginSignUp==='login' && <>
          <div className="flex flex-col items-end w-full my-6">
            <button className="text-primary text-sm font-medium">Forget Password?</button>
          </div>
        </>
        }   */}
        <button 
          type="submit" 
          className="w-full h-[52px] mb-4 text-white bg-primary rounded-full text-sm font-semibold bg-brown-gradient mt-10"
        >
          {isLoginSignUp==='signup'?"Register":"Sign In"}
        </button>

        <div className="flex items-center mb-4 w-full mt-2">
            <div className="border-t-2 w-[30%]"></div>
            <div className="text-xs text-center text-[#878787] w-[30%] font-medium md:text-sm mx-[5%] ">Or sign in with</div>
            <div className="border-t-2 w-[30%]"></div>
        </div>

        <div className="flex justify-center items-center mt-6">
            <button type="button" className="flex justify-center items-center w-[40px] h-[40px] rounded-full border border-b-gray-300 "
              
            >
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.327 16.3285 15.1115 18 12.5 18C9.1865 18 6.5 15.3135 6.5 12C6.5 8.6865 9.1865 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C6.9775 2 2.5 6.4775 2.5 12C2.5 17.5225 6.9775 22 12.5 22C18.0225 22 22.5 17.5225 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z" fill="#FFC107"/>
                <path d="M3.65295 7.3455L6.93845 9.755C7.82745 7.554 9.98045 6 12.5 6C14.0295 6 15.421 6.577 16.4805 7.5195L19.309 4.691C17.523 3.0265 15.134 2 12.5 2C8.65895 2 5.32795 4.1685 3.65295 7.3455Z" fill="#FF3D00"/>
                <path d="M12.5 22C15.083 22 17.43 21.0115 19.2045 19.404L16.1095 16.785C15.0718 17.5742 13.8038 18.001 12.5 18C9.89903 18 7.69053 16.3415 6.85853 14.027L3.59753 16.5395C5.25253 19.778 8.61353 22 12.5 22Z" fill="#4CAF50"/>
                <path d="M22.3055 10.0415H21.5V10H12.5V14H18.1515C17.7571 15.1082 17.0467 16.0766 16.108 16.7855L16.1095 16.7845L19.2045 19.4035C18.9855 19.6025 22.5 17 22.5 12C22.5 11.3295 22.431 10.675 22.3055 10.0415Z" fill="#1976D2"/>
            </svg>

            </button>
        </div>

        {isLoginSignUp==='signup' && (
          <div className="text-center p-2 mt-6 font-medium text-sm ">
            Have an account?
            <button
              type="button"
              className="text-primary hover:underline ml-1"
              onClick={() => {
                setIsLoginSignUp ('login');
              }}
            >
              {' '}
              Sign In
            </button>
          </div>


        )}
        {isLoginSignUp==='login' && (
          <div className="text-center p-2 mt-6 font-medium text-sm">
            Dont have an account?
            <button
              className="text-primary hover:underline ml-1"
              onClick={() => {
                setIsLoginSignUp ('signup');
              }}
            >
              {' '}
              Sign Up
            </button>
          </div>
        )}
        
         
      </form>
    </div>
  );
};

export default LoginSignUpForm;
