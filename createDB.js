import sqlite3 from "sqlite3";
import { existsSync } from "fs";

const DATABASE_FILE = "vendeeglobe.db";
const needToSetup = !existsSync(`./${DATABASE_FILE}`);

export const db = new sqlite3.Database(DATABASE_FILE);

if (needToSetup) {
  console.log("setup");
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS skipper
            (
                id INTEGER PRIMARY KEY NOT NULL,
                nationality VARCHAR(10) NOT NULL,
                name VARCHAR(50) NOT NULL,
                boat VARCHAR(50) NOT NULL,
                UNIQUE(nationality, name, boat)
            );`,
      (err) => {
        if (err) console.error("Error creating skipper table:", err);
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS ranking
            (
                skipper_id INT NOT NULL,
                timestamp INT NOT NULL,
                rank INT NOT NULL,
                latitude VARCHAR(50),
                longitude VARCHAR(50),
                heading_degree VARCHAR(50),
                speed_kts VARCHAR(50),
                speed_4h_kts VARCHAR(50),
                speed_24h_kts VARCHAR(50),
                distance_4h_nm VARCHAR(50),
                distance_24h_nm VARCHAR(50),
                distance_to_finish_nm VARCHAR(50),
                distance_to_leader_nm VARCHAR(50),
                arrival_date VARCHAR(50),
                race_time VARCHAR(50),
                gap_to_first VARCHAR(50),
                gap_to_previous VARCHAR(50),
                over_ortho_speed VARCHAR(50),
                over_ortho_distance VARCHAR(50),
                over_ground_speed VARCHAR(50),
                over_ground_distance VARCHAR(50),
                PRIMARY KEY (skipper_id, timestamp),
                FOREIGN KEY (skipper_id) REFERENCES skipper(id) ON DELETE CASCADE
            );`,
      (err) => {
        if (err) console.error("Error creating ranking_data table:", err);
      }
    );
  });
}
