import React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";


const CustomTextField = ({ name, label, control, errors, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          label={t(label)}
          variant="outlined"
          fullWidth
          error={!!errors}
        //   helperText={errors ? errors.message : ""}
          {...rest}
        />
        // <TextField
        //   {...field}
        //   label={t(label)}
        //   variant="standard"
        //   fullWidth
        //   error={!!errors}
        //   helperText={errors ? errors.message : ""}
        //   {...rest}
        // />
      )}
    />
  );
};

export default CustomTextField;
