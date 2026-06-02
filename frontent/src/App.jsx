import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'
import Auth from './pages/Auth'

const App = () => {
  // Check kar rahe hain ki user ke paas token hai ya nahi
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Smart Redirect: Login hai toh feed, warna auth */}
        <Route path='/' element={<Navigate to={isAuthenticated ? "/feed" : "/auth"} replace />} />
        
        <Route path='/auth' element={<Auth />} />
        <Route path='/create-post' element={<CreatePost />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </Router>
  )
}

export default App