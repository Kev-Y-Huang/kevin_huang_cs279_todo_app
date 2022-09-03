// Gets respective elements that will be needed throughout the script
const filters = document.querySelectorAll(".filters span");
const taskBox = document.querySelector(".task-box");
const taskInput = document.querySelector(".task-input input");
const clearAll = document.querySelector(".clear-btn");

// Adding key listener for entering tasks
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    // Add task to local storage
    todos = !todos ? [] : todos;
    todos.push({ name: userTask, status: "pending" });
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));

    // Rerender tasks for the active filter
    showTodo(document.querySelector("span.active").id);
  }
});

// Adding key listener for clearing tasks
clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
});

// Load list of todo tasks from local storage
let todos = JSON.parse(localStorage.getItem("todo-list"));

// Set up tab buttons for filtering correct tasks (with correct color highlighting)
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// Function for rendering tasks given a certain filter
function showTodo(filter) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";

      // Add task elements if they match the current active filter
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this, '${filter}')" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings" onclick="deleteTask(${id}, '${filter}')">
                        <i class="uil uil-trash"></i>
                        Delete
                    </div>
                </li>`;
      }
    });
  }

  taskBox.innerHTML = liTag || `<span>No tasks currently</span>`;

  // Update attributes based on current number of tasks
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active")
    : clearAll.classList.add("active");
  taskBox.offsetHeight >= 300
    ? taskBox.classList.add("overflow")
    : taskBox.classList.remove("overflow");
}
showTodo("all");

// Function for updating a task status
function updateStatus(selectedTask, filter) {
  let taskName = selectedTask.parentElement.lastElementChild;

  // Check or uncheck tasks based on updated status
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));

  // Rerender since the updated tasks should not be in the filtered list
  showTodo(filter);
}

// Function for deleting tasks
function deleteTask(deleteId, filter) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));

  // Rerender the since the deleted tasks should not be in the filtered list
  showTodo(filter);
}
