import React from 'react'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'
import ShippingForm from './shippingForm'
import CombinedFormPage from './form'

const page = () => {
  return (
    <div>
      <Header />
      <ProtectedRoute>
    <CombinedFormPage />
      </ProtectedRoute>
    </div>
  )
}

export default page
