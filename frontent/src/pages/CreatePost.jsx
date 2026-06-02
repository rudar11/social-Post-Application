import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Typography, Container, Box } from '@mui/material'

const CreatePost = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        
        try {
            const token = localStorage.getItem('token') // Auth token nikala
            await axios.post('http://localhost:3000/api/posts', formData, {
                headers: { Authorization: `Bearer ${token}` }, // Token backend ko bheja
                withCredentials: true
            })
            navigate('/feed')
        } catch (error) {
            console.error('Error creating post:', error)
            alert("Please login first to create a post!")
        }
    }

  return (
    <Container maxWidth="sm">
        <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">Create Post</Typography>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="file" name='image' accept='image/*' required style={{ padding: '10px 0' }}/>
                <TextField name='caption' placeholder='Enter caption' required multiline rows={3} />
                <Button type='submit' variant="contained" sx={{ bgcolor: '#4a148c' }}>Submit</Button>
            </form>
        </Box>
    </Container>
  )
}

export default CreatePost