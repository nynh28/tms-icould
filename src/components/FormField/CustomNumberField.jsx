import React from "react";
import NumberFormat from "react-number-format";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const CustomNumberField = ({ name, label, control, errors, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <NumberFormat
          value={value}
          customInput={TextField}
          thousandSeparator={true}
          onValueChange={(v) => {
            onChange(Number(v.value));
          }}
          variant="outlined"
          label={t(label)}
          error={!!errors}
          helperText={errors ? errors?.message : ""}
          fullWidth
          {...rest}
        />
      )}
    />
  );
};

export default CustomNumberField;
