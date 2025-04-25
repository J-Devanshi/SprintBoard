let currentColumn = "";
let taskIdCounter = 0;

function openModal(column) {
  currentColumn = column;
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskPriority").value = "Medium";
}

function addTask() {
  const taskTitle = document.getElementById("taskTitle").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;

  if (taskTitle.trim() === "") {
    alert("Please enter a task title.");
    return;
  }

  taskIdCounter++;
  const task = document.createElement("div");
  task.classList.add("task", taskPriority.toLowerCase());
  task.id = `task-${taskIdCounter}`;

  const title = document.createElement("h4");
  title.innerText = taskTitle;

  const description = document.createElement("p");
  description.innerText = taskDescription;

  task.appendChild(title);
  task.appendChild(description);

  document.getElementById(`${currentColumn}-tasks`).appendChild(task);

  closeModal();
}

// Optional: Close modal on outside click
window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
};
