document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function addTask(columnId) {
    const inputField = document.getElementById(`new-task-${columnId}`);
    if (!inputField) return;

    const taskText = inputField.value.trim();
    if (taskText === "") return;

    createTaskElement(taskText, columnId);
    saveTasks();
    inputField.value = "";
}

function createTaskElement(text, columnId) {
    const taskList = document.querySelector(`#${columnId} .task-list`);
    const taskItem = document.createElement("div");

    taskItem.classList.add("task");
    taskItem.draggable = true;
    taskItem.textContent = text;
    taskItem.addEventListener("dragstart", drag);

    taskList.appendChild(taskItem);
    saveTasks();
}

/* Drag & Drop Functionality */
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.textContent);
    event.dataTransfer.setData("column", event.target.parentElement.parentElement.id);
}

function drop(event) {
    event.preventDefault();
    const taskText = event.dataTransfer.getData("text");
    const fromColumn = event.dataTransfer.getData("column");
    const toColumn = event.target.closest(".column").id;

    if (fromColumn !== toColumn) {
        createTaskElement(taskText, toColumn);
        removeTask(taskText, fromColumn);
        saveTasks();
    }
}

/* Save & Load Tasks */
function saveTasks() {
    const tasks = { todo: [], doing: [], done: [] };

    document.querySelectorAll(".column").forEach((col) => {
        const colId = col.id;
        const taskItems = col.querySelectorAll(".task");

        taskItems.forEach((task) => {
            tasks[colId].push(task.textContent);
        });
    });

    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks")) || { todo: [], doing: [], done: [] };

    Object.keys(savedTasks).forEach((columnId) => {
        savedTasks[columnId].forEach((taskText) => {
            createTaskElement(taskText, columnId);
        });
    });
}

function removeTask(text, columnId) {
    const column = document.querySelector(`#${columnId} .task-list`);
    const tasks = column.querySelectorAll(".task");

    tasks.forEach((task) => {
        if (task.textContent === text) {
            task.remove();
        }
    });

    saveTasks();
}