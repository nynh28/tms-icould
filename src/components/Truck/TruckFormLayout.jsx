import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useAddTruckMutation } from "../../services/apiSlice";
import CustomDateTimeField from "../FormField/CustomDateTimeField";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addTruck } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import AddTruckForm from "./Form";

const AddTruckForm1 = ({ fleets, refetch, setOpenForm }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [addTruck, { isLoading }] = useAddTruckMutation();
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    // Validation
   

    const onClose = () => {
        setOpenForm(false);
        clearErrors();
        reset();
    };

    return (
        <>
            <div className="flex h-full flex-col">
                <div className="flex py-6 px-2 justify-between items-top border-b">
                    <div className="flex">
                        <div className="flex h-7 items-center justify-center gap-4">
                            <button
                                type="button"
                                className="bg-transparent hover:bg-[#999] text-[#3d3b3b] p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={onClose}
                            >
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="flex flex-col ml-3 items-start">
                            <h2 className="text-lg font-medium capitalize ">
                                {t("addTitle", { field: t("truck") })} 
                            </h2>
                            <div className="mt-1">
                                <p className="text-sm text-light">
                                    {t("addSubtitle", { field: t("truck") })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mr-2">
                        <Button variant="outlined" onClick={onClose}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            className="ml-3"
                            onClick={() => setTriggleSubmit(true)}
                            loading={isLoading}
                        >
                            {t("submit")}
                        </LoadingButton>
                    </div>
                </div>
                <div className="overflow-auto pb-[50px]">
                    <AddTruckForm triggleSubmit={triggleSubmit} fleets={fleets} />
                </div>
            </div>
        </>
    );
};

export default AddTruckForm1;
