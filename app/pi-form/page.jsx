import React from 'react'
import Header from '../header'
import PiForm from './piForm'
import ProtectedRoute from '../protectedRoute'

const page = () => {
  return (
    <div>
        <Header />
        <ProtectedRoute >
            <PiForm />
        </ProtectedRoute>
      
    </div>
  )
}

export default page
