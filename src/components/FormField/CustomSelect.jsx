import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

const CustomSelect = ({ name, label, control, errors, options, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControl
          variant="outlined"
          sx={{ m: 0, minWidth: 120 }}
          fullWidth
          error={errors ? true : false}
          {...rest}
        >
          <InputLabel>{t(label)}</InputLabel>
          <Select label={t(label)} onChange={onChange} value={value}>
            {options.map((item) => (
              <MenuItem key={item.id} value={item.id} disabled={item.disabled}>
                {t(item.value)}
              </MenuItem>
            ))}
          </Select>
          {errors && <FormHelperText>{errors.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CustomSelect;
