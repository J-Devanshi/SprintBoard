let currentColumn = "";
let editMode = false;
let editTaskElement = null;

// Load saved tasks on startup
window.onload = function () {
  loadTasksFromStorage();
};

function openModal(column, taskElement = null) {
  currentColumn = column;
  document.getElementById("modal").style.display = "flex";

  if (taskElement) {
    editMode = true;
    editTaskElement = taskElement;
    document.getElementById("taskInput").value = taskElement.querySelector("h4").innerText;
    document.getElementById("dueDateInput").value = taskElement.getAttribute("data-due");
    document.getElementById("priorityInput").value = taskElement.getAttribute("data-priority");
  } else {
    editMode = false;
    editTaskElement = null;
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("priorityInput").value = "low";
}

function addTask() {
  const taskText = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;

  if (!taskText) {
    alert("Please enter a task description.");
    return;
  }

  if (editMode && editTaskElement) {
    updateTaskElement(editTaskElement, taskText, dueDate, priority);
  } else {
    const task = createTaskElement(taskText, dueDate, priority);
    document.getElementById(`${currentColumn}Tasks`).appendChild(task);
  }

  saveTasksToStorage();
  closeModal();
}

function createTaskElement(text, dueDate, priority) {
  const task = document.createElement("div");
  task.className = `task ${priority}`;
  task.setAttribute("draggable", "true");
  task.setAttribute("data-priority", priority);
  task.setAttribute("data-due", dueDate);

  const title = document.createElement("h4");
  title.innerText = text;

  const date = document.createElement("small");
  date.innerText = dueDate ? `Due: ${dueDate}` : "";

  const actions = document.createElement("div");
  actions.className = "actions";

  const editBtn = document.createElement("button");
  editBtn.innerText = "✏️";
  editBtn.onclick = () => openModal(task.parentElement.id.replace("Tasks", ""), task);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "🗑️";
  deleteBtn.onclick = () => {
    task.remove();
    saveTasksToStorage();
  };

  actions.append(editBtn, deleteBtn);

  task.append(title, date, actions);

  // Drag events
  task.addEventListener("dragstart", dragStart);
  task.addEventListener("dragend", dragEnd);

  return task;
}

function updateTaskElement(task, text, dueDate, priority) {
  task.querySelector("h4").innerText = text;
  task.querySelector("small").innerText = dueDate ? `Due: ${dueDate}` : "";
  task.className = `task ${priority}`;
  task.setAttribute("data-priority", priority);
  task.setAttribute("data-due", dueDate);
}

function saveTasksToStorage() {
  const columns = ["todo", "inProgress", "completed"];
  const tasksData = {};

  columns.forEach(col => {
    const tasks = document.getElementById(`${col}Tasks`).children;
    tasksData[col] = Array.from(tasks).map(task => ({
      text: task.querySelector("h4").innerText,
      due: task.getAttribute("data-due"),
      priority: task.getAttribute("data-priority")
    }));
  });

  localStorage.setItem("sprintTasks", JSON.stringify(tasksData));
}

function loadTasksFromStorage() {
  const data = JSON.parse(localStorage.getItem("sprintTasks")) || {};

  Object.keys(data).forEach(col => {
    const tasks = data[col];
    tasks.forEach(t => {
      const task = createTaskElement(t.text, t.due, t.priority);
      document.getElementById(`${col}Tasks`).appendChild(task);
    });
  });
}

// Drag & Drop
let draggedTask = null;

function dragStart(e) {
  draggedTask = this;
  setTimeout(() => (this.style.display = "none"), 0);
}

function dragEnd() {
  this.style.display = "block";
  draggedTask = null;
  saveTasksToStorage();
}

document.querySelectorAll(".tasks").forEach(col => {
  col.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  col.addEventListener("drop", function () {
    if (draggedTask) this.appendChild(draggedTask);
  });
});
