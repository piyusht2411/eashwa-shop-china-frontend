import React from 'react'
import ProtectedRoute from '../protectedRoute'
import TransPortationDetails from './transportationDetails'
const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <TransPortationDetails />
      </ProtectedRoute>
    </div>
  )
}

export default page
