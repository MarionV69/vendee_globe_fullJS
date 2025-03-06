import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example
        </Typography>
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </Box>
    </Container>
  );
}

export default App;
