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

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted; // Mark as completed if true
    checkbox.classList.add("task-checkbox");

    // Task Text
    const taskText = document.createElement("span");
    taskText.textContent = text;
    if (isCompleted) {
        taskText.style.textDecoration = "line-through"; // Strike-through if completed
    }

    // Create delete button (🗑)
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑";
    deleteButton.classList.add("delete-task-btn");

    // Remove task when delete button is clicked
    deleteButton.addEventListener("click", () => {
        taskItem.remove(); // Remove from UI
        removeTask(text, columnId); // Remove from storage
        saveTasks(); // Save changes
    });

    // Mark task as complete on checkbox change
    checkbox.addEventListener("change", () => {
        taskText.style.textDecoration = checkbox.checked ? "line-through" : "none";
        saveTasks();
    });

    // Add drag event
    taskItem.addEventListener("dragstart", drag);

    // Append elements
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    saveTasks();
}



/* Drag & Drop Functionality */
function allowDrop(event) {
    event.preventDefault();
    const column = event.target.closest(".column");
    if (column) {
        column.classList.add("drag-over"); // Add highlight class
    }
}


function drag(event) {
    const taskElement = event.target;
    const taskText = taskElement.querySelector("span").textContent;
    const isChecked = taskElement.querySelector(".task-checkbox").checked; // Get checkbox state

    event.dataTransfer.setData("text", taskText);
    event.dataTransfer.setData("completed", isChecked); // Store checkbox state
    event.dataTransfer.setData("column", taskElement.parentElement.parentElement.id);
}


function drop(event) {
    event.preventDefault();
    const taskText = event.dataTransfer.getData("text");
    const fromColumn = event.dataTransfer.getData("column");
    const isCompleted = event.dataTransfer.getData("completed") === "true"; // Convert string to boolean
    const toColumn = event.target.closest(".column");

    if (toColumn) {
        toColumn.classList.remove("drag-over"); // Remove highlight
        if (fromColumn !== toColumn.id) {
            createTaskElement(taskText, toColumn.id, isCompleted); // Pass completed status
            removeTask(taskText, fromColumn);
            saveTasks();
        }
    }
}

function dragLeave(event) {
    const column = event.target.closest(".column");
    if (column) {
        column.classList.remove("drag-over");
    }
}


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
