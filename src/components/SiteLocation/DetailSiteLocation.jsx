

import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const DetailSiteLocation = ({ detailRow }) => {
    const { t } = useTranslation();
    //   const [openEdit, setOpenEdit] = useState(false);

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
            {/* <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Delivery ID</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idTypeDetailSiteLocation}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Site/DC Name</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.siteName}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">ID:Site/DC</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.idSite}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Lat</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lat}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Long</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.lng}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Radius</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.radius}</p>
            </div>
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">Description</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.description}</p>
            </div>
           
        </>
    );
};

export default DetailSiteLocation;
