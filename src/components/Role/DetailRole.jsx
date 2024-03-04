

import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


const DetailRole = ({ detailRow }) => {
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
                <p className="text-[16px] leading-[1.2]">{detailRow.idTypeDetailRole}</p>
            </div> */}
            <div className="mb-4">
                <label className="text-[13px] font-normal text-[#5f6368]">{t("roleName")}</label>
                <p className="text-[16px] leading-[1.2]">{detailRow.roleName}</p>
            </div>
        </>
    );
};

export default DetailRole;
