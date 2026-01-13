// Global state
const communityState = {
    posts: [],
    currentUser: null,
    filteredPosts: [],
    currentFilter: 'all',
    likes: new Set()
};

// API Base URL - ensure we connect to port 5000
const API_BASE = 'http://localhost:5000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    return response;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadPosts();
    attachEventListeners();
    setupRealtimeUpdates();
});

// Load current user profile
async function loadUserProfile() {
    try {
        const response = await apiCall('/api/employee/auth/profile');
        
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/login.html';
            }
            throw new Error('Failed to load profile');
        }
        
        const user = await response.json();
        communityState.currentUser = user;
        updateUserUI();
    } catch (error) {
        console.error('Profile load error:', error);
    }
}

// Update UI with user info
function updateUserUI() {
    const user = communityState.currentUser;
    const firstLetter = user.name.charAt(0).toUpperCase();
    const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];
    const colorIndex = user.name.charCodeAt(0) % colors.length;
    
    // Update all avatars
    document.querySelectorAll('#userAvatar, #userAvatarCreate, #userAvatarInfo').forEach(el => {
        el.textContent = firstLetter;
        el.className = `${colors[colorIndex]} rounded-full w-10 h-10 flex items-center justify-center font-bold text-white`;
    });

    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = `Role: ${user.role}`;
}

// Load posts from API
async function loadPosts() {
    try {
        const response = await apiCall('/api/community/?page=1&limit=20');
        if (!response.ok) throw new Error('Failed to load posts');
        
        const data = await response.json();
        communityState.posts = data.posts || [];
        filterAndRenderPosts();
    } catch (error) {
        console.error('Load posts error:', error);
        document.getElementById('postsFeed').innerHTML = '<p class="text-red-500">Failed to load posts</p>';
    }
}

// Filter and render posts
function filterAndRenderPosts() {
    if (communityState.currentFilter === 'all') {
        communityState.filteredPosts = communityState.posts;
    } else {
        communityState.filteredPosts = communityState.posts.filter(post => post.category === communityState.currentFilter);
    }
    renderPosts();
}

// Render posts to DOM
function renderPosts() {
    const feed = document.getElementById('postsFeed');
    
    if (communityState.filteredPosts.length === 0) {
        feed.innerHTML = '<p class="text-center text-gray-500 py-8">No posts found</p>';
        return;
    }

    feed.innerHTML = communityState.filteredPosts.map(post => createPostHTML(post)).join('');
    updateStats();
    
    // Attach event listeners to post elements
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLike(btn.dataset.postId);
        });
    });

    document.querySelectorAll('.comment-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleComments(btn.dataset.postId);
        });
    });

    document.querySelectorAll('.post-comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.dataset.postId;
            const input = document.querySelector(`[data-post-id="${postId}"] .comment-input`);
            if (input && input.value.trim()) {
                addComment(postId, input.value);
                input.value = '';
            }
        });
    });
}

// Update community stats
function updateStats() {
    const totalPosts = communityState.posts.length;
    const userPosts = communityState.posts.filter(p => p.author && p.author._id === communityState.currentUser?._id).length;
    
    document.getElementById('totalPosts').textContent = totalPosts;
    document.getElementById('userPosts').textContent = userPosts;
}

// Create post HTML
function createPostHTML(post) {
    const author = post.isAnonymous ? { name: 'Anonymous', role: 'User' } : { name: post.authorName, role: post.authorRole };
    const timeAgo = getTimeAgo(new Date(post.createdAt));
    const categoryClass = `category-${post.category.toLowerCase().replace(/\s+/g, '-')}`;
    const isLiked = communityState.likes.has(post._id);
    
    return `
        <div class="post-card bg-white rounded-lg p-6 shadow-sm border border-gray-200 fade-in" data-post-id="${post._id}">
            <div class="flex items-start gap-4">
                <div class="avatar bg-teal-500" style="background-color: ${getColorForName(author.name)}">${author.name.charAt(0).toUpperCase()}</div>
                <div class="flex-1">
                    <div class="flex items-start justify-between">
                        <div>
                            <div class="flex items-center gap-3 flex-wrap">
                                <span class="font-bold text-gray-900">${author.name}</span>
                                <span class="text-xs text-gray-500">${author.role}</span>
                                <span class="category-badge ${categoryClass}">${post.category}</span>
                                <span class="text-xs text-gray-400">• ${timeAgo}</span>
                            </div>
                            <div class="text-gray-700 mt-3 whitespace-pre-wrap break-words">${escapeHtml(post.content)}</div>
                        </div>
                        <div class="text-right text-xs text-gray-500">#ID:${post._id.slice(-4)}</div>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <button class="like-btn flex items-center gap-2 text-gray-600 hover:text-teal-500 transition px-3 py-2 rounded-lg hover:bg-gray-100" data-post-id="${post._id}">
                                <span class="text-lg">${isLiked ? '❤️' : '🤍'}</span>
                                <span class="like-count">${post.likes.length}</span>
                            </button>
                            <button class="comment-toggle flex items-center gap-2 text-gray-600 hover:text-teal-500 transition px-3 py-2 rounded-lg hover:bg-gray-100" data-post-id="${post._id}">
                                <span>💬</span>
                                <span class="comment-count">${post.comments.length}</span>
                            </button>
                        </div>
                    </div>

                    <div class="comments-area hidden mt-4 pt-4 border-t border-gray-200" data-post-id="${post._id}">
                        <div class="comment-list space-y-3 mb-4 max-h-48 overflow-y-auto">
                            ${post.comments.map(comment => `
                                <div class="text-sm">
                                    <div class="font-medium text-gray-900">${comment.authorName}</div>
                                    <div class="text-gray-600">${escapeHtml(comment.text)}</div>
                                    <div class="text-xs text-gray-400 mt-1">${getTimeAgo(new Date(comment.createdAt))}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="flex gap-2">
                            <input type="text" class="comment-input flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Write a comment..." data-post-id="${post._id}">
                            <button class="post-comment-btn px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 transition" data-post-id="${post._id}">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get color for user initials
function getColorForName(name) {
    const colors = ['#14b8a6', '#0ea5e9', '#a855f7', '#ec4899', '#f97316'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

// Toggle like on post
async function toggleLike(postId) {
    try {
        const response = await apiCall(`/api/community/${postId}/like`, {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Failed to toggle like');
        
        // Update UI optimistically
        const post = communityState.posts.find(p => p._id === postId);
        if (post) {
            if (communityState.likes.has(postId)) {
                communityState.likes.delete(postId);
                post.likes = post.likes.filter(id => id !== communityState.currentUser._id);
            } else {
                communityState.likes.add(postId);
                post.likes.push(communityState.currentUser._id);
            }
            renderPosts();
        }
    } catch (error) {
        console.error('Like toggle error:', error);
    }
}

// Toggle comments visibility
function toggleComments(postId) {
    const commentsArea = document.querySelector(`.comments-area[data-post-id="${postId}"]`);
    if (commentsArea) {
        commentsArea.classList.toggle('hidden');
    }
}

// Add comment to post
async function addComment(postId, commentText) {
    try {
        const response = await apiCall(`/api/community/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ text: commentText })
        });

        if (!response.ok) throw new Error('Failed to add comment');
        
        // Reload posts to get updated comments
        loadPosts();
    } catch (error) {
        console.error('Add comment error:', error);
    }
}

// Create a new post
async function createPost() {
    const content = document.getElementById('postContent').value.trim();
    const isAnonymous = document.getElementById('anonymousCheck').checked;
    
    if (!content) {
        alert('Please write something to post');
        return;
    }

    try {
        const response = await apiCall('/api/community/', {
            method: 'POST',
            body: JSON.stringify({
                title: content.substring(0, 50),
                content: content,
                category: 'General',
                isAnonymous: isAnonymous
            })
        });

        if (!response.ok) throw new Error('Failed to create post');
        
        // Clear form and reload
        document.getElementById('postContent').value = '';
        document.getElementById('anonymousCheck').checked = false;
        loadPosts();
    } catch (error) {
        console.error('Create post error:', error);
        alert('Failed to create post');
    }
}

// Filter by category
function filterByCategory(category) {
    communityState.currentFilter = category;
    filterAndRenderPosts();
    
    // Update button styles
    document.querySelectorAll('[onclick^="filterByCategory"]').forEach(btn => {
        btn.classList.remove('bg-teal-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    event.target.classList.add('bg-teal-500', 'text-white');
}

// Navigate away from page
function navigateTo(page) {
    const role = communityState.currentUser?.role || 'employee';
    const dashboardPage = role === 'technician' ? 'Technician.html' : 'Employee.html';
    
    switch(page) {
        case 'dashboard':
            window.location.href = dashboardPage;
            break;
        case 'profile':
            window.location.href = 'profile.html';
            break;
        default:
            console.log('Navigate to:', page);
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Attach event listeners
function attachEventListeners() {
    document.getElementById('postContent').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            createPost();
        }
    });
}

// Setup real-time updates with Socket.IO
function setupRealtimeUpdates() {
    // Poll for new posts every 5 seconds
    setInterval(loadPosts, 5000);

    // Optional: Socket.IO for instant updates (if available)
    if (typeof io !== 'undefined') {
        try {
            const socket = io();
            socket.on('post:created', (newPost) => {
                communityState.posts.unshift(newPost);
                filterAndRenderPosts();
            });

            socket.on('post:commented', (postId) => {
                loadPosts();
            });

            socket.on('post:liked', (postId) => {
                loadPosts();
            });
        } catch (error) {
            console.error('Socket.IO connection error:', error);
        }
    }
}

// Utility: Format time ago
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// Utility: Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}


