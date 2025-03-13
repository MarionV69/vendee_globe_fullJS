import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import FilterDateSelect from "./FilterDateSelect";

export default function SkipperSelect({ skipperId, onSelectChange }) {
  const [skippers, setSkippers] = useState([]);
  // const [selectedDate, setSelectedDate] = useState();

  const handleChange = (event) => {
    // setSelectedDate();
    onSelectChange(event.target.value);
  };

  useEffect(() => {
    async function getSkippers() {
      try {
        const json = await (
          await fetch("http://localhost:3000/skipper")
        ).json();
        setSkippers([...json]);
      } catch (error) {
        console.log(error);
      }
    }
    getSkippers();
  }, []);

  return (
    <>
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
      {/* {skipperId && (
        <FilterDateSelect skipperId={skipperId} date={selectedDate} />
      )} */}
    </>
  );
}
