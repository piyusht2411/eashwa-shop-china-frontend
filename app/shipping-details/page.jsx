import React from 'react'
import ProtectedRoute from '../protectedRoute'
import PiFinanceShippingDetails from './piFinanceShippingDetails'

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <PiFinanceShippingDetails />
      </ProtectedRoute>
    </div>
  )
}

export default page
