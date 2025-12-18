/* =====================================================
   FixFlow IMS – Community Feed Logic
   ⚠️ DEMO VERSION (Dummy data)
   Backend-ready | Replace with APIs later
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const currentUser = { name: "Aisha", role: "Employee" };

  /* ⚠️ DUMMY POSTS — REMOVE WHEN BACKEND IS CONNECTED
     Expected future API:
     GET /api/community/posts
  --------------------------------------------------- */
  let posts = [
    {
      id: 102,
      author: "Adimn",
      role: "Admin",
      text: "Network / Internet Not Working.",
      upvotes: 9,
      liked: false,
      comments: [{ author: "Mohit", text: "Router & switch restart + cable check" }
        ,{ author: "Anmol", text: "Backup ISP" }
      ],
      time: "3h ago"
    },
    {
      id: 103,
      author: "Neha",
      role: "Employee",
      text: "Computer Not Booting.",
      upvotes: 5,
      liked: false,
      comments: [{ author: "Ajey", text: "Maintain backup machines" }],
      time: "3h ago"
    },
    {
      id: 104,
      author: "Amit",
      role: "Employee",
      text: "Display Not Working.",
      upvotes: 3,
      liked: false,
      comments: [{ author: "Anmol", text: "Replace cable / test on another system" }],
      time: "3h ago"
    },
    {
      id: 101,
      author: "Anmol",
      role: "Technician",
      text: "Scanner Jam.",
      upvotes: 1,
      liked: false,
      comments: [{ author: "Rahul", text: "Basic troubleshooting guide near printer" }],
      time: "3h ago"
    },
    
  ];

  const feed = document.getElementById("feed");
  const postBtn = document.getElementById("postBtn");
  const postInput = document.getElementById("postInput");

  postBtn.addEventListener("click", () => {
    const text = postInput.value.trim();
    if (!text) return;

    posts.unshift({
      id: Date.now(),
      author: currentUser.name,
      role: currentUser.role,
      text,
      upvotes: 0,
      liked: false,
      comments: [],
      time: "Just now"
    });

    postInput.value = "";
    render();
  });

  function render() {
    feed.innerHTML = "";

    posts.forEach(post => {
      const el = document.createElement("div");
      el.className = "card p-5";

      el.innerHTML = `
        <div class="flex justify-between">
          <div>
            <div class="font-semibold">${post.author}</div>
            <div class="text-xs text-gray-500">${post.role} • ${post.time}</div>
          </div>
          <div class="text-xs text-gray-400">#${post.id}</div>
        </div>

        <p class="mt-3 text-gray-700">${post.text}</p>

        <div class="mt-4 flex gap-6 text-sm">
          <button class="likeBtn ${post.liked ? "upvoted" : ""}">
            ⬆ Upvote (${post.upvotes})
          </button>
          <button class="commentToggle">
            💬 Comments (${post.comments.length})
          </button>
        </div>

        <div class="comments hidden mt-4">
          <div class="space-y-2 text-sm"></div>
          <div class="flex gap-2 mt-3">
            <input class="commentInput flex-1 border rounded-lg p-2" placeholder="Add a comment…" />
            <button class="sendComment px-3 bg-primary text-white rounded-lg">Send</button>
          </div>
        </div>
      `;

      // Upvote logic
      el.querySelector(".likeBtn").onclick = () => {
        post.liked = !post.liked;
        post.upvotes += post.liked ? 1 : -1;
        render();
      };

      // Toggle comments
      const commentsBox = el.querySelector(".comments");
      el.querySelector(".commentToggle").onclick = () =>
        commentsBox.classList.toggle("hidden");

      // Render comments
      const list = commentsBox.querySelector("div");
      post.comments.forEach(c => {
        const d = document.createElement("div");
        d.textContent = `${c.author}: ${c.text}`;
        list.appendChild(d);
      });

      // Add comment
      el.querySelector(".sendComment").onclick = () => {
        const input = el.querySelector(".commentInput");
        if (!input.value.trim()) return;
        post.comments.push({ author: currentUser.name, text: input.value });
        render();
      };

      feed.appendChild(el);
    });
  }

  render();
});
