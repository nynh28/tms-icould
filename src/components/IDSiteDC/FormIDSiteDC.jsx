
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
    useAddIDSiteDCMutation,
    useUpdateIDSiteDCMutation
} from "../../services/apiSlice";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomTextField from "../FormField/CustomTextField";
import Tooltip from "@mui/material/Tooltip";

const FormIDSiteDC = ({ selectedItem, openForm, setOpenForm, refetch }) => {
    const { t } = useTranslation();
    const [updateForm, { isLoading: isLoading1 }] = useUpdateIDSiteDCMutation();
    const [addForm, { isLoading: isLoading2 }] = useAddIDSiteDCMutation();

    useEffect(() => {
        if(selectedItem && selectedItem.id){
        //     console.log(selectedItem)
        //     const response = fetchStaffDetail(selectedItem.id)
        //     response.then(i => {
        //         console.log(i.data)
        //         reset(i.data)
        //     })
            reset(selectedItem)
        }
        // reset()
    }, [selectedItem])

    // Validation
    const schema = yup.object().shape({
        name: yup
            .string()
            .required(t("message.validation.required", { field: t("name") })),
        lat: yup
            .string()
            .required(t("message.validation.required", { field: t("lat") })),
        lng: yup
            .string()
            .required(t("message.validation.required", { field: t("lng") })),

    });

    const defaultValues= {
        "name": "",
        "id": "",
        "lat": 0,
        "lng": 0
    }

    const {
        control,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const onSubmit = async (data) => {

        const transformData = {
            ...data,
            lat: Number(data.lat),
            lng: Number(data.lng),
        };

        console.log(transformData)
        try {
            if (transformData.id) {
                await updateForm(transformData).unwrap();
                toast.success(
                    t("message.success.update", {
                        field: t("idSiteDC"),
                    })
                );
            } else {
                await addForm(transformData).unwrap();
                toast.success(
                    t("message.success.add", {
                        field: t("idSiteDC"),
                    })
                );
            }
            reset(defaultValues);
            refetch();
            setOpenForm(false);
        } catch (error) {
            if (error.data.status === 400) {
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

            <Transition.Root show={openForm} as={Fragment}>
                <div className="pointer-events-none fixed inset-y-0 right-0 z-20 flex max-w-full overflow-hidden pl-10">
                    <Transition.Child
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <div className="pointer-events-auto w-screen max-w-lg">
                            <form
                                noValidate
                                className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                                    <div className="bg-primary-700 py-6 px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-lg font-medium capitalize text-white">
                                                {t("updateTitle", { field: t("idSiteDC") })}
                                            </h2>
                                            <div className="ml-3 flex h-7 items-center justify-center gap-4">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-primary-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                    onClick={onClose}
                                                >
                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-sm text-primary-300">
                                                {t("addSubtitle", { field: t("idSiteDC") })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="divide-y divide-gray-200 px-4 sm:px-6 h-full border-r">
                                            <div className="space-y-4 pt-6 pb-5">

                                                <CustomTextField
                                                    name="name"
                                                    label="name"
                                                    control={control}
                                                    errors={errors.name}
                                                    required
                                                />

                                                <CustomNumberField
                                                    name="lat"
                                                    label="lat"
                                                    control={control}
                                                    thousandSeparator={false}
                                                    errors={errors.lat}
                                                    required
                                                />
                                                <CustomNumberField
                                                    name="lng"
                                                    label="lng"
                                                    thousandSeparator={false}
                                                    control={control}
                                                    errors={errors.lng}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-shrink-0 justify-end gap-4 px-4 py-4">
                                    <Button variant="outlined" onClick={onClose}>
                                        {t("cancel")}
                                    </Button>
                                    <LoadingButton
                                        type="submit"
                                        variant="contained"
                                        loading={isLoading1 || isLoading2}
                                    >
                                        {t("submit")}
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Transition.Root>
        </>
    );
};

export default FormIDSiteDC;
