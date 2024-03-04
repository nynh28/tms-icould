import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import {
    useAddExpenseMutation,
    useAssignDriverMutation,
    useGetStaffsQuery,
    useShipmentAddExpenseMutation,
    useShipmentUpdateExpenseMutation,
} from "../../services/apiSlice";
import CustomAsyncSelect from "../FormField/CustomAsyncSelect";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CustomTextField from "../FormField/CustomTextField";
import CustomSelect from "../FormField/CustomSelect";
import CustomNumberField from "../FormField/CustomNumberField";
import { expenseTypes } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetailShipment, setSelectedExpense, toggleExpenseForm } from "../../features/shipment/shipmentSlice";
import { updateExpenseShipment } from "../../api";

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

const defaultValue = {
        //   jobId,
        expenseType: "",
        details: "",
        totalMoney: 0,
        totalLiter: 0,
        note: "",
        status: 1
}

const AddExpense = ({ rowData, open, setOpen, shipment, refetch, setOpenPopupJobDetail }) => {
    const { t } = useTranslation();
    //   const [open, setOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [criterias, setCriterias] = useState({
        isMapped: true,
        page: 0,
        rowsPerPage: 10,
    });

    const {showExpenseForm, selectedExpense} = useSelector(state => state.shipment)
    const dispatch = useDispatch()

    useEffect(_ => {
        setOpen(showExpenseForm)
    }, [showExpenseForm])

    useEffect(_ => {
        if(selectedExpense && selectedExpense.id){
            reset(selectedExpense)
        }else{
            reset(defaultValue)
        }
    }, [selectedExpense])

    const [addExpense, { isLoading: isLoadingAdd, isError, error }] =
        useShipmentAddExpenseMutation();

    const [updateExpense, { isLoading: isLoadingUpdate, isError: isErrorUpdate, error: errorUpdate }] =
        useShipmentUpdateExpenseMutation();

    const schema = yup.object().shape({
        expenseType: yup
            .string()
            .required(t("message.validation.required", { field: t("expenseType") }))
            .nullable(),
        // details: yup
        //   .string()
        //   .required(t("message.validation.required", { field: t("details") }))
        //   .nullable(),
        totalMoney: yup
            .string()
            .required(t("message.validation.required", { field: t("totalMoney") }))
            .nullable(),
        totalLiter: yup
            .string()
            .required(t("message.validation.required", { field: t("totalLiter") }))
            .nullable(),
        // note: yup
        //   .string()
        //   .required(t("message.validation.required", { field: t("note") }))
        //   .nullable(),
    });


    const {
        control,
        handleSubmit,
        getValues,
        reset,
        watch,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValue,
    });

    const watchType = watch("expenseType", '') // you can supply default value as second argument


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        // setOpen(false);
        reset();
        dispatch(toggleExpenseForm(false))
        dispatch(setSelectedExpense(null))

        // if (setOpenPopupJobDetail) setOpenPopupJobDetail(false);
    };


    const onSubmit = async (data) => {
        try {
            if(data.expenseType == 1 || data.expenseType == 2){
                data.totalLiter = 0
            }
            if(data.id){
                // let response = await updateExpenseShipment({ shipmentId: shipment.shipmentHashString, data: { ...data } })
            
                await updateExpense({ shipmentId: shipment.shipmentHashString, data: { ...data } }).unwrap();
                // console.log(response)
                //   refetch
                handleClose();
                // refetch()
                dispatch(fetchDetailShipment(shipment.shipmentId))
                toast.success(
                    t("message.success.update", {
                        field: t("expense"),
                    })
                );
            }else{

                await addExpense({ shipmentId: shipment.shipmentHashString, data: { ...data } }).unwrap();
                //   refetch
                handleClose();
                dispatch(fetchDetailShipment(shipment.shipmentId))
                // refetch()
                toast.success(
                    t("message.success.add", {
                        field: t("expense"),
                    })
                );
            }
        } catch (error) {
            console.log(error);
            if (error?.status === 500) {
                toast.error(
                    "The system encountered an abnormal error, please try again later."
                );
            } else {
                toast.error(error?.message || error?.data?.title);
            }
            // handleClose();
        }
    };

    return (
        <div>
            {/* <p onClick={handleOpen} className="text-[#377EF0] cursor-pointer text-[13px] mt-3">+ Add Expense</p> */}

            {/* <Button onClick={handleOpen} className="text-white">
        +
      </Button> */}
            <Modal
                open={showExpenseForm}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
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
                            {t("addExpense")}
                        </Typography>
                        <div className="mt-4 space-y-4">
                            <p className="font-medium">
                                {t("shipmentId")}: <span className="text-orange-500">{shipment?.key}</span>
                            </p>
                            <CustomSelect
                                name="expenseType"
                                label="expenseType"
                                control={control}
                                errors={errors.expenseType}
                                options={expenseTypes}
                                required
                            />
                            <CustomTextField
                                name="details"
                                label="details"
                                control={control}
                                errors={errors.details}
                            />
                            <CustomNumberField
                                name="totalMoney"
                                label="totalMoney"
                                control={control}
                                errors={errors.totalMoney}
                                required
                            />
                            {(watchType == 1 || watchType == 2) &&
                            <CustomNumberField
                                name="totalLiter"
                                label="totalLiter"
                                control={control}
                                errors={errors.totalLiter}
                                required
                            />}
                            <CustomTextField
                                name="note"
                                label="note"
                                control={control}
                                errors={errors.note}
                                
                            />
                            <CustomSelect
                                name="status"
                                label="Status"
                                control={control}
                                errors={errors.status}
                                options={[
                                    { id: 1, value: 'Created'},
                                    // { id: 2, value: 'Pending'},
                                    { id: 3, value: 'Approved'},
                                    { id: 4, value: 'Cancel'},
                                ]}
                                required
                            />
                            {
                               ( selectedExpense && selectedExpense.id ) &&(
                                <>
                                    <p>Created by: <strong>{selectedExpense.createdByName} ({selectedExpense.createdAt})</strong></p>
                                    {selectedExpense.updatedAt && (<p>Updated by: <strong>{selectedExpense.createdByName} ({selectedExpense.updatedAt})</strong></p>)}
                                </>
                               )
                            }
                            <div className="text-right">
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isLoadingAdd}
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

export default AddExpense;
