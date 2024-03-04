
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

const DetailTruck = ({ detailRow }) => {
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
    }, [detailRow])





    const onClose = () => {
        // setOpenEdit(false);
        // clearErrors();
        // reset();
    };

    return (
        <>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("truckId")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.truckId}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("categoryCar")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.categoryCar}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("vehicleType")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.carCharactersName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("plateLicense")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.plateLicense}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('siteDcName')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.siteDcName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('country')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.country}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('brand')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.brand}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('color')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.color}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('cc')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.cc}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('dateOfPossession')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.dateOfPossession}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('fuelConsumption')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.fuelConsumption}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('horsepower')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.horsepower}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('insuranceCompany')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.insuranceCompany}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('insuranceStartDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.insuranceStartDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('insuranceType')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.insuranceType}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('loadingHeight')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingHeight}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('loadingLength')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingLength}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('loadingWeight')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingWeight}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('loadingWidth')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingWidth}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('model')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.model}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('otherDetails')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.otherDetails}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('piston')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.piston}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('registeredType')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.registeredType}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('registrationCertificateExpirationDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.registrationCertificateExpirationDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('registrationCertificateInsurance')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.registrationCertificateInsurance}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('registrationCertificateStartDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.registrationCertificateStartDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('registrationDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.registrationDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('seats')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.seats}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('shaft')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.shaft}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('tankSize')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.tankSize}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('taxExpirationDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.taxExpirationDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('taxStartDate')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.taxStartDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('totalWeight')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.totalWeight}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('vehicleEngineNumber')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.vehicleEngineNumber}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('vehicleEngineNumberPosition')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.vehicleEngineNumberPosition}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('vehicleIdentificationNumber')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.vehicleIdentificationNumber}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('vehicleIdentificationNumberPosition')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.vehicleIdentificationNumberPosition}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('vehicleWeight')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.vehicleWeight}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t('volume')}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.volume}</p>
            </div>
            
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Tank size</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.tankSize}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Full Name</label>
                <p className="text-[16px] leading-[1.2]">นาย วีรพงค์ กองตา</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Name Titles</label>
                <p className="text-[16px] leading-[1.2]">นาย</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">first name</label>
                <p className="text-[16px] leading-[1.2]">วีรพงค์</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Last name</label>
                <p className="text-[16px] leading-[1.2]">กองตา</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">province</label>
                <p className="text-[16px] leading-[1.2]">สมุทรปราการ</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">district</label>
                <p className="text-[16px] leading-[1.2]">สมุทรปราการ</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Subdistrict</label>
                <p className="text-[16px] leading-[1.2]">สมุทรปราการ</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">running number</label>
                <p className="text-[16px] leading-[1.2]">3</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Job</label>
                <p className="text-[16px] leading-[1.2]">CLERKER</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Employee ID</label>
                <p className="text-[16px] leading-[1.2]">101236</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Name Titles_20</label>
                <p className="text-[16px] leading-[1.2]">นาย</p>
            </div> */}
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">first name_21</label>
                <p className="text-[16px] leading-[1.2]">CLERKER</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Insurance Start Date</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.insuranceStartDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Plate License</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.plateLicense}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Expiration Date</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.insuranceExpirationDate}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Loading Weight</label>
                <p className="text-[16px] leading-[1.2]">{detailRow?.loadingWeight}</p>
            </div>

        </>
    );
};

export default DetailTruck;
