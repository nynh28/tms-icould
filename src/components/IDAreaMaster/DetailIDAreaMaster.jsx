
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
import { useAddIDAreaMasterMutation, useUpdateIDAreaMasterMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addIDAreaMaster } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
// import { fetchIDAreaMasterDetail } from "../../api";

const DetailIDAreaMaster = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateIDAreaMaster, { isLoading }] = useUpdateIDAreaMasterMutation();

    useEffect(() => {
        // if(selectedIDAreaMasterEdit){
        //     console.log(selectedIDAreaMasterEdit)
        //     const response = fetchIDAreaMasterDetail(selectedIDAreaMasterEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(IDAreaMaster)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idAreaMaster")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idAreaMaster}</p>
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
                <label className="text-[13px] font-normal text-[#5f6368]">{t("provinceCompany")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.provinceCompany}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idVillage")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idVillage}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idSubDistrict")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSubDistrict}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idDistrict")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idDistrict}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idProvince")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idProvince}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idSpecialArea")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSpecialArea}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idTems")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idTems}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idSite")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSite}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("siteName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.siteName}</p>
            </div>
           
        </>
    );
};

export default DetailIDAreaMaster;
