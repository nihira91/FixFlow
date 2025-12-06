
document.addEventListener('DOMContentLoaded', () => {

  const currentUser = { name: 'Aisha', role: 'employee' }; 
  
  // Elements
  const feedEl = document.getElementById('feed');
  const template = document.getElementById('postTemplate');
  const postBtn = document.getElementById('postBtn');
  const newPostText = document.getElementById('newPostText');
  const profileName = document.getElementById('profileName');
  const profileRole = document.getElementById('profileRole');
  const profileNameTop = document.getElementById('profileNameTop');
  const profileRoleTop = document.getElementById('profileRoleTop');
  const profileAvatar = document.getElementById('profileAvatar');
  const avatarRight = document.getElementById('avatarRight');
  const newAvatar = document.getElementById('newAvatar');

  // initialize profile display
  function initProfile(){
    profileName.textContent = currentUser.name;
    profileRole.textContent = capitalize(currentUser.role);
    profileNameTop.textContent = currentUser.name;
    profileRoleTop.textContent = capitalize(currentUser.role);
    profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    avatarRight.textContent = currentUser.name.charAt(0).toUpperCase();
    newAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }

  initProfile();

  // sample posts
  let posts = [
    { id: '102', author: 'Rohan', role: 'technician', content: 'Projector in Room 210 fixed. Issue #102 resolved.', likes: 32, comments: [{by:'Neha',role:'employee',text:'Great job!'}], time: '1h' },
    { id: '188', author: 'Neha', role: 'employee', content: 'Water leakage near Lab 2 — requesting urgent check.', likes: 12, comments: [], time: '3h' },
    { id: 'ANN', author: 'Admin', role: 'admin', content: 'System maintenance at 7 PM. Please save your work.', likes: 6, comments: [], time: '6h' }
  ];

  let idCounter = 200;

  // render feed (latest first)
  function renderFeed(){
    feedEl.innerHTML = '';
    posts.slice().reverse().forEach(p => {
      const node = template.content.cloneNode(true);
      node.querySelector('.author-avatar').textContent = p.author.charAt(0).toUpperCase();
      node.querySelector('.author-name').textContent = p.author;
      node.querySelector('.author-role').textContent = capitalize(p.role);
      node.querySelector('.post-content').textContent = p.content;
      node.querySelector('.post-id').textContent = p.id;
      node.querySelector('.post-time').textContent = `• ${p.time}`;
      node.querySelector('.likeCount').textContent = p.likes;
      node.querySelector('.commentCount').textContent = p.comments.length;

      // show assign only for admin
      const assignBtn = node.querySelector('.assignBtn');
      if (currentUser.role === 'admin') assignBtn.classList.remove('hidden');

      // like
      const likeBtn = node.querySelector('.likeBtn');
      likeBtn.addEventListener('click', () => {
        p.likes += 1;
        node.querySelector('.likeCount').textContent = p.likes;
        likeBtn.classList.add('animate-pop');
        setTimeout(()=> likeBtn.classList.remove('animate-pop'), 260);
        // TODO: send like to backend
      });

      // comment toggle
      const commentToggle = node.querySelector('.commentToggle');
      const commentsArea = node.querySelector('.commentsArea');
      commentToggle.addEventListener('click', () => {
        commentsArea.classList.toggle('hidden');
      });

      // render comments
      function renderComments(){
        const list = node.querySelector('.commentList');
        list.innerHTML = '';
        p.comments.forEach(c => {
          const el = document.createElement('div');
          el.className = 'flex items-start gap-2';
          el.innerHTML = `<div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">${c.by.charAt(0)}</div>
                          <div><span class="font-semibold mr-2">${c.by}</span><span class="text-sm text-gray-700">${c.text}</span></div>`;
          list.appendChild(el);
        });
        node.querySelector('.commentCount').textContent = p.comments.length;
      }
      renderComments();

      // post comment
      const postCommentBtn = node.querySelector('.postCommentBtn');
      const commentInput = node.querySelector('.commentInput');
      postCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (!text) return;
        p.comments.push({ by: currentUser.name, role: currentUser.role, text });
        commentInput.value = '';
        renderComments();
        // TODO: send comment to backend
      });

      // assign action (admin only)
      assignBtn.addEventListener('click', () => {
        if (currentUser.role !== 'admin') return;
        const tech = prompt('Assign to technician (enter name):', 'Raj');
        if (tech) {
          p.comments.push({ by: 'System', role: 'system', text: `Assigned to ${tech} by Admin.` });
          alert(`Assigned to ${tech}`);
          renderFeed();
          // TODO: send assignment to backend
        }
      });

      feedEl.appendChild(node);
    });
  }

  // posting
  postBtn.addEventListener('click', () => {
    const text = newPostText.value.trim();
    if (!text) return;
    const post = { id: String(idCounter++), author: currentUser.name, role: currentUser.role, content: text, likes: 0, comments: [], time: 'just now' };
    posts.push(post);
    newPostText.value = '';
    renderFeed();
    flashToast('Posted');
    // TODO: send new post to backend
  });

  // search filter
  const globalSearch = document.getElementById('globalSearch');
  globalSearch.addEventListener('input', () => {
    const q = globalSearch.value.trim().toLowerCase();
    if (!q) { renderFeed(); return; }
    const filtered = posts.filter(p => p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.id.includes(q));
    feedEl.innerHTML = '';
    filtered.slice().reverse().forEach(p => {
      const node = template.content.cloneNode(true);
      node.querySelector('.author-avatar').textContent = p.author.charAt(0).toUpperCase();
      node.querySelector('.author-name').textContent = p.author;
      node.querySelector('.author-role').textContent = capitalize(p.role);
      node.querySelector('.post-content').textContent = p.content;
      node.querySelector('.post-id').textContent = p.id;
      node.querySelector('.post-time').textContent = `• ${p.time}`;
      node.querySelector('.likeCount').textContent = p.likes;
      node.querySelector('.commentCount').textContent = p.comments.length;
      feedEl.appendChild(node);
    });
  });

  // simple toast helper
  function flashToast(txt){
    const el = document.createElement('div');
    el.className = 'fixed right-6 bottom-6 bg-primary text-white px-4 py-2 rounded-lg shadow-lg';
    el.textContent = txt;
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 1400);
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  // simulate realtime technician post
  setTimeout(()=> {
    posts.push({ id:'T303', author:'Rajan', role:'technician', content:'Inspection started at Lab 3 — will update progress here.', likes:0, comments:[], time:'just now' });
    renderFeed();
  }, 7000);

  // initial render
  renderFeed();

});
