import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import {
    useAssignDriverMutation,
  useGetDriversQuery,
  useShipmentAssignDriverMutation,
} from "../../services/apiSlice";
import CustomAsyncSelect from "../FormField/CustomAsyncSelect";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 10,
  borderRadius: 2,
  p: 3,
};

const AssignDriver = ({ jobId, groupId, refetch, setOpenPopupJobDetail, open, setOpen, shipment }) => {
  const { t } = useTranslation();
//   const [open, setOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [criterias, setCriterias] = useState({
    isMapped: true,
    page: 0,
    rowsPerPage: 100,
    groupId,
  });

  const { data, isLoading, isFetching } = useGetDriversQuery(criterias);
  const [assignDriver, { isLoading: isLoadingAssignDriver, isError, error }] =
  useShipmentAssignDriverMutation();
//   const [assignDriver, { isLoading: isLoadingAssignDriver, isError, error }] =
//   useAssignDriverMutation();

  const schema = yup.object().shape({
    driverId: yup
      .string()
      .required(t("message.validation.required", { field: t("fullName") }))
      .nullable(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shipmentId: "",
      driverId: "",
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();

    if (setOpenPopupJobDetail) setOpenPopupJobDetail(false);
  };

  const onSubmit = async (data) => {
    try {
      await assignDriver({...data, shipmentId: shipment?.key}).unwrap();
      handleClose();
      refetch();
      reset()
      toast.success(
        t("message.success.assigned", { from: t("shipment"), to: t("driver") })
      );
    } catch (error) {
      console.log(error);
      if (error?.status === 500) {
        toast.error(
          "The system encountered an abnormal error, please try again later."
        );
      } else {
        toast.error(error?.message || error?.data?.title);
      }
      handleClose();
    }
  };

  return (
    <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
            ".MuiBox-root": {
                top: '50px',
                transform: 'translateX(-50%)'
            }
        }}
      >
        <Box sx={style}>
          <button
            type="button"
            className="absolute right-3 top-3 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" component="h2">
              {t("assignDriver")}
            </Typography>
            <div className="mt-4 space-y-4">
              <p className="font-medium">
                {t("shipmentId")}: <span className="text-orange-500">{shipment?.key}</span>
              </p>
              <Controller
                name="driverId"
                control={control}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={data || []}
                    fullWidth
                    size="small"
                    onChange={(event, newValue) => {
                      setSelectedDriver(
                        data.find((x) => x.driverId === newValue.driverId)
                      );
                      onChange(newValue.driverId);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("fullName")}
                        error={!!errors.driverId}
                        helperText={errors ? errors.driverId?.message : ""}
                        required
                      />
                    )}
                    getOptionLabel={(option) => option.fullName}
                    isOptionEqualToValue={(option, value) =>
                      option.driverId === value.driverId
                    }
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{ gridTemplateColumns: "1fr 2fr 1fr" }}
                        className="grid cursor-pointer gap-px p-2 hover:bg-gray-200"
                        key={option.driverId}
                      >
                        <p className="font-medium text-amber-800">
                          {option.driverId}
                        </p>
                        <p className="">{option.fullName}</p>
                        {/* <p className="">{option.trucks[0].plateLicence}</p> */}
                      </li>
                    )}
                  />
                )}
              />
              {selectedDriver && (
                <Alert severity="info">
                  <p className="font-semibold">{t("infoOfDriver")}</p>
                  <p>
                    - <span className="font-medium">{t("fullName")}:</span>{" "}
                    {selectedDriver.fullName}
                  </p>
                  <p>
                    - <span className="font-medium">{t("phoneNumber")}:</span>{" "}
                    {selectedDriver.phoneNumber}
                  </p>
                  <p>
                    - <span className="font-medium">{t("email")}:</span>{" "}
                    {selectedDriver.email}
                  </p>
                  <p>
                    - <span className="font-medium">{t("drivingLicenceNumber")}:</span>{" "}
                    {selectedDriver.drivingLicenceNumber}
                  </p>
                  <p>
                    - <span className="font-medium">{t("insuranceExpirationDate")}:</span>{" "}
                    {selectedDriver.insuranceExpirationDate}
                  </p>
                  <p>
                    - <span className="font-medium">{t("address")}:</span>{" "}
                    {selectedDriver.address}
                  </p>
                  {/* <p>
                    - <span className="font-medium">{t("licensePlate")}:</span>{" "}
                    {selectedDriver.trucks[0]?.plateLicence}
                  </p> */}
                </Alert>
              )}
              <div className="text-right">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoadingAssignDriver}
                >
                  {t("confirm")}
                </LoadingButton>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AssignDriver;
