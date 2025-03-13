import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function FilterDateSelect({ skipperId }) {
  const [dates, setDates] = useState();

  const handleChange = (event) => {
    onSelectChange(event.target.value);
  };

  useEffect(() => {
    async function getFilteredByDateData() {
      const timestamp = toTimestamp(date);
      try {
        const json = await (
          await fetch(
            `http://localhost:3000//ranking?timestamp=${timestamp}&skipper=${skipperId}`
          )
        ).json();
        setSkippers([...json]);
      } catch (error) {
        console.log(error);
      }
    }
    getSkippers();
  }, []);

  return (
    <Box sx={{ minWidth: 120 }}>
      {skippers.length === 0 ? (
        "Loading..."
      ) : (
        <FormControl fullWidth>
          <InputLabel id="skipper-select-label">Skippers</InputLabel>
          <Select
            labelId="skipper-select-label"
            id="skipper-select"
            value={skipperId ?? ""}
            label="Skipper"
            onChange={handleChange}
          >
            {skippers.map((skipper) => (
              <MenuItem key={skipper.id} value={skipper.id}>
                {skipper.name}
              </MenuItem>
            ))}
            ;
          </Select>
        </FormControl>
      )}
    </Box>
  );
}
