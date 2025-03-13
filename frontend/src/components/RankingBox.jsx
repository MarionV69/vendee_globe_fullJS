import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import SkipperSelect from "./SkipperSelect";
import RankingDataTable from "./RankingDataTable";

export default function RankingBox() {
  const [skipperId, setSkipperId] = useState();

  return (
    <Box component="section" sx={{ p: 2 }}>
      <Box>
        <SkipperSelect skipperId={skipperId} onSelectChange={setSkipperId} />
        <RankingDataTable skipperId={skipperId} />
      </Box>
    </Box>
  );
}
