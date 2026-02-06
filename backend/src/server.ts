import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { POI, greedyRoute } from "./utils";

const app = express();
app.use(cors());

const frontendPath = path.join(__dirname, "../../frontend");
app.use(express.static(frontendPath));

const poisPath = path.join(__dirname, "../data/buildings.json");
const pois: POI[] = JSON.parse(fs.readFileSync(poisPath, "utf8"));

app.get("/route", (req, res) => {
  const type = req.query.type as string;
  const maxDistance = Number(req.query.maxDistance || 20);
  const startLat = Number(req.query.startLat);
  const startLon = Number(req.query.startLon);

  if (!type) return res.status(400).json({ error: "Missing type parameter" });
  if (isNaN(startLat) || isNaN(startLon)) return res.status(400).json({ error: "Missing or invalid start coordinates" });

  const filtered = pois.filter((p) => p.type === type);

  if (filtered.length === 0)
    return res.status(404).json({ error: "No POIs of that type found" });

  const start: POI = { lat: startLat, lon: startLon, name: "Start", type: type, city: "" };
  const route = greedyRoute(start, filtered, maxDistance);
  res.json(route);
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server pokrenut na http://localhost:${PORT}`)
);
