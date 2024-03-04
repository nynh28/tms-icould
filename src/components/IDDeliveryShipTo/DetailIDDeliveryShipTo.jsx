
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
import { useAddIDDeliveryShipToMutation, useUpdateIDDeliveryShipToMutation } from "../../services/apiSlice";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
// import { addIDDeliveryShipTo } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import { AiFillEdit } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
// import { fetchIDDeliveryShipToDetail } from "../../api";

const DetailIDDeliveryShipTo = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateIDDeliveryShipTo, { isLoading }] = useUpdateIDDeliveryShipToMutation();

    useEffect(() => {
        // if(selectedIDDeliveryShipToEdit){
        //     console.log(selectedIDDeliveryShipToEdit)
        //     const response = fetchIDDeliveryShipToDetail(selectedIDDeliveryShipToEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(IDDeliveryShipTo)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.deliveryId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("alley")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.alley}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("carType")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.carType}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("villadayOffgeNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.villadayOffgeNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryDate")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.deliveryDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("district")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.district}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("forkliftCost")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.forkliftCost}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("handJackCost")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.handJackCost}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idMaster")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idMaster}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idSender")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSender}</p>
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
                <label className="text-[13px] font-normal text-[#5f6368]">{t("note")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.note}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("number")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.number}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("other")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.other}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("palletCost")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.palletCost}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("parkingFee")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.parkingFee}</p>
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
                <label className="text-[13px] font-normal text-[#5f6368]">{t("receiverName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.receiverName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("receiverThaiName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.receiverThaiName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("road")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.road}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("note")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.note}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.senderName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("shippingCost")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.shippingCost}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("subDistrict")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.subDistrict}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("nottelephoneNumberOnee")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.nottelephoneNumberOnee}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("telephoneNumberTwo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.telephoneNumberTwo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("timeToArrive")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.timeToArrive}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("timeToLeave")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.timeToLeave}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("timeToUnloadGoods")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.timeToUnloadGoods}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("villageNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.villageNo}</p>
            </div>

        </>
    );
};

export default DetailIDDeliveryShipTo;
