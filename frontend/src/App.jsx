import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import RankingBox from "./components/RankingBox";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" align="center" sx={{ mb: 2 }}>
          Vendée globe 2024
        </Typography>
        <RankingBox />
      </Box>
    </Container>
  );
}

export default App;
