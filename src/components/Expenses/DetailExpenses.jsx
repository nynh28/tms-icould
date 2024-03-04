
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useAddTruckMutation, useUpdateTruckMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addTruck } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
import { fetchTruckDetail } from "../../api";

const DetailExpenses = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    // const { masterDatas } = useSelector((state) => state.masterDatas);
    // const [updateTruck, { isLoading }] = useUpdateTruckMutation();

    useEffect(() => {
        // if(selectedTruckEdit){
        //     console.log(selectedTruckEdit)
        //     const response = fetchTruckDetail(selectedTruckEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(truck)
    }, [detailRow])

    const types = {1: "Fuel", 2: "Toll Fee", 3: "traffic fines", 4: "Rental"}




    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Shiment ID")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.shipmentId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Expense Type")}</label>
                <p className="text-[16px] leading-[1.2]">{types[detailRow?.expenseType]}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Total Liter")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.totalLiter}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Total Money")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.totalMoney}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Detail")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.details}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Note")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.note}</p>
            </div>
        </>
    );
};

export default DetailExpenses;
