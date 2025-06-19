import React from 'react'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'

import TransportationForm from './transportationForm'

const page = () => {
  return (
    <div>
      <Header />
      <ProtectedRoute>
       <TransportationForm />
      </ProtectedRoute>
    </div>
  )
}

export default page
