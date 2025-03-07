import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  {
    skipper_id: 2,
    timestamp: 1741140000000,
    rank: "2\r\nARV",
    latitude: null,
    longitude: null,
    heading_degree: null,
    speed_kts: null,
    speed_4h_kts: null,
    speed_24h_kts: "15.1 kts",
    distance_4h_nm: null,
    distance_24h_nm: "118.5 %",
    distance_to_finish_nm: "17.9 kts",
    distance_to_leader_nm: "28326.1 nm",
    arrival_date: "15/01/2025 07:12:02 FR",
    race_time: "65j 18h 10min 02s\r\n",
    gap_to_first: "22h 47min 13s",
    gap_to_previous: "22h 47min 13s",
    over_ortho_speed: "15.1 kts",
    over_ortho_distance: "23905.6 nm",
    over_ground_speed: "17.9 kts",
    over_ground_distance: "28326.1 nm",
  },
  {
    skipper_id: 2,
    timestamp: 1741125600000,
    rank: "2\r\nARV",
    latitude: null,
    longitude: null,
    heading_degree: null,
    speed_kts: null,
    speed_4h_kts: null,
    speed_24h_kts: "15.1 kts",
    distance_4h_nm: null,
    distance_24h_nm: "118.5 %",
    distance_to_finish_nm: "17.9 kts",
    distance_to_leader_nm: "28326.1 nm",
    arrival_date: "15/01/2025 07:12:02 FR",
    race_time: "65j 18h 10min 02s\r\n",
    gap_to_first: "22h 47min 13s",
    gap_to_previous: "22h 47min 13s",
    over_ortho_speed: "15.1 kts",
    over_ortho_distance: "23905.6 nm",
    over_ground_speed: "17.9 kts",
    over_ground_distance: "28326.1 nm",
  },
  {
    skipper_id: 2,
    timestamp: 1741111200000,
    rank: "2\r\nARV",
    latitude: null,
    longitude: null,
    heading_degree: null,
    speed_kts: null,
    speed_4h_kts: null,
    speed_24h_kts: "15.1 kts",
    distance_4h_nm: null,
    distance_24h_nm: "118.5 %",
    distance_to_finish_nm: "17.9 kts",
    distance_to_leader_nm: "28326.1 nm",
    arrival_date: "15/01/2025 07:12:02 FR",
    race_time: "65j 18h 10min 02s\r\n",
    gap_to_first: "22h 47min 13s",
    gap_to_previous: "22h 47min 13s",
    over_ortho_speed: "15.1 kts",
    over_ortho_distance: "23905.6 nm",
    over_ground_speed: "17.9 kts",
    over_ground_distance: "28326.1 nm",
  },
];

export default function RankingDataTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Rang</TableCell>

            <TableCell align="center">Latitude</TableCell>
            <TableCell align="center">Longitude</TableCell>
            <TableCell align="center">Cap</TableCell>
            <TableCell align="center">Vitesse</TableCell>
            <TableCell align="center">Vitesse sur 4h</TableCell>
            <TableCell align="center">Distance sur 4h</TableCell>
            <TableCell align="center">Vitesse sur 24h</TableCell>
            <TableCell align="center">Distance sur 24h</TableCell>
            <TableCell align="center">Distance à l'arrivée</TableCell>
            <TableCell align="center">Distance au leader</TableCell>

            <TableCell align="center">Date d'arrivée</TableCell>
            <TableCell align="center">Temps de course</TableCell>
            <TableCell align="center">Ecart avec le premier</TableCell>
            <TableCell align="center">Ecart avec le précédent</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.timestamp}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                {new Intl.DateTimeFormat("fr").format(row.timestamp)}
              </TableCell>
              <TableCell>{row.rank}</TableCell>
              <TableCell align="center">{row.latitude ?? "-"}</TableCell>
              <TableCell align="center">{row.longitude ?? "-"}</TableCell>
              <TableCell align="center">{row.heading_degree ?? "-"}</TableCell>
              <TableCell align="center">{row.speed_kts ?? "-"}</TableCell>
              <TableCell align="center">{row.speed_4h_kts ?? "-"}</TableCell>
              <TableCell align="center">{row.distance_4h_nm}</TableCell>
              <TableCell align="center">{row.speed_24h_kts}</TableCell>
              <TableCell align="center">{row.distance_24h_nm}</TableCell>
              <TableCell align="center">{row.distance_to_finish_nm}</TableCell>
              <TableCell align="center">{row.distance_to_leader_nm}</TableCell>
              <TableCell align="center">{row.race_time}</TableCell>
              <TableCell align="center">{row.race_time}</TableCell>
              <TableCell align="center">{row.gap_to_first}</TableCell>
              <TableCell align="center">{row.gap_to_previous}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
