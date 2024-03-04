
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
    useAddDriverMutation,
    useUpdateDriverMutation
} from "../../services/apiSlice";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomTextField from "../FormField/CustomTextField";
import Tooltip from "@mui/material/Tooltip";

const FormDriver = ({ selectedItem, triggleSubmit, setTriggleSubmit, submitError, refetch, setOpenForm }) => {
    const { t } = useTranslation();
    const [updateForm, { isLoading: isLoading1 }] = useUpdateDriverMutation();
    const [addForm, { isLoading: isLoading2 }] = useAddDriverMutation();



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
        "id": "",
        "userName": "",
        "phoneNumber": "",
        "email": "",
        "drivingLicenceNumber": "",
        "address": "",
        "insuranceExpirationDate": "",
        "fullName": "",
    }

    // Validation
    const schema = yup.object().shape({
        userName: yup
            .string()
            .required(t("message.validation.required", { field: t("userName") })),
        fullName: yup
            .string()
            .required(t("message.validation.required", { field: t("fullName") })),
        email: yup
            .string()
            .required(t("message.validation.required", { field: t("email") })),
        phoneNumber: yup
            .string()
            .required(t("message.validation.required", { field: t("phoneNumber") })),
        drivingLicenceNumber: yup
            .string()
            .required(t("message.validation.required", { field: t("drivingLicenceNumber") })),
        address: yup
            .string()
            .required(t("message.validation.required", { field: t("address") })),
        insuranceExpirationDate: yup
            .string()
            .required(t("message.validation.required", { field: t("insuranceExpirationDate") })),

    });

    useEffect(_ => {
        // console.log('triggle')
        if(triggleSubmit == true){
            handleSubmit(onSubmit)()
            setTimeout(_ => {
                if(Object.keys(errors).length > 0){
                    submitError()
                }
            }, 100) 
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

    const onSubmit = async (data) => {

        const transformData = {
            ...data,

        };

        // console.log(transformData)
        try {
            if (transformData.id) {
                await updateForm(transformData).unwrap();
                toast.success(
                    t("message.success.update", {
                        field: t("Driver"),
                    })
                );
            } else {
                await addForm(transformData).unwrap();
                toast.success(
                    t("message.success.add", {
                        field: t("Driver"),
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
                                    {t("addTitle", { field: t("Driver") })}
                                </h2>
                                <div className="mt-1">
                                    <p className="text-sm text-light">
                                        {t("addSubtitle", { field: t("Driver") })}
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
                                            name="userName"
                                            label="userName"
                                            control={control}
                                            errors={errors.userName}
                                            required
                                        />

                                        <CustomTextField
                                            name="fullName"
                                            label="fullName"
                                            control={control}
                                            errors={errors.fullName}
                                            required
                                        />

                                        <CustomTextField
                                            name="email"
                                            label="email"
                                            control={control}
                                            errors={errors.email}
                                            required
                                        />

                                        <CustomTextField
                                            name="phoneNumber"
                                            label="phoneNumber"
                                            control={control}
                                            errors={errors.phoneNumber}
                                            required
                                        />

                                        <CustomTextField
                                            name="drivingLicenceNumber"
                                            label="drivingLicenceNumber"
                                            control={control}
                                            errors={errors.drivingLicenceNumber}
                                            required
                                        />
                                        <CustomTextField
                                            name="insuranceExpirationDate"
                                            label="insuranceExpirationDate"
                                            control={control}
                                            errors={errors.insuranceExpirationDate}
                                            required
                                        />

                                        <CustomTextField
                                            name="address"
                                            label="address"
                                            control={control}
                                            errors={errors.address}
                                            required
                                        />

                                        

                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* <Transition.Root show={openForm} as={Fragment}>
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
                        {t("updateTitle", { field: t("Driver") })}
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
                        {t("addSubtitle", { field: t("Driver") })}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6 h-full border-r">
                      <div className="space-y-4 pt-6 pb-5">
                       
                        <CustomTextField
                          name="meaning"
                          label="meaning"
                          control={control}
                          errors={errors.meaning}
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
      </Transition.Root> */}
        </>
    );
};

export default FormDriver;
