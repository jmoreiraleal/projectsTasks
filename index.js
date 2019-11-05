const express = require("express");
const server = express();
server.use(express.json());
const projects = [
  {
    id: "",
    title: "",
    tasks: []
  }
];

/**
 * Utilizamos a variável `numberOfRequests` como
 * `let` porque vai sofrer mutação. A variável
 * `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo
 * uma constante.
 */
let numberOfRequests = 0;

//Middleware global
server.use((req, res, next) => {
  numberOfRequests++;
  console.log(`Número de requisições:${numberOfRequests}`);
  next();
});
//Middleware local checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(projeto => projeto.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.forEach(p => ((p.id = id), (p.title = title)));
  projects.id = id;
  projects.title = title;
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (projects.id === id) {
    projects.title = title;
  } else {
    return res.status(400).json({ error: "id not exists" });
  }
  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  if (projects.id === id) {
    projects.title = "";
  } else {
    return res.status(400).json({ error: "id not exists" });
  }
  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (project) {
    const { title } = req.body;
    projects.forEach(item => item.tasks.push(title));
  } else {
    return res.status(400).json({ error: "id not exists" });
  }
  return res.json(projects);
});

server.listen(3000);
