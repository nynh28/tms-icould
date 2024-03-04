
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { AiFillEdit } from "react-icons/ai";
// import { fetchIDPickupDetail } from "../../api";

const DetailIDPickup = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        // if(selectedIDPickupEdit){
        //     console.log(selectedIDPickupEdit)
        //     const response = fetchIDPickupDetail(selectedIDPickupEdit.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
        // }
        // reset(IDPickup)
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("idPickup")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idPickup}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("siteName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.siteName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupNumber")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.pickupNumber}</p>
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

export default DetailIDPickup;
