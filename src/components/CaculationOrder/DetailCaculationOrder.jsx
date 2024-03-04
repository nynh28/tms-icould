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
import { useAddCaculationOrderMutation, useUpdateCaculationOrderMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addCaculationOrder } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
// import { fetchCaculationOrderDetail } from "../../api";

const DetailCaculationOrder = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateCaculationOrder, { isLoading }] = useUpdateCaculationOrderMutation();

    useEffect(() => {
        // if(selectedCaculationOrderEdit){
        //     console.log(selectedCaculationOrderEdit)
        //     const response = fetchCaculationOrderDetail(selectedCaculationOrderEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(CaculationOrder)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
        <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("name")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.name}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("description")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.description}</p>
            </div>
            
           
        </>
    );
};

export default DetailCaculationOrder;
