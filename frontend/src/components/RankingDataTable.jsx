import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const dateFormatter = new Intl.DateTimeFormat("fr", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function RankingDataTable({ skipperId, date }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getRankings() {
      setLoading(true);
      try {
        const json = await (
          await fetch(`http://localhost:3000/ranking?skipper=${skipperId}`)
        ).json();
        setRankings(json);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des classements :",
          error
        );
        setRankings([]);
      } finally {
        setLoading(false);
      }
    }
    if (skipperId) getRankings();
  }, [skipperId]);

  return (
    <Box mt={2}>
      {!skipperId ? (
        <p>Sélectionnez un skipper pour retrouver tous ses classements !</p>
      ) : loading ? (
        <p>Chargement des données en cours...</p>
      ) : rankings.length === 0 ? (
        <p>Aucun classement trouvé pour ce skipper.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="Classements du skipper">
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
              {rankings.map((ranking, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {dateFormatter.format(new Date(ranking.timestamp))}
                  </TableCell>
                  <TableCell>{ranking.rank ?? "Abandon"}</TableCell>
                  <TableCell align="center">
                    {ranking.latitude ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.longitude ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.heading_degree ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.speed_kts ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.speed_4h_kts ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.distance_4h_nm ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.speed_24h_kts ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.distance_24h_nm ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.distance_to_finish_nm ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.distance_to_leader_nm ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.arrival_date ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.race_time ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.gap_to_first ?? "-"}
                  </TableCell>
                  <TableCell align="center">
                    {ranking.gap_to_previous ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
