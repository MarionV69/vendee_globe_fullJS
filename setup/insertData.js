import { readFileSync } from "fs";
import { DATABASE_FILE, db } from "./createDB.js";

const json = readFileSync("data.json");
const allData = JSON.parse(json);

async function insertData(allData) {
  const skippers = [];
  const rankings = [];

  for (const ranking of allData) {
    const timeStamp = ranking.timeStamp;

    for (const row of ranking.data) {
      if (!row.D) continue;

      const name = row.D.split("\r\n")[0];
      let boat = row.D.split("\r\n")[1];
      if (name.includes("Skipper")) continue;
      if (boat.includes("STAND")) boat = "STAND AS ONE - Altivia";

      skippers.push({
        nationality: row.C,
        name: name,
        boat: boat,
      });

      if (row.M && row.M.includes("premier")) continue;

      rankings.push({
        timeStamp: timeStamp,
        skipperName: name,
        isArrived: row.B.includes("ARV") ? 1 : 0,
        rank: parseInt(row.B) || null,
        latitude: row.F || null,
        longitude: row.G || null,
        heading: row.H || null,
        speed: !row.B.includes("ARV") ? row.I : null,
        speed4h: row.M || null,
        speed24h: row.Q || null,
        distance4h: row.O || null,
        distance24h: row.S || null,
        distanceToFinish: row.T || null,
        distanceToLeader: row.U || null,
        arrivalDate: row.H || null,
        raceTime: row.B.includes("ARV") ? row.I : null,
        gapToFirst: row.N || null,
        gapToPrevious: row.P || null,
        overOrthoSpeed: row.Q || null,
        overOrthoDistance: row.R || null,
        overGroundSpeed: row.T || null,
        overGroundDistance: row.U || null,
      });
    }
  }

  const stmt1 = await db.prepare(
    "INSERT OR IGNORE INTO skipper (nationality, name, boat) VALUES (?, ?, ?)"
  );

  for (const skipper of skippers) {
    try {
      await stmt1.run(skipper.nationality, skipper.name, skipper.boat);
    } catch (err) {
      console.error("Error inserting skipper:", err);
    }
  }
  await stmt1.finalize();

  let skipperDatabase = {};
  const stmt2 = await db.prepare("SELECT id, name FROM skipper");
  try {
    const rows = await stmt2.all();
    for (const row of rows) skipperDatabase[row.name] = row.id;
  } catch (error) {
    console.error("Error select skipper:", error);
  }
  await stmt2.finalize();

  const stmt3 = await db.prepare(
    `INSERT OR IGNORE INTO ranking (
      skipper_id,
      timestamp,
      is_arrived,
      rank,
      latitude,
      longitude,
      heading_degree,
      speed_kts,
      speed_4h_kts,
      speed_24h_kts,
      distance_4h_nm,
      distance_24h_nm,
      distance_to_finish_nm,
      distance_to_leader_nm,
      arrival_date,
      race_time,
      gap_to_first,
      gap_to_previous,
      over_ortho_speed,
      over_ortho_distance,
      over_ground_speed,
      over_ground_distance
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const response = await Promise.all(
    rankings.map((ranking) => {
      return stmt3.run(
        skipperDatabase[ranking.skipperName],
        ranking.timeStamp,
        ranking.isArrived,
        ranking.rank,
        ranking.latitude,
        ranking.longitude,
        ranking.heading,
        ranking.speed,
        ranking.speed4h,
        ranking.speed24h,
        ranking.distance4h,
        ranking.distance24h,
        ranking.distanceToFinish,
        ranking.distanceToLeader,
        ranking.arrivalDate,
        ranking.raceTime,
        ranking.gapToFirst,
        ranking.gapToPrevious,
        ranking.overOrthoSpeed,
        ranking.overOrthoDistance,
        ranking.overGroundSpeed,
        ranking.overGroundDistance
      );
    })
  );

  await stmt3.finalize();
}

/////////////////////////////////////////////////////

await db.open(`../${DATABASE_FILE}`);

await insertData(allData);

await db.close();
