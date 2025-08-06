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
          <div className="flex items-center gap-2">
            <img src={Logo} className="h-30" />
            <h1 className='text-white text-center text-2xl bold mt-9 '>
              Library Management System
            </h1>
          </div>
          <div className='mt-40'>
            <p className='text-white text-m bold  my-2'>
              New to our platform? Sign Up now.
            </p>
            <button type='submit' className="bg-black h-14 w-50 rounded-2xl text-white cursor-pointer hover:bg-[#272727] transition-all duration-200 border-white border-2 ">
              SIGN IN
            </button>
          </div>
        </div>
        
        <div className="w-full sm:w-[50%] flex justify-center items-center px-8 sm:px-20 py-24">
          {/* log in contain garne div */}
          <div className="h-full w-full flex flex-col justify-center items-center gap-12">
            {/* heading wala section */}
            <img src={Logo} className="h-15 place-items-center" />
            <div className="text-center justify-center">
              <h1 className="font-bold text-4xl">Signin</h1>
              <p className="mt-2">
                Already have Account? Sign In now.
              </p>
            </div>

            {/* login form */}
            <form onSubmit={handleSubmit}
              action="submit"
              className="w-full sm:w-96 gap-2 flex flex-col "
            >
              <div className="flex items-center gap-2">
                
                
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 border-[#3D3E3E] rounded-2xl h-14 w-full p-2"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastname"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 rounded-2xl h-14 w-full p-2 border-[#3D3E3E]"
                />
              </div>

              <div className="flex items-center gap-2 mt-3">
                
                
                <input
                  type="text"
                  placeholder="Contact No"
                  name="contact"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 rounded-2xl h-14 w-full p-2 sm:w-[40%] border-[#3D3E3E]"
                />

                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 rounded-2xl h-14 w-full p-2 sm:w-[60%] border-[#3D3E3E]"
                />
              </div>
              
              <div className="flex items-center gap-2 mt-3">

                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 border-[#3D3E3E] rounded-2xl h-14 w-full p-2"
                />

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handelChange}
                  className="bg-[#ffffff] border-2 border-[#3D3E3E] rounded-2xl h-14 w-full p-2"
                />
              </div>
              

              <button type='submit' className="bg-black h-14 w-full rounded-2xl text-white cursor-pointer hover:bg-[#575757] transition-all duration-200 mt-7">
                Login
              </button>
             
            </form>

            
          </div>
        </div>
        
        
      </div>
      
    </>
  )
}

export default Login
