import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Typography, Container, Box } from '@mui/material'

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())
        
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
        
        try {
            const res = await axios.post(`https://social-post-application-ntj3.onrender.com${endpoint}`, data, {
                withCredentials: true
            })
            // Token ko localStorage me save kar rahe hain taaki aage use ho
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/feed')
        } catch (error) {
            alert(error.response?.data?.message || 'Error occurred')
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'white', textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && <TextField name="name" label="Full Name" required />}
                    <TextField name="email" type="email" label="Email" required />
                    <TextField name="password" type="password" label="Password" required />
                    <Button type="submit" variant="contained" sx={{ bgcolor: '#4a148c' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </form>
                <Button sx={{ mt: 2 }} onClick={() => setIsLogin(!isLogin)}>
                    Switch to {isLogin ? 'Register' : 'Login'}
                </Button>
            </Box>
        </Container>
    )
}

export default Auth