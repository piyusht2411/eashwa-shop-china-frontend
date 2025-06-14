import React from 'react'
import Link from "next/link";
import { FaUserCircle } from 'react-icons/fa';
const Header = () => {
  return (
   <>
    <div className="bg-none">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 ">
        {/* Logo */}
    <Link href='/'>
     <img src="/logo.png" alt="logo"
       className="w-16 h-12"
       />
    </Link>
 
        {/* Login Icon */}
     
      </header>

   
      
    </div>
   </>
  )
}

export default Header
