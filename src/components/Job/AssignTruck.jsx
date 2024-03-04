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
    useAssignJobMutation,
    useGetTruckTypeQuery,
    useGetTrucksQuery,
    useShipmentAssignTruckMutation,
} from "../../services/apiSlice";
import CustomAsyncSelect from "../FormField/CustomAsyncSelect";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";

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

const AssignTruck = ({ jobId, groupId, setOpenPopupJobDetail, open, setOpen, shipment }) => {
    const { t } = useTranslation();
    //   const [open, setOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const { masterDatas } = useSelector((state) => state.masterDatas);

    const [criterias, setCriterias] = useState({
        isMapped: true,
        page: 0,
        rowsPerPage: 100,
        groupId,
        carCharactersId: null
    });

    const { data: truckTypeList, isLoading: truckTypeLoading, isFetching: truckTypeFetching, isSuccess } =
        useGetTruckTypeQuery({ page: 0, rowsPerPage: 100 });

    const getTruckName = (value) => {
        let name = "";
        const truck = masterDatas?.find(
            (x) => x.type === "VEHICLETYPE" && x.intValue === value
        );
        if (truck) name = truck?.name;

        return name;
    };

    const { data, isLoading, isFetching, refetch } = useGetTrucksQuery(criterias);
    const [assignTruck, { isLoading: isLoadingAssignJob, isError, error }] =
        useShipmentAssignTruckMutation();
    //   const [assignJob, { isLoading: isLoadingAssignJob, isError, error }] =
    //     useAssignJobMutation();

    const schema = yup.object().shape({
        truckId: yup
            .string()
            .required(t("message.validation.required", { field: t("licensePlate") }))
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
            shipmentId: shipment?.key,
            truckId: "",
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
            await assignTruck({ ...data, shipmentId: shipment?.key }).unwrap();
            handleClose();
            refetch();
            reset()
            toast.success(
                t("message.success.assigned", { from: t("shipment"), to: t("truck") })
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
            {/* <Button onClick={handleOpen} className="text-white">
        +
      </Button> */}
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
                            {t("assignTruck")}
                        </Typography>
                        <div className="mt-4 space-y-4">
                            <p className="font-medium">
                                {t("shipmentId")}: <span className="text-orange-500">{shipment?.key}</span>
                            </p>
                            {/* <CustomAsyncSelect
                        label="carCharactersId"
                        data={truckTypeList?.content.map((item) => ({
                            id: item.carCharacteristicsId,
                            text: item.englishName,
                        }))}
                        isFetching={truckTypeFetching}
                        isLoading={truckTypeLoading}
                        // onChange={handleChange}
                        onChange={(e) => {
                            console.log(e)
                            setCriterias(prevState => ({
                                ...prevState,
                                carCharactersId: e || null
                            }))
                            refetch()
                        }}
                    /> */}
                            <Controller
                                name="truckId"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={data?.content || []}
                                        fullWidth
                                        size="small"
                                        onChange={(event, newValue) => {
                                            setSelectedTruck(
                                                data?.content.find((x) => x.truckId === newValue.truckId)
                                            );
                                            onChange(newValue.truckId);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t("licensePlate")}
                                                error={!!errors.truckId}
                                                helperText={errors ? errors.truckId?.message : ""}
                                                required
                                            />
                                        )}
                                        getOptionLabel={(option) => option.plateLicense}
                                        isOptionEqualToValue={(option, value) =>
                                            option.truckId === value.truckId
                                        }
                                        renderOption={(props, option) => (
                                            <li
                                                {...props}
                                                style={{ gridTemplateColumns: "1fr 2fr 1fr" }}
                                                className="grid cursor-pointer gap-px p-2 hover:bg-gray-200"
                                                key={option.truckId}
                                            >
                                                <p className="font-medium text-amber-800">
                                                    {option.truckId}
                                                </p>
                                                <p className="">{option.plateLicense}</p>
                                                {/* <p className="">{option.trucks[0].plateLicense}</p> */}
                                            </li>
                                        )}
                                    />
                                )}
                            />
                            {selectedTruck && (
                                <Alert severity="info">
                                    <p className="font-semibold">{t("infoTruck")}</p>
                                    <p>
                                        - <span className="font-medium">{t("licensePlate")}:</span>{" "}
                                        {selectedTruck?.plateLicense}
                                    </p>
                                    <p>
                                        - <span className="font-medium">{t("brand")}:</span>{" "}
                                        {selectedTruck?.brand}
                                    </p>
                                    <p>
                                        - <span className="font-medium">{t("vehicleType")}:</span>{" "}
                                        {t(getTruckName(selectedTruck?.truckType))}
                                    </p>
                                    <p>
                                        - <span className="font-medium">{t("loadingWeight")}:</span>{" "}
                                        {selectedTruck?.loadingWeight}
                                    </p>
                                </Alert>
                            )}
                            <div className="text-right">
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isLoadingAssignJob}
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

export default AssignTruck;
