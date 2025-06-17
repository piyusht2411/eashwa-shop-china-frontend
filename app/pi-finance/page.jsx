import React from 'react'
import Header from '../header'
import ProtectedRoute from '../protectedRoute'
import PiFinanceForm from './piFinanceForm'

const page = () => {
  return (
    <div>
      <Header />
      <ProtectedRoute>
        <PiFinanceForm />
      </ProtectedRoute>
    </div>
  )
}

export default page
