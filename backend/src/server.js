const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const portfolioData = require("./data/portfolio-data");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/portfolio", (_req, res) => {
  res.json(portfolioData);
});

const frontendDistPath = path.resolve(__dirname, "../../frontend/dist/frontend");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Portfolio API listening on http://localhost:${port}`);
});
