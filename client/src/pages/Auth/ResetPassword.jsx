//rafce
import { useState } from 'react';
import axios from "axios"
import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";


const Login = () => {

  const[userData, setUserData]=useState({
      email:'',
      password:''
    })
    const handelChange=(e)=>{
      const{name, value}=e.target;
      setUserData({
        ...userData,
        [name]:value
      })
    }
  
    const handleSubmit=async(e)=>{
      e.preventDefault()
      const response= await axios.post('http://localhost:5000/api/auth/login', userData);
      const token=response.data.token;
      localStorage.getItem("token", token)
      alert("Login sucessfully")

    }
  




  return (
    <>
      <div className="h-screen w-full flex">
        {/* 1st section */}
        <div className="w-[50%]  bg-black hidden sm:flex justify-center items-center rounded-4xl flex-col">
          
          <div className="flex items-center gap-2 mb-7">
            <img src={Logo} className="h-30" />
            <h1 className='text-white text-center text-2xl bold mt-9 '>
              Library Management System
            </h1>
          </div>
          <div className='mt-5'>
            <p className='text-white text-center text-3xl text-m bold my-2'>
              "Your premier digital library
            </p>  
            <p className='text-white text-center text-3xl text-m bold my-2'>
               for borrowing and reading 
            </p>  
            <p className='text-white text-center text-3xl text-m bold my-2'>
               books"
            </p> 
          </div>         
        </div>
        
        <div className="w-full sm:w-[50%] flex justify-center items-center px-8 sm:px-20 py-24">
          {/* log in contain garne div */}
          <div className="h-full w-full flex flex-col justify-center items-center gap-12">
            {/* heading wala section */}
            <img src={Logo} className="h-15 place-items-center" />

            
            <div className="text-center justify-center">
              <h1 className="font-bold text-4xl">Reset Password</h1>
              <p className="mt-2">
                Please enter your new password
              </p>
            </div>

            {/* login form */}
            <form onSubmit={handleSubmit}
              action="submit"
              className="w-full sm:w-96 gap-2 flex flex-col"
            >
              <div className="flex items-center gap-2">        
                <input
                  type="password"
                  placeholder="New Password"
                  name="password"
                  onChange={handelChange}
                  className="bg-[#ffffff] rounded-2xl border-black h-14 w-full p-2 border-2"
                />
              </div>
              <div className="flex items-center gap-2">        
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password"
                  onChange={handelChange}
                  className="bg-[#ffffff] rounded-2xl border-black h-14 w-full p-2 border-2"
                />
              </div>
              <button type='submit' className="bg-black h-14 w-full rounded-2xl text-white cursor-pointer hover:bg-[#575757] transition-all duration-200 mt-7">
                RESET PASSWORD
              </button>
             
            </form>

            
          </div>
        </div>
        
        
      </div>
      
    </>
  )
}

export default Login
