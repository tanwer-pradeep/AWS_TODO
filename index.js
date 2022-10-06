const express = require("express");
const fs = require("fs");
const { randomBytes } = require("crypto");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const filter = req.query.filter;
  fs.readFile("./AllTodos.json", "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .send("Sorry something went wrong please try again later");
    const todos = JSON.parse(data);
    switch (filter) {
      case "completed":
        return res
          .status(200)
          .send({ todos: todos.filter((t) => t.complete === true) });
      case "incompleted":
        return res
          .status(200)
          .send({ todos: todos.filter((t) => t.complete === false) });
      default:
        return res.status(200).send({ todos: todos });
    }
  });
});

app.put("/todos/:id/complete", (req, res) => {
  const id = req.params.id;
  fs.readFile("./AllTodos.json", "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .send("Sorry something went wrong please try again later");
    let todos = JSON.parse(data);
    let taskToUpdate = todos.filter((t) => t.id == id);
    if (!!taskToUpdate[0]) {
      taskToUpdate[0].complete = true;
      fs.writeFile("./AllTodos.json", JSON.stringify(todos), (err) => {
        if (err) return res.status(500).send("Something went wrong");
        return res.status(200).send({ msg: "Task is updated successfully" });
      });
    } else return res.status(204).send();
  });
});

app.post("/", (req, res) => {
  if (!req.body.name)
    return res.status(400).send("Please provide the name for task");

  const name = req.body.name;
  const id = randomBytes(4).toString("hex");
  const newTask = {
    id,
    name,
    complete: false,
  };
  fs.readFile("./AllTodos.json", "utf-8", (err, data) => {
    if (err)
      return res
        .status(500)
        .send("Sorry something went wrong please try again later");
    let todos = JSON.parse(data);
    let updatedTodos = [...todos, newTask];

    fs.writeFile("./AllTodos.json", JSON.stringify(updatedTodos), (err) => {
      if (err) return res.status(500).send("Something went wrong");
      return res.status(201).send({ msg: "Task is created successfully" });
    });
  });
});

app.listen(3000, () => {
  console.log("app is runnig at port 3000");
});
