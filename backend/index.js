const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Performance System API is running");
});

app.get("/api/tasks", (req, res) => {
  res.json([
    { id: 1, title: "Rapor hazırla", status: "Done" },
    { id: 2, title: "Frontend ekranı", status: "In Progress" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
