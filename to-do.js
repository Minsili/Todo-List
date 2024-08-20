let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("new-task");
  const addTaskBtn = document.getElementById("add-task");
  const searchInput = document.getElementById("search-task");
  const taskList = document.getElementById("task-list");
  const totalTasksEl = document.getElementById("total-tasks");
  const doneTasksEl = document.getElementById("done-tasks");
  const undoneTasksEl = document.getElementById("undone-tasks");
  const avgDoneEl = document.getElementById("avg-done");

  let tasks = [];

  const renderTasks = async () => {
    console.log("Fetching taksa from server");
    const searchQuery = searchInput.value.toLowerCase();
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if (task.description.toLowerCase().includes(searchQuery)) {
        const li = document.createElement("li");
        li.className = `task-item ${task.done ? "done" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => toggleTaskDone(index));

        const taskDesc = document.createElement("span");
        taskDesc.className = "task-desc";
        taskDesc.textContent = task.description;

        const taskDate = document.createElement("span");
        taskDate.className = "task-date";
        taskDate.textContent = task.date;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        deleteBtn.addEventListener("click", () => deleteTask(index, task.id));

        let editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>`;
        //Edit Tasks
        editButton.addEventListener("click", () => editTask(index, task.id));

        li.appendChild(checkbox);
        li.appendChild(taskDesc);
        li.appendChild(taskDate);
        li.appendChild(editButton);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
      }
    });

    updateStats();
  };

  const updateStats = () => {
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.done).length;
    const undoneTasks = totalTasks - doneTasks;
    const avgDone = totalTasks
      ? ((doneTasks / totalTasks) * 100).toFixed(2)
      : 0;

    totalTasksEl.textContent = totalTasks;
    doneTasksEl.textContent = doneTasks;
    undoneTasksEl.textContent = undoneTasks;
    avgDoneEl.textContent = avgDone;
  };

  const addTask = () => {
    const description = taskInput.value.trim();
    if (description) {
      const date = new Date().toLocaleDateString();

      let taskObject = { description, date, done: false };

      tasks.push(taskObject);
      taskInput.value = "";
      renderTasks();

      fetch("http://localhost:9000/tasks", {
        method: "POST",
        body: JSON.stringify(taskObject),
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async function (response) {
          if (response.status == 201) {
            console.log(`Successful request: ${response.status}`);

            let data = await response.json();

            console.log(`Data: `);
            console.log(data);

            tasks = data;
            renderTasks();
          } else {
            console.log(`Error, Server responded with ${response.status}`);
          }
        })
        .catch(function (error) {});
    }
  };

  const toggleTaskDone = (index) => {
    tasks[index].done = !tasks[index].done;
    renderTasks();
  };

  const editTask = (index, id) => {
    renderTasks();
  };

  const deleteTask = (index, id) => {
    tasks.splice(id, 1);
    renderTasks();
    fetch(`http://localhost:9000/tasks/${index}`, {
      method: "DELETE",
    })
      .then(async (response) => {
        let data = await response.json();

        console.log(`Task deleted`);
        console.log(data);
      })
      .catch(function (error) {});
  };

  addTaskBtn.addEventListener("click", addTask);
  searchInput.addEventListener("input", renderTasks);

  console.log("About to fetch from server");

  fetch("http://localhost:9000/tasks")
    .then(async (response) => {
      if (response.status === 200) {
        console.log(`Successful request: ${response.status}`);
        const data = await response.json();
        console.log(`Data: `, data);
        tasks = data;
        renderTasks();
      } else {
        console.log(`Error, Server responded with ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
