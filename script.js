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
        const category = document.getElementById("task-category").value;
    
        if (taskText === "") return;
    
        const taskItem = document.createElement("li");
        const currentTime = new Date().toLocaleString(); // Get current date and time
    
        taskItem.innerHTML = `
            <div class="task-info">
                <span>${taskText} <small>(${category})</small></span>
                <span class="task-date">Due: ${dueDate || "No due date"} | Added: ${currentTime}</span>
            </div>
            <button class="delete-btn">X</button>
        `;
    
        taskItem.querySelector(".task-info span").addEventListener("click", () => {
            taskItem.classList.toggle("completed");
            saveTasks();
        });
    
        taskItem.querySelector(".delete-btn").addEventListener("click", () => {
            taskItem.remove();
            saveTasks();
        });
    
        taskList.appendChild(taskItem);
        saveTasks();
        taskInput.value = "";
        dueDateInput.value = ""; // Clear input fields
    }
    
    

    function saveTasks() {
        let tasks = [];
        document.querySelectorAll("#task-list li").forEach((li) => {
            let taskText = li.querySelector(".task-info span").innerText;
            let taskDate = li.querySelector(".task-date").innerText.replace("Due: ", "");
            let isCompleted = li.classList.contains("completed");
    
            tasks.push({ text: taskText, date: taskDate, completed: isCompleted });
        });
    
        // Sort tasks by due date (earliest first)
        tasks.sort((a, b) => new Date(a.date || "9999-12-31") - new Date(b.date || "9999-12-31"));
    
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks(); // Refresh UI after sorting
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
document.getElementById("clear-tasks").addEventListener("click", () => {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
});
