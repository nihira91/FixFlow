const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  createPost,
  getPost,
  addComment,
  toggleLike,
  deletePost
} = require('../controllers/community.controller');

const { employeeAuthCheck } = require('../middlewares/employeeAuthCheck');

// Get all posts (public)
router.get('/', getAllPosts);

// Get single post (public)
router.get('/:id', getPost);

// Create post (authenticated)
router.post('/', employeeAuthCheck, createPost);

// Add comment (authenticated)
router.post('/:id/comments', employeeAuthCheck, addComment);

// Like/Unlike post (authenticated)
router.post('/:id/like', employeeAuthCheck, toggleLike);

// Delete post (authenticated)
router.delete('/:id', employeeAuthCheck, deletePost);

module.exports = router;
