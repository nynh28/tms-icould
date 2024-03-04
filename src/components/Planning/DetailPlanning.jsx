
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

const DetailPlanning = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [updateTruck, { isLoading }] = useUpdateTruckMutation();

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
        // console.log(detailRow)
    }, [detailRow])

    const getStatusColor = (status) => {
        let color = ''
        let text = ''
        switch(status){
            case 1: 
                // color = 'bg-primary-100'
                text = 'Not Started'
                break
            case 2: 
                // color = 'bg-primary-100'
                text = 'Checkin start'
                break
            case 3: 
                // color = 'bg-primary-100'
                text = 'Checkin finish'
                break
            case 4: 
                // color = 'bg-primary-100'
                text = 'Loading start'
                break
            case 5: 
                // color = 'bg-primary-100'
                text = 'Loading finish'
                break
            case 6: 
                // color = 'bg-primary-100'
                text = 'Loading complete start'
                break
            case 7: 
                color = 'bg-primary-100'
                text = 'Loading complete finish'
                break
            case 8:
                color = 'bg-[#00b11f]'
                text = 'Delivery finish'
                break;
            case 9: 
                color= 'bg-red-100';
                text = 'Delivery Reject'
                break;
            default: 
                break
        }
        return {color, text}
    }



    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("companyId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.companyId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.senderName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("branchId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.branchId}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("#No")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.index}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("-")}</label>
                <p className="text-[16px] leading-[1.2]">-</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupPoint")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupPoint}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupTime")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupTime}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupNote")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupNote}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentType")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentType}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentType1")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentType1}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentType2")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentType2}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Status")}</label>
                <p className="text-[16px] leading-[1.2]">{getStatusColor(detailRow?.status).text}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryStatus")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryStatus}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryType")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryType}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryType1")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryType1}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryType2")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryType2}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("calculationOrder")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.calculationOrder}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("invoiceNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.invoiceNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("saleOrderNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.saleOrderNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.senderId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("Pickup LatLong")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupLatitude}, {detailRow?.pickupLongtitude} </p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentNo}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentType1")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentType1}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("documentType2")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.documentType2}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("referenceNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.referenceNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("invoiceDate")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.invoiceDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("shipTo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.shipTo}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("productNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.productNo}</p>
            </div> */}
        
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("receiverName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.receiverName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("receiverPhone")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.receiverPhone}</p>
            </div>
            
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryId}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryPoint")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryPoint}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("areaMasterId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.areaMasterId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("dueDate")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.dueDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("productNo")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.productNo}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">SS</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.ss}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">S</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.s}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">M</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.m}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">L</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.l}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">XL</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.xl}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">2xL</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.xxl}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">3xL</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.xxxl}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">4xL</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.xxxxl}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">5xL</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.xxxxxl}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Product Size (ขนาดสินค้าผู้ว่าจ้าง เป็นคนกำหนด ( SS - XXXXXL ) ซึ่งห้ามเปลี่ยน)</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.productSize}</p>
            </div>
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("unit")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.unit}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryNote")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryNote}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingBox")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingBox}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingPiece")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingPiece}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("unit")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.unit}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("typeOfGood")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.typeOfGood}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingWeight")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingWeight}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingLiter")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingLiter}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingCbm")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingCbm}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("loadingTarget")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingTarget}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryNote")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryNote}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("cod")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.cod}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("areaShipment")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.areaShipment}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupLatitude")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupLatitude}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("pickupLongtitude")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.pickupLongtitude}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryLatitude")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryLatitude}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("deliveryLongtitude")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.deliveryLatitude}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("senderPhone")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.senderPhone}</p>
            </div>
        </>
        
    );
};

export default DetailPlanning;
