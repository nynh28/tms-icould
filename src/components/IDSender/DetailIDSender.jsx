
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
import { useAddIDSenderMutation, useUpdateIDSenderMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addIDSender } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
// import { fetchIDSenderDetail } from "../../api";

const DetailIDSender = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateIDSender, { isLoading }] = useUpdateIDSenderMutation();

    useEffect(() => {
        // if(selectedIDSenderEdit){
        //     console.log(selectedIDSenderEdit)
        //     const response = fetchIDSenderDetail(selectedIDSenderEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(IDSender)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idSender")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSender}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("description")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.description}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("district")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.district}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("lane")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lane}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("lat")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lat}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("other")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.other}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("postalCode")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.postalCode}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("province")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.province}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("road")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.road}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.senderName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderNumber")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.senderNumber}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("subDistrict")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.subDistrict}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("villageNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.villageNo}</p>
            </div>

        </>
    );
};

export default DetailIDSender;
