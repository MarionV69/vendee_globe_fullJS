import { readFileSync } from "fs";
import { DATABASE_FILE, db } from "./createDB.js";

const json = readFileSync("data.json");
const allData = JSON.parse(json);

async function insertData(allData) {
  const skippers = [];
  const rankings = [];

  for (const ranking of allData) {
    const timeStamp = ranking.timeStamp;

    for (const raw of ranking.data) {
      if (!raw.D) continue;

      const name = raw.D.split("\r\n")[0];
      let boat = raw.D.split("\r\n")[1];
      if (name.includes("Skipper")) continue;
      if (boat.includes("STAND")) boat = "STAND AS ONE - Altivia";

      skippers.push({
        nationality: raw.C,
        name: name,
        boat: boat,
      });

      if (raw.M && raw.M.includes("premier")) continue;

      rankings.push({
        timeStamp: timeStamp,
        skipperName: name,
        rank: raw.B || null,
        latitude: raw.F || null,
        longitude: raw.G || null,
        heading: raw.H || null,
        speed: raw.I || null,
        speed4h: raw.M || null,
        speed24h: raw.Q || null,
        distance4h: raw.O || null,
        distance24h: raw.S || null,
        distanceToFinish: raw.T || null,
        distanceToLeader: raw.U || null,
        arrivalDate: raw.H || null,
        raceTime: raw.I || null,
        gapToFirst: raw.N || null,
        gapToPrevious: raw.P || null,
        overOrthoSpeed: raw.Q || null,
        overOrthoDistance: raw.R || null,
        overGroundSpeed: raw.T || null,
        overGroundDistance: raw.U || null,
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
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const response = await Promise.all(
    rankings.map((ranking) => {
      return stmt3.run(
        skipperDatabase[ranking.skipperName],
        ranking.timeStamp,
        ranking.rank,
        ranking.latitude,
        ranking.longitude,
        ranking.degree,
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
  // console.log(JSON.stringify(response, null, 4));

  await stmt3.finalize();
}

/////////////////////////////////////////////////////

await db.open(`../${DATABASE_FILE}`);

await insertData(allData);

await db.close();
