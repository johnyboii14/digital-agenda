import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function UpSells() {
  return (
    <Accordion style={{ backgroundColor: "#ebfeff" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Upsells</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>content</Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default UpSells;
