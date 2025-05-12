document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("postsContainer");
  const searchTitle = document.getElementById("searchTitle");
  const authorFilter = document.getElementById("authorFilter");

  let posts = [];
  let users = [];

  // Fetch posts and users
  Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
      res.json()
    ),
    fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
      res.json()
    ),
  ]).then(([postsData, usersData]) => {
    posts = postsData;
    users = usersData;

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.name;
      authorFilter.appendChild(option);
    });

    renderPosts(posts);
  });

  function renderPosts(postsToRender) {
    postsContainer.innerHTML = "";
    postsToRender.forEach((post) => {
      const user = users.find((user) => user.id === post.userId);
      const postElement = document.createElement("div");
      postElement.className = "card";

      postElement.innerHTML = `
        <h5 class="card-title">${post.title}</h5>
        <p class="card-author">Author: ${user ? user.name : "Unknown"}</p>
        <p class="card-text">${post.body}</p>
        <button class="btn" data-user-id="${user.id}">View Author</button>
      `;
      postsContainer.appendChild(postElement);
    });
  }

  function filterPosts() {
    const titleQuery = searchTitle.value.toLowerCase();
    const authorId = authorFilter.value;

    const filteredPosts = posts.filter((post) => {
      const matchesTitle = post.title.toLowerCase().includes(titleQuery);
      const matchesAuthor =
        authorId === "all" || post.userId === parseInt(authorId);
      return matchesTitle && matchesAuthor;
    });

    renderPosts(filteredPosts);
  }

  searchTitle.addEventListener("input", filterPosts);
  authorFilter.addEventListener("change", filterPosts);

  document.addEventListener("click", (event) => {
    if (event.target.matches("[data-user-id]")) {
      const userId = parseInt(event.target.getAttribute("data-user-id"));
      const user = users.find((user) => user.id === userId);

      if (user) {
        document.getElementById("userName").textContent = user.name;
        document.getElementById("userUsername").textContent = user.username;
        document.getElementById("userEmail").textContent = user.email;
        document.getElementById("userPhone").textContent = user.phone;
        document.getElementById("userWebsite").textContent = user.website;
        document.getElementById("userCompany").textContent = user.company.name;
        document.getElementById(
          "userAddress"
        ).textContent = `${user.address.suite}, ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;
        openModal();
      }
    }
  });
});

// Modal functions
function openModal() {
  document.getElementById("userModal").classList.add("show");
}

function closeModal() {
  document.getElementById("userModal").classList.remove("show");
}

// Optional: Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("userModal");
  if (event.target === modal) {
    closeModal();
  }
});
