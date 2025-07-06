import React from 'react'
import ProtectedRoute from '../protectedRoute'
import BankStatusForm from './bankStatusForm'
import Header from '../header'

const page = () => {
  return (
    <div>
        <Header />
      <ProtectedRoute>
        <BankStatusForm />
      </ProtectedRoute>
    </div>
  )
}

export default page
