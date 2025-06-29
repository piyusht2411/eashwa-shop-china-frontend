import React from 'react'
import ProtectedRoute from '../protectedRoute'
import ClearanceDetails from './cleranceDetails'

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <ClearanceDetails />
      </ProtectedRoute>
    </div>
  )
}

export default page
