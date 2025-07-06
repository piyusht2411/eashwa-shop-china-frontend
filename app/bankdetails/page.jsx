import React from 'react'
import ProtectedRoute from '../protectedRoute'
import BankStatusTable from './bankStatustable'
import Header from '../header'

const page = () => {
  return (
    <div>
        <Header />
      <ProtectedRoute>
        <BankStatusTable />
      </ProtectedRoute>
    </div>
  )
}

export default page
