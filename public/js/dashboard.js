document.addEventListener("DOMContentLoaded", () => {
  const userdata = JSON.parse(localStorage.getItem("userId"));

  if (!userdata || !userdata.userId) {
    alert("You're not logged in. Redirecting to login.");
    window.location.href = "/login.html";
    return;
  }

  const userId = userdata.userId;

  const todosContainer = document.getElementById("todosContainer");
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const logoutBtn = document.getElementById("btn");

  const profileImg = document.querySelector(".image");
  const imgPath = userdata.imgpath;

  profileImg.src = (!imgPath || imgPath === "null") 
    ? "https://res.cloudinary.com/drqcrqxnz/image/upload/v1744918893/user_riupmv.png" 
    : imgPath;

  const greet = document.querySelector("h2");
  greet.textContent = `Welcome, ${userdata.username}`;

  // Fetch & display todos
  async function loadTodos() {
    try {
      const res = await fetch(`/api/todos/${userId}`);
      const todos = await res.json();
      todosContainer.innerHTML = '';

      if (todos.length === 0) {
        todosContainer.innerHTML = '<p>No todos yet. Start adding!</p>';
        return;
      }

      todos.forEach(todo => {
        const div = document.createElement('div');
        div.className = 'todo-item';
        div.setAttribute('data-id', todo._id);  // for targeting

        const span = document.createElement('span');
        span.textContent = todo.text;
        if (todo.completed) span.classList.add('completed');

        const innerdiv = document.createElement('div');

        const toggleBtn = document.createElement('button');
        toggleBtn.classList.add('logo-button');

        const toggleicon = document.createElement('img');
        toggleicon.classList.add('check-icon');
        toggleicon.src = todo.completed ? '../logo/undo.png' : '../logo/done.png';

        toggleBtn.appendChild(toggleicon);
        toggleBtn.addEventListener("click", () => toggleTodo(todo._id));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('logo-button');

        const deleteicon = document.createElement('img');
        deleteicon.classList.add('check-icon');
        deleteicon.src = '../logo/delete.png';

        deleteBtn.appendChild(deleteicon);
        deleteBtn.addEventListener("click", () => deleteTodo(todo._id));

        div.appendChild(span);
        div.appendChild(innerdiv);
        innerdiv.appendChild(toggleBtn);
        innerdiv.appendChild(deleteBtn);

        todosContainer.appendChild(div);
      });
    } catch (err) {
      console.error("Error loading todos:", err);
    }
  }

  // Add new todo
  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text })
      });
      todoInput.value = '';
      loadTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  });

  // ✅ Faster toggle without reloading all todos
  async function toggleTodo(id) {
    const todoEl = document.querySelector(`[data-id="${id}"]`);
    const iconImg = todoEl.querySelector("img.check-icon");
    const textSpan = todoEl.querySelector("span");

    const isDone = iconImg.src.includes("done.png");

    // Instant UI update
    iconImg.src = isDone ? '../logo/undo.png' : '../logo/done.png';
    textSpan.classList.toggle('completed');

    try {
      await fetch(`/api/todo/${id}/toggle`, { method: "PATCH" });
    } catch (err) {
      console.error("Error toggling todo:", err);
      // Revert UI on failure (optional)
      iconImg.src = isDone ? '../logo/done.png' : '../logo/undo.png';
      textSpan.classList.toggle('completed');
    }
  }

  // Delete todo
  async function deleteTodo(id) {
    try {
      await fetch(`/api/todo/${id}`, { method: "DELETE" });
      const todoEl = document.querySelector(`[data-id="${id}"]`);
      todoEl.remove(); // remove from DOM instantly
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "/login.html";
  });

  // Initial load
  loadTodos();
});
