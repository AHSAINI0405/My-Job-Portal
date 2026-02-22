import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from "./routes/AppRoutes";
// import Navbar from "./common/Navbar";
function App() {
  
  
const API=import.meta.env.VITE_API_URL;
// const user=JSON.parse(localStorage.getItem(user));
  return (
    <>
    <AppRoutes/>
    {/* <UserNavbar username={user?.name || "User"} /> */}
      
    </>
  )
}

export default App
