import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, Container, Box, Button, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material'
import { Favorite, FavoriteBorder, Comment, Delete, Logout } from '@mui/icons-material' // Logout icon add kiya

const Feed = () => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const fetchPosts = () => {
        axios.get("https://social-post-application-ntj3.onrender.com/api/posts", { withCredentials: true })
        .then((res) => setPosts(res.data.posts))
        .catch((err) => console.log(err))
    }

    useEffect(() => {
      fetchPosts()
    }, [])

    const handleLike = async (postId) => {
        if (!currentUser) return alert("Please login to like posts")
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post(`https://social-post-application-ntj3.onrender.com/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            setPosts(posts.map(p => p._id === postId ? { ...p, likes: res.data.likes } : p))
        } catch (error) {
            console.error("Like failed", error)
        }
    }

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`https://social-post-application-ntj3.onrender.com/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
            setPosts(posts.filter(p => p._id !== postId))
        } catch (error) {
            alert(error.response?.data?.message || "Delete failed")
        }
    }

    // LOGOUT FUNCTION
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/auth') // Login page par bhej do
    }

    const PostCard = ({ post }) => {
        const [showComments, setShowComments] = useState(false)
        const [commentText, setCommentText] = useState("")
        
        const isLikedByMe = currentUser && post.likes?.includes(currentUser.name);
        const isMyPost = currentUser && post.authorId === currentUser.id; 

        const submitComment = async (e) => {
            e.preventDefault()
            if (!currentUser) return alert("Please login to comment")
            if (!commentText.trim()) return

            try {
                const token = localStorage.getItem('token')
                const res = await axios.post(`https://social-post-application-ntj3.onrender.com/api/posts/${post._id}/comment`, { text: commentText }, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                })
                
                setPosts(posts.map(p => p._id === post._id ? { ...p, comments: res.data.comments } : p))
                setCommentText("")
            } catch (error) {
                console.error("Comment failed", error)
            }
        }

        return (
            <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#4a148c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {post.authorName?.charAt(0)}
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">{post.authorName}</Typography>
                    </Box>
                    
                    {isMyPost && (
                        <IconButton onClick={() => handleDelete(post._id)} color="error">
                            <Delete />
                        </IconButton>
                    )}
                </Box>
                
                <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body1">{post.caption}</Typography>
                </CardContent>

                {post.image && <CardMedia component="img" image={post.image} alt="post_img" sx={{ maxHeight: 400, objectFit: 'contain', bgcolor: '#f5f5f5' }} />}
                
                <CardActions disableSpacing sx={{ px: 2 }}>
                    <Box display="flex" alignItems="center" mr={2}>
                        <IconButton onClick={() => handleLike(post._id)} color={isLikedByMe ? "error" : "default"}>
                            {isLikedByMe ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography>{post.likes?.length || 0}</Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={() => setShowComments(!showComments)}>
                            <Comment />
                        </IconButton>
                        <Typography>{post.comments?.length || 0}</Typography>
                    </Box>
                </CardActions>

                {showComments && (
                    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                        <form onSubmit={submitComment} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <TextField 
                                size="small" fullWidth placeholder="Write a comment..." 
                                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                            />
                            <Button type="submit" variant="contained" sx={{ bgcolor: '#4a148c' }}>Post</Button>
                        </form>
                        <List dense>
                            {post.comments?.map((c, i) => (
                                <React.Fragment key={i}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemAvatar sx={{ minWidth: 40 }}>
                                            <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{c.username?.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={<Typography variant="subtitle2" fontWeight="bold">{c.username}</Typography>}
                                            secondary={<Typography variant="body2">{c.text}</Typography>}
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    </Box>
                )}
            </Card>
        )
    }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, pb: 10 }}>
        {/* YE HEADER WALA PART UPDATE KIYA HAI */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">Feed</Typography>
            <Box>
                <Button variant="contained" onClick={() => navigate('/create-post')} sx={{ bgcolor: '#4a148c', mr: 2 }}>
                    + Post
                </Button>
                {/* LOGOUT BUTTON */}
                <Button variant="outlined" color="error" onClick={handleLogout} startIcon={<Logout />}>
                    Logout
                </Button>
            </Box>
        </Box>
        
        {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
            <Typography variant="h6" textAlign="center" color="textSecondary">No posts yet</Typography>
        )}
    </Container>
  )
}

export default Feed