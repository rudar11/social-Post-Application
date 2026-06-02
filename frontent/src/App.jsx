import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'
import Auth from './pages/Auth'

const App = () => {

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
     
        <Route path='/' element={<Navigate to={isAuthenticated ? "/feed" : "/auth"} replace />} />
        
        <Route path='/auth' element={<Auth />} />
        <Route path='/create-post' element={<CreatePost />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </Router>
  )
}

export default App