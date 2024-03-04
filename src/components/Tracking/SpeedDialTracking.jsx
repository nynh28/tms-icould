import React, { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import {
  ChevronRightIcon,
  InformationCircleIcon,
  MapIcon,
} from "@heroicons/react/outline";
import { CogIcon, XIcon } from "@heroicons/react/solid";

const actions = [
  { icon: <InformationCircleIcon className="h-6 w-6" />, name: "Information" },
  { icon: <MapIcon className="h-6 w-6" />, name: "Map" },
];

const SpeedDialTracking = () => {
  const [open, setOpen] = useState(false);
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        "& .MuiButtonBase-root": {
          width: 42,
          height: 42,
        },
        "& .MuiSpeedDialIcon-root": {
          width: 21,
        },
        "& .MuiSpeedDialIcon-openIcon, .MuiSpeedDialIcon-icon": {
          width: 21,
          height: 24,
        },
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      icon={<SpeedDialIcon icon={<CogIcon />} openIcon={<XIcon />} />}
      direction="down"
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  );
};

export default SpeedDialTracking;
