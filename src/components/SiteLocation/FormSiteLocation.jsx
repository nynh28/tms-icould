
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import * as yup from "yup";
import {
    useUpdateIDSiteDCMutation,
    useAddIDSiteDCMutation
} from "../../services/apiSlice";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomTextField from "../FormField/CustomTextField";
import Tooltip from "@mui/material/Tooltip";

const FormSiteLocation = ({ selectedItem, triggleSubmit, setTriggleSubmit, submitError, refetch, setOpenForm }) => {
    const { t } = useTranslation();
    const [updateForm, { isLoading: isLoading1 }] = useUpdateIDSiteDCMutation();
    const [addForm, { isLoading: isLoading2 }] = useAddIDSiteDCMutation();


    useEffect(() => {
        if (selectedItem && selectedItem.id) {
            //     console.log(selectedItem)
            //     const response = fetchStaffDetail(selectedItem.id)
            //     response.then(i => {
            //         console.log(i.data)
            //         reset(i.data)
            //     })
            reset(selectedItem)
        } else {
            reset(defaultValues)
        }
    }, [selectedItem])

    const defaultValues = {
        "idSite": "",
        "id": "",
        "siteName": "",
        "lat": "",
        "lng": "",
        "radius": "",
        "description": "",

    }

    // Validation
    const schema = yup.object().shape({
        idSite: yup
            .string()
            .required(t("message.validation.required", { field: t("idSite") })),
        siteName: yup
            .string()
            .required(t("message.validation.required", { field: t("siteName") })),
        lat: yup
            .string()
            .required(t("message.validation.required", { field: t("lat") })),
        lng: yup
            .string()
            .required(t("message.validation.required", { field: t("lng") })),
        radius: yup
            .string()
            .required(t("message.validation.required", { field: t("radius") })),

    });

    useEffect(_ => {
        // console.log('triggle')
        if(triggleSubmit == true){
            handleSubmit(onSubmit)()
        }
    }, [triggleSubmit])

 


    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    useEffect(_ => {
        if(errors && Object.keys(errors).length > 0){
            setTriggleSubmit(false)
        }
    }, [errors])

    const onSubmit = async (data) => {
        const transformData = {
            ...data,

        };
        try {
            if (transformData.id) {
                await updateForm(transformData).unwrap();
                toast.success(
                    t("message.success.update", {
                        field: t("SiteLocation"),
                    })
                );
            } else {
                await addForm(transformData).unwrap();
                toast.success(
                    t("message.success.add", {
                        field: t("SiteLocation"),
                    })
                );
            }
            setTriggleSubmit(false)
            reset(defaultValues);
            refetch();
            setOpenForm(false);
        } catch (error) {
            setTriggleSubmit(false)
            if (error?.data?.status === 400) {
                toast.error('Error');
                // toast.error(error.data.validMsgList?.plateLicence[0]);
            }
        }
    };

    const onClose = () => {
        setOpenForm(false);
        clearErrors();
        reset(defaultValues);
    };

    return (
        <>
            <div className="flex h-full flex-col">
                {!selectedItem?.id && (
                    <div className="flex py-6 px-2 justify-between items-top border-b">
                        <div className="flex">
                            <div className="flex h-7 items-center justify-center gap-4">
                                <button
                                    type="button"
                                    className="bg-transparent hover:bg-[#999] text-[#3d3b3b] p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={onClose}
                                >
                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="flex flex-col ml-3 items-start">
                                <h2 className="text-lg font-medium capitalize ">
                                    {t("addTitle", { field: t("SiteLocation") })}
                                </h2>
                                <div className="mt-1">
                                    <p className="text-sm text-light">
                                        {t("addSubtitle", { field: t("SiteLocation") })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mr-2">
                            <Button variant="outlined" onClick={onClose}>
                                {t("cancel")}
                            </Button>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                className="ml-3"
                                onClick={() => handleSubmit(onSubmit)()}
                                loading={isLoading2}
                            >
                                {t("submit")}
                            </LoadingButton>
                        </div>
                    </div>
                ) }
                <div className="overflow-auto pb-[50px]">
                    <form
                        noValidate
                        className="flex h-full flex-col"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="flex min-h-0 flex-1 flex-col">
                            
                            <div className="relative flex">
                                <div className="px-4 sm:px-6 w-full h-full">
                                    <div className="space-y-6 pt-6 pb-5">
                                        <CustomTextField
                                            name="idSite"
                                            label="idSite"
                                            control={control}
                                            errors={errors.idSite}
                                            required
                                        />
                                        <CustomTextField
                                            name="siteName"
                                            label="siteName"
                                            control={control}
                                            errors={errors.siteName}
                                            required
                                        />
                                        <CustomTextField
                                            name="lat"
                                            label="lat"
                                            control={control}
                                            errors={errors.lat}
                                            required
                                        />
                                        <CustomTextField
                                            name="lng"
                                            label="lng"
                                            control={control}
                                            errors={errors.lng}
                                            required
                                        />
                                        <CustomTextField
                                            name="radius"
                                            label="radius"
                                            control={control}
                                            errors={errors.radius}
                                            required
                                        />
                                        <CustomTextField
                                            name="description"
                                            label="description"
                                            control={control}
                                            errors={errors.description}
                                            required
                                        />


                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FormSiteLocation;
