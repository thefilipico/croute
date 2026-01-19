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

  const filtered = pois.filter((p) => p.type === type);

  if (filtered.length === 0)
    return res.status(404).json({ error: "No POIs of that type found" });

  let start = filtered[0];
  if (!isNaN(startLat) && !isNaN(startLon)) {
    start = filtered.reduce((nearest, poi) => {
      const dist = Math.sqrt(
        (poi.lat - startLat) ** 2 + (poi.lon - startLon) ** 2
      );
      const nearestDist = Math.sqrt(
        (nearest.lat - startLat) ** 2 + (nearest.lon - startLon) ** 2
      );
      return dist < nearestDist ? poi : nearest;
    }, start);
  }

  const route = greedyRoute(start, filtered, maxDistance);
  res.json(route);
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
