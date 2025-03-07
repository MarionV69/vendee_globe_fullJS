import * as React from "react";
import Box from "@mui/material/Box";
import SkipperSelect from "./SkipperSelect";
import RankingDataTable from "./RankingDataTable";

export default function RankingBox() {
  return (
    <Box component="section" sx={{ p: 2 }}>
      <Box>
        <SkipperSelect />
        <RankingDataTable />
      </Box>
    </Box>
  );
}
