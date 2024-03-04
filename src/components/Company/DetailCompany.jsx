
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
import { useAddCompanyMutation, useUpdateRttCompanyMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addCompany } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
// import { fetchCompanyDetail } from "../../api";

const DetailCompany = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateCompany, { isLoading }] = useUpdateRttCompanyMutation();

    useEffect(() => {
        // if(selectedCompanyEdit){
        //     console.log(selectedCompanyEdit)
        //     const response = fetchCompanyDetail(selectedCompanyEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(Company)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idCompany")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idCompany}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("thaiName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.thaiName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("engName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.engName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("telephoneNumber")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.telephoneNumber}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("faxNumber")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.faxNumber}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("numbers")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.numbers}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("villageNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.villageNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("lane")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lane}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("other")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.other}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("road")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.road}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("subDistrict")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.subDistrict}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("district")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.district}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("province")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.province}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("postalCode")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.postalCode}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("lat")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lat}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("lng")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lng}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idAreaMaster")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idAreaMaster}</p>
            </div>
           
        </>
    );
};

export default DetailCompany;
