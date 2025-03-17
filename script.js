document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function addTask(columnId) {
    const inputField = document.getElementById(`new-task-todo`);
    if (!inputField) return;

    const taskText = inputField.value.trim();
    if (taskText === "") return;

    createTaskElement(taskText, columnId);
    saveTasks();
    inputField.value = "";

    updateScrollbars(); // Ensure scrolling updates
}

function createTaskElement(text, columnId, isCompleted = false) {
    const taskList = document.querySelector(`#${columnId} .task-list`);
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.draggable = true;
    taskItem.dataset.taskText = text; // Store task text as a dataset attribute

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.classList.add("task-checkbox");

    // Task Text (Editable)
    const taskText = document.createElement("span");
    taskText.textContent = text;
    if (isCompleted) {
        taskText.style.textDecoration = "line-through";
    }

    // Drag & Drop Events
    taskItem.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", taskItem.dataset.taskText);
        event.dataTransfer.setData("columnId", columnId);
        taskItem.classList.add("dragging");
    });

    taskItem.addEventListener("dragend", () => {
        taskItem.classList.remove("dragging");
    });

    // Create delete button (🗑)
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑";
    deleteButton.classList.add("delete-task-btn");

    deleteButton.addEventListener("click", () => {
        taskItem.remove();
        removeTask(text, columnId);
        saveTasks();
    });

    checkbox.addEventListener("change", () => {
        taskText.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveTasks();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    saveTasks();
}




/* Drag & Drop Functionality */
document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", (event) => {
        event.preventDefault();
        column.classList.add("drag-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("drag-over");
    });

    column.addEventListener("drop", (event) => {
        event.preventDefault();
        column.classList.remove("drag-over");

        const taskText = event.dataTransfer.getData("text/plain");
        const fromColumn = event.dataTransfer.getData("columnId");
        const toColumn = column.id;

        if (fromColumn !== toColumn) {
            removeTask(taskText, fromColumn);
            createTaskElement(taskText, toColumn);
            saveTasks();
        }
    });
});



/* Save & Load Tasks */
function saveTasks() {
    const tasks = { todo: [], doing: [], done: [] };

    document.querySelectorAll(".column").forEach((col) => {
        const colId = col.id;
        const taskItems = col.querySelectorAll(".task");

        taskItems.forEach((task) => {
            const checkbox = task.querySelector(".task-checkbox");
            tasks[colId].push({
                text: task.querySelector("span").textContent,
                completed: checkbox.checked,
            });
        });
    });

    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}


function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks")) || { todo: [], doing: [], done: [] };

    Object.keys(savedTasks).forEach((columnId) => {
        savedTasks[columnId].forEach(({ text, completed }) => {
            createTaskElement(text, columnId, completed);
        });
    });
}


function removeTask(text, columnId) {
    const column = document.querySelector(`#${columnId} .task-list`);
    const tasks = column.querySelectorAll(".task");

    tasks.forEach((task) => {
        const taskText = task.querySelector("span").textContent;
        if (taskText === text) {
            task.remove();
        }
    });

    saveTasks();
}


function updateScrollbars() {
    document.querySelectorAll(".task-list").forEach(list => {
        list.style.overflowY = list.scrollHeight > 400 ? "auto" : "hidden";
    });
}

function clearAllTasks() {
    document.querySelectorAll(".task-list").forEach(list => {
        list.innerHTML = ""; // Remove all tasks
    });

    localStorage.removeItem("kanbanTasks"); // Clear stored tasks
}
