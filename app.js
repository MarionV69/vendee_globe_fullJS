import { DATABASE_FILE, db } from "./setup/createDB.js";
import express from "express";

const app = express();
const port = 3000;

await db.open(DATABASE_FILE);

/**
 * Skipper path
 *
 * Params: N/A
 *
 * Return: Array of Skippers
 */
app.get("/skipper", async (req, res) => {
  res.json(await db.all("SELECT * FROM skipper"));
});

// Get one skipper => /skipper/:skipperId
app.get("/skipper/:skipperId(\\d+)", async (req, res) => {
  res.json(
    await db.get(`SELECT * FROM skipper WHERE id = ${req.params.skipperId}`)
  );
});

// Get rankings:
//    - path => /ranking
//    - params timestamp and/or skipper
//        => /ranking?timestamp=:timestamp
//        => /ranking?skipper=:skipperId
//        => /ranking?timestamp=:timestamp&skipper=:skipperId
//        => /ranking?timestamp=[timestamp1, timestamp2]   (from timestamp1 to timestamp2)
//

app.get("/ranking", async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.json(
      await db.all(
        `SELECT * FROM ranking ORDER BY timestamp DESC, rank ASC LIMIT 200`
      )
    );
  }

  const { skipper, timestamp } = req.query;
  let whereClause = [];

  if (skipper) whereClause.push(`skipper_id = ${+skipper}`);
  if (timestamp) {
    try {
      const [start, end] = JSON.parse(timestamp);
      whereClause.push(`timestamp BETWEEN ${+start} AND ${+end}`);
    } catch {
      whereClause.push(`timestamp = ${+timestamp}`);
    }
  }

  res.json(
    await db.all(
      `SELECT * FROM ranking ${
        whereClause.length === 0
          ? "ORDER BY timestamp DESC, rank ASC LIMIT 200"
          : `WHERE ${whereClause.join(
              " AND "
            )} ORDER BY timestamp DESC, rank ASC`
      }`
    )
  );
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
