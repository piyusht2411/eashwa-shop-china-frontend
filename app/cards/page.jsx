import React from 'react'
import Cards from './cards'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'

const Page = () => {
  return (
    <div>
        <Header />
   <ProtectedRoute>
       <Cards />
   </ProtectedRoute>
    </div>
  )
}

export default Page
