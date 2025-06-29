import React from 'react'
import ProtectedRoute from '../protectedRoute'
import SearchCard from './searchCard'

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <SearchCard />
      </ProtectedRoute>
    </div>
  )
}

export default page
