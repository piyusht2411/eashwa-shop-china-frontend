import React from 'react'
import Clearance from './clearance'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'

const page = () => {
  return (
    <div>
      <Header />
     <ProtectedRoute >
       <Clearance />
     </ProtectedRoute>
    </div>
  )
}

export default page
