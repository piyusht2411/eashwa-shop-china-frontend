import React from 'react'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'
import ShippingForm from './shippingForm'

const page = () => {
  return (
    <div>
      <Header />
      <ProtectedRoute>
        <ShippingForm />
      </ProtectedRoute>
    </div>
  )
}

export default page
