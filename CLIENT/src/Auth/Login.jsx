import { useState, useContext } from "react";
import axios from 'axios'
import { UserContext } from "../context/userContext";

function Login () {
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const { setUser, setIsLoggedIn, isLoggedIn} = useContext(UserContext);

    const handleLogin = async ()=>{
        if (username.trim() === "" || password.trim() === "") {
            alert('Please enter username and password')
            return
        }else {
            const userData = {
                username:username,
                password: password
            }
        
        try{
          
            const response = await axios.post('http://localhost:5000/login',userData)
            setIsLoggedIn(true)
            console.log(response.data)
            const user = {
             accessToken:response.data.accessToken,
             id: response.data._id,
             username:response.data.username
            }
            console.log(user.id)
           const userString= JSON.stringify(user)
           setUser(user) 
        }catch(e){
        alert('Error during login')
        console.error('Error during login', error) 
        }
    }}
    return (<>
        { !isLoggedIn && (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login Page</h2>
              </div>
            <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">User Name</label>
                <input id="username" name="username" type="text" onChange={(e) => setUserName(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="User Name"/>
              </div>
              <div>
                <label htmlFor="password" className="sr-only" required>Password</label>
                <input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"/>
              </div>
            </div>
  
            <div>
              <button type="button" onClick={handleLogin} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Login
              </button>
            </div>
          </form>
          </div>
          </div>
        )}
        </>)
    }
        export default Login