import React from "react";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const IdentifyJob = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <FormControl variant="standard" fullWidth>
        <InputLabel>{t("vehicleType")}</InputLabel>
        <Select>
          <MenuItem value={1}>Not specifiled</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label={t("driverNote")}
        variant="standard"
        fullWidth
      />
    </div>
  );
};

export default IdentifyJob;
