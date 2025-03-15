document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const dueDateInput = document.getElementById("due-date");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    // Load tasks from localStorage
    loadTasks();

    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskText === "") return;

        const taskItem = document.createElement("li");
        const currentTime = new Date().toLocaleString(); // Get current date and time

        taskItem.innerHTML = `
            <div class="task-info">
                <span>${taskText}</span>
                <span class="task-date">Due: ${dueDate || "No due date"} | Added: ${currentTime}</span>
            </div>
            <button class="delete-btn">X</button>
        `;

        // Mark task as completed when clicked
        taskItem.querySelector(".task-info span").addEventListener("click", () => {
            taskItem.classList.toggle("completed");
            saveTasks();
        });

        // Delete task when button is clicked
        taskItem.querySelector(".delete-btn").addEventListener("click", () => {
            taskItem.remove();
            saveTasks();
        });

        taskList.appendChild(taskItem);
        saveTasks();
        taskInput.value = "";
        dueDateInput.value = ""; // Clear input fields after adding
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            const taskText = li.querySelector(".task-info span").innerText;
            const taskDate = li.querySelector(".task-date").innerText;
            const isCompleted = li.classList.contains("completed");

            tasks.push({ text: taskText, date: taskDate, completed: isCompleted });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => {
            const taskItem = document.createElement("li");

            taskItem.innerHTML = `
                <div class="task-info">
                    <span>${task.text}</span>
                    <span class="task-date">${task.date}</span>
                </div>
                <button class="delete-btn">X</button>
            `;

            if (task.completed) taskItem.classList.add("completed");

            taskItem.querySelector(".task-info span").addEventListener("click", () => {
                taskItem.classList.toggle("completed");
                saveTasks();
            });

            taskItem.querySelector(".delete-btn").addEventListener("click", () => {
                taskItem.remove();
                saveTasks();
            });

            taskList.appendChild(taskItem);
        });
    }
});
