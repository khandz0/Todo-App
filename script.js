document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
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
        if (taskText === "") return;

        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-btn">X</button>
        `;

        // Mark task as completed when clicked
        taskItem.querySelector("span").addEventListener("click", () => {
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
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            tasks.push({
                text: li.querySelector("span").innerText,
                completed: li.classList.contains("completed"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button class="delete-btn">X</button>
            `;
            if (task.completed) taskItem.classList.add("completed");

            taskItem.querySelector("span").addEventListener("click", () => {
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
