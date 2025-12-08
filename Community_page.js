document.addEventListener('DOMContentLoaded', () => {

  /* CURRENT USER */
  const currentUser = { name: 'Aisha', role: 'employee' }; 
  

  /* ELEMENTS */
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
  const globalSearch = document.getElementById('globalSearch');


  /* ---------------------- PROFILE INIT ---------------------- */
  function initProfile(){
    profileName.textContent = currentUser.name;
    profileRole.textContent = capitalize(currentUser.role);

    profileNameTop.textContent = currentUser.name;
    profileRoleTop.textContent = capitalize(currentUser.role);

    profileAvatar.textContent =
    avatarRight.textContent =
    newAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  }
  initProfile();



  /* ---------------------- SAMPLE FEED DATA ---------------------- */
  let posts = [
    { id: '102', author: 'Rohan', role: 'technician', content: 'Projector in Room 210 fixed. Issue #102 resolved.', likes: 32, comments: [{by:'Neha',role:'employee',text:'Great job!'}], time: '1h' },
    { id: '188', author: 'Neha', role: 'employee', content: 'Water leakage near Lab 2 — requesting urgent check.', likes: 12, comments: [], time: '3h' },
    { id: 'ANN', author: 'Admin', role: 'admin', content: 'System maintenance at 7 PM. Please save your work.', likes: 6, comments: [], time: '6h' }
  ];

  let idCounter = 200;



  /* ---------------------- RENDER FEED ---------------------- */
  function renderFeed(list = posts) {
    feedEl.innerHTML = '';

    list.slice().reverse().forEach(p => {
      const node = template.content.cloneNode(true);

      /* FILL BASIC DATA */
      node.querySelector('.author-avatar').textContent = p.author[0].toUpperCase();
      node.querySelector('.author-name').textContent = p.author;
      node.querySelector('.author-role').textContent = capitalize(p.role);
      node.querySelector('.post-content').textContent = p.content;
      node.querySelector('.post-id').textContent = p.id;
      node.querySelector('.post-time').textContent = `• ${p.time}`;
      node.querySelector('.likeCount').textContent = p.likes;
      node.querySelector('.commentCount').textContent = p.comments.length;

      const cardEl = node.children[0];

      /* ASSIGN BUTTON (ADMIN ONLY) */
      const assignBtn = node.querySelector('.assignBtn');
      if (currentUser.role === 'admin')
        assignBtn.classList.remove('hidden');


      /* LIKE BUTTON (NEON) */
      const likeBtn = node.querySelector('.likeBtn');
      likeBtn.addEventListener('click', () => {
        p.likes++;
        node.querySelector('.likeCount').textContent = p.likes;
        likeBtn.classList.add('liked');

        // neat pop animation
        likeBtn.classList.add('animate-pop');
        setTimeout(() => likeBtn.classList.remove('animate-pop'), 250);
      });


      /* COMMENTS RENDERER */
      const commentsArea = node.querySelector('.commentsArea');
      const renderComments = () => {
        const list = node.querySelector('.commentList');
        list.innerHTML = '';
        p.comments.forEach(c => {
          const el = document.createElement('div');
          el.className = "p-2 bg-white/70 rounded-lg";
          el.innerHTML = `
            <strong>${c.by}</strong> — ${c.text}
          `;
          list.appendChild(el);
        });
        node.querySelector('.commentCount').textContent = p.comments.length;
      };

      renderComments();


      /* COMMENT TOGGLE (SLIDE) */
      const commentToggle = node.querySelector('.commentToggle');
      commentToggle.addEventListener('click', () => {
        commentsArea.classList.toggle('hidden');
      });


      /* POST COMMENT */
      const postCommentBtn = node.querySelector('.postCommentBtn');
      const commentInput = node.querySelector('.commentInput');

      postCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (!text) return;

        p.comments.push({
          by: currentUser.name,
          role: currentUser.role,
          text
        });

        commentInput.value = "";
        renderComments();

        // Animate new comment
        commentsArea.classList.remove('hidden');
      });


      /* ADMIN: ASSIGN ACTION */
      assignBtn.addEventListener('click', () => {
        if (currentUser.role !== 'admin') return;

        const tech = prompt("Assign to technician:", "Rajan");
        if (!tech) return;

        p.comments.push({
          by: "System",
          text: `Assigned to ${tech} by Admin`
        });

        flashToast(`Assigned to ${tech}`);
        renderFeed();
      });


      feedEl.appendChild(node);
    });
  }

  renderFeed();



  /* ---------------------- NEW POST ---------------------- */
  postBtn.addEventListener("click", () => {
    const text = newPostText.value.trim();
    if (!text) return;

    const post = {
      id: String(idCounter++),
      author: currentUser.name,
      role: currentUser.role,
      content: text,
      likes: 0,
      comments: [],
      time: "just now"
    };

    posts.push(post);
    newPostText.value = "";

    renderFeed();

    // smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    flashToast("Posted!");
  });




  /* ---------------------- SEARCH FILTER ---------------------- */
  globalSearch.addEventListener("input", () => {
    const q = globalSearch.value.trim().toLowerCase();

    if (!q) {
      renderFeed();
      return;
    }

    const filtered = posts.filter(p =>
      p.content.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );

    renderFeed(filtered);
  });



  /* ---------------------- RIPPLE CLICK ---------------------- */
  document.addEventListener("click", (e) => {
    let btn = e.target.closest(".ripple");
    if (!btn) return;

    let rect = btn.getBoundingClientRect();
    btn.style.setProperty("--x", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });



  /* ---------------------- TOAST MESSAGE ---------------------- */
  function flashToast(txt){
    const el = document.createElement('div');
    el.className =
      "fixed right-6 bottom-6 bg-primary text-white px-4 py-2 rounded-lg shadow-lg animate-fadeUp";
    el.textContent = txt;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }



  /* ---------------------- UTIL ---------------------- */
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }



  /* ---------------------- LIVE NEW TECHNICIAN POST ---------------------- */
  setTimeout(() => {
    posts.push({
      id: "T303",
      author: "Rajan",
      role: "technician",
      content: "Inspection started at Lab 3 — updates coming soon...",
      likes: 0,
      comments: [],
      time: "just now"
    });

    renderFeed();
    flashToast("New technician update!");
  }, 7000);

});

