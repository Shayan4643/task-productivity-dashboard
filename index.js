const input = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let searchQuery = "";

renderTasks();

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value.toLowerCase().trim();
  renderTasks();
});

function addTask() {
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    isEdited: false,
  };

  tasks.push(task);
  input.value = "";

  saveTasks();
  renderTasks();

  input.focus();
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(function (task) {
    return task.text.toLowerCase().includes(searchQuery);
  });

  if (filteredTasks.length === 0) {
    emptyMessage.classList.remove("hidden");
  } else {
    emptyMessage.classList.add("hidden");
  }

  filteredTasks.forEach(function (task) {
    // Find actual index in main tasks array
    const originalIndex = tasks.indexOf(task);

    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between gap-3 " +
      "w-full min-w-0 bg-gray-50 border border-gray-200 rounded-lg p-4";

    let taskText;

    if (task.isEdited) {
      taskText = document.createElement("input");
      taskText.type = "text";
      taskText.value = task.text;
      taskText.className =
        "flex-1 min-w-0 text-gray-700 font-medium " +
        "border border-blue-400 rounded-md p-1 outline-none";
    } else {
      taskText = document.createElement("span");
      taskText.textContent = task.text;
      taskText.className =
        "flex-1 min-w-0 break-words break-all text-gray-700 font-medium";
      if (task.completed) {
        taskText.classList.add("line-through", "text-gray-400");
      }
    }

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "flex gap-2 shrink-0";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = task.completed ? "Undo" : "Done";
    doneBtn.className =
      "px-3 py-2 bg-green-500 text-white cursor-pointer " +
      "text-sm font-medium rounded-md hover:bg-green-600 " +
      "active:scale-95 transition";

    doneBtn.addEventListener("click", function () {
      tasks[originalIndex].completed = !tasks[originalIndex].completed;
      saveTasks();
      renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = task.isEdited ? "Save" : "Edit";
    editBtn.className =
      "px-3 py-2 bg-blue-500 text-white cursor-pointer " +
      "text-sm font-medium rounded-md hover:bg-blue-600 " +
      "active:scale-95 transition";

    editBtn.addEventListener("click", function () {
      if (task.isEdited) {
        const newText = taskText.value.trim();
        if (newText !== "") {
          tasks[originalIndex].text = newText;
          tasks[originalIndex].isEdited = false;
        } else {
          alert("Task text cannot be empty.");
          return;
        }
      } else {
        tasks[originalIndex].isEdited = true;
      }
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className =
      "px-3 py-2 bg-red-500 text-white cursor-pointer " +
      "text-sm font-medium rounded-md hover:bg-red-600 " +
      "active:scale-95 transition";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(originalIndex, 1);
      saveTasks();
      renderTasks();
    });

    buttonDiv.appendChild(doneBtn);
    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(buttonDiv);

    taskList.appendChild(li);
  });
}

function saveTasks() {
  const data = JSON.stringify(tasks);
  localStorage.setItem("tasks", data);
}