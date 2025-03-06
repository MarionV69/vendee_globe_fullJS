import { readFileSync, writeFileSync } from "fs";
import { db } from "./createDB.js";
import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

const json = readFileSync("data.json");
const allData = JSON.parse(json);

function insertData(allData) {
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

  db.serialize(() => {
    const stmt1 = db.prepare(
      "INSERT OR IGNORE INTO skipper (nationality, name, boat) VALUES (? , ?, ?)"
    );
    const stmt2 = db.prepare("SELECT id FROM skipper AS s WHERE s.name = ?");
    const stmt3 = db.prepare(
      `INSERT INTO ranking (
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
        ) VALUES (
        :skipper_id,
        :timestamp,
        :rank,
        :latitude,
        :longitude,
        :heading_degree,
        :speed_kts,
        :speed_4h_kts,
        :speed_24h_kts,
        :distance_4h_nm,
        :distance_24h_nm,
        :distance_to_finish_nm,
        :distance_to_leader_nm,
        :arrival_date,
        :race_time,
        :gap_to_first,
        :gap_to_previous,
        :over_ortho_speed,
        :over_ortho_distance,
        :over_ground_speed,
        :over_ground_distance`
    );

    for (const skipper of skippers) {
      stmt1.run(skipper.nationality, skipper.name, skipper.boat, (err) => {
        if (err) console.error("Error inserting skipper:", err);
      });
    }
    stmt1.finalize();

    for (const ranking of rankings) {
      stmt2.get(ranking.skipperName, (err, row) => {
        if (err) console.log(err);
        stmt3.run({
          skipper_id: row.id,
          timestamp: ranking.timeStamp,
          rank: ranking.rank,
          latitude: ranking.latitude,
          longitude: ranking.longitude,
          heading_degree: ranking.degree,
          speed_kts: ranking.speed,
          speed_4h_kts: ranking.speed4h,
          speed_24h_kts: ranking.speed24h,
          distance_4h_nm: ranking.distance4h,
          distance_24h_nm: ranking.distance24h,
          distance_to_finish_nm: ranking.distanceToFinish,
          distance_to_leader_nm: ranking.distanceToLeader,
          arrival_date: ranking.arrivalDate,
          race_time: ranking.raceTime,
          gap_to_first: ranking.gapToFirst,
          gap_to_previous: ranking.gapToPrevious,
          over_ortho_speed: ranking.overOrthoSpeed,
          over_ortho_distance: ranking.overOrthoDistance,
          over_ground_speed: ranking.overGroundSpeed,
          over_ground_distance: ranking.overGroundDistance,
        });
      });
    }
    stmt2.finalize();
    stmt3.finalize();
  });
}

/////////////////////////////////////////////////////

insertData(allData);
