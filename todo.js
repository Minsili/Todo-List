const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const app = express();

let tasks = [
  {
    id: 1,
    message: "Done",
    date: "Monday",
    description: "buy the milk",
    done: false,
  },
  {
    id: 2,
    message: "Done",
    date: "Tuesday",
    description: "rent a car",
    done: true,
  },
  {
    id: 3,
    message: "To do",
    date: "Tuesday",
    description: "feed the cat",
    done: false,
  },
];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors("*"));

app.get("/tasks", (request, response) => response.status(200).json(tasks));

app.post("/tasks", (request, response) => {
  const task = request.body;
  task.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
  tasks.push(task);
  response.status(201).json(task);
});

// endpoint to update a task
app.patch("/tasks/:id", function (req, res) {
  const id = Number(req.params.id);
  const updateBody = req.body;
  let isFound = false;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      isFound = true;
      tasks[i].message = updateBody.message || tasks[i].message;
      tasks[i].description = updateBody.description || tasks[i].description;
      tasks[i].done =
        updateBody.done !== undefined ? updateBody.done : tasks[i].done;
      break;
    }
  }
  if (!isFound) {
    return res.status(404).send();
  }
  return res.status(200).json(tasks.find((task) => task.id === id));
});

// endpoint to delete specific task
app.delete("/tasks/:id", function (req, res) {
  const id = Number(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  return res.status(200).json({ message: "Task deleted successfully" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
