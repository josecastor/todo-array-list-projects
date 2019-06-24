const express = require("express");

const app = express();

app.use(express.json());

let numberRequestApplication = 0;
let projects = [];

function checkExistsProject(req, res, next) {
  const { id } = req.params;
  const p = projects.find(project => project.id === parseInt(id));

  if (!id) {
    return res.status(400).json({ error: "Project id is necessary !" });
  }

  if (!p) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

function countRequest(req, res, next) {
  numberRequestApplication++;
  console.log(`Atualmente temos ${numberRequestApplication} requisições`);
  return next();
}

// router main api
app.get("/", (req, res, next) => {
  res.json({ status: "api on" });
});

// list all projects
app.get("/projects", (req, res, next) => {
  return res.json(projects);
});

// create project
app.post("/projects", (req, res, next) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  return res.json({ success: "Project create success" });
});

// update project
app.put("/projects/:id", checkExistsProject, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.map(
    project => (project.title = project.id == id ? title : project.title)
  );
  return res.json({ success: "Project updated" });
});

// delete project
app.delete("/projects/:id", checkExistsProject, (req, res, next) => {
  const { id } = req.params;
  const indexProject = projects.findIndex(project => project.id == id);
  projects.splice(indexProject, 1);
  return res.json({ success: "Project removed" });
});

// add tasks
app.post("/projects/:id/tasks", checkExistsProject, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(project => project.id == id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
});

app.listen(3000);
