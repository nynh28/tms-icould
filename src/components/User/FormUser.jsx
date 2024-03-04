
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
    useAddUserMutation,
    useUpdateUserMutation
} from "../../services/apiSlice";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomTextField from "../FormField/CustomTextField";
import CustomSelect from "../FormField/CustomSelect";
import Tooltip from "@mui/material/Tooltip";
import { useSelector } from "react-redux";

const FormUser = ({ selectedItem, triggleSubmit, setTriggleSubmit, submitError, refetch, setOpenForm, listRole }) => {
    const { t } = useTranslation();
    const [updateForm, { isLoading: isLoading1 }] = useUpdateUserMutation();
    const [addForm, { isLoading: isLoading2 }] = useAddUserMutation();

    const siteLocation = useSelector(state => state.mapLocation)


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
        "userName": "",
        "id": "",
        "phone": "",
        "email": "",
        "fullName": "",
        "avatar": "",
        "isActive": true,
        "isLocked": false,
        "roleId": "",
        // "userId": "",
        "branchId": "",
        "branchIdString": "",
    }

    // Validation
    const schema = yup.object().shape({
        userName: yup
            .string()
            .required(t("message.validation.required", { field: t("userName") })),
        roleId: yup
            .string()
            .required(t("message.validation.required", { field: t("roleId") })),
        fullName: yup
            .string()
            .required(t("message.validation.required", { field: t("fullName") })),
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
            roleId: +data.roleId
        };

        try {
            if (transformData.id) {
                await updateForm(transformData).unwrap();
                toast.success(
                    t("message.success.update", {
                        field: t("User"),
                    })
                );
            } else {
                await addForm(transformData).unwrap();
                toast.success(
                    t("message.success.add", {
                        field: t("User"),
                    })
                );
            }
            setTriggleSubmit(false)
            reset(defaultValues);
            refetch();
            setOpenForm(false);
        } catch (error) {
            setTriggleSubmit(false)
            toast.error('Error');
            if (error?.data?.status === 400) {
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
                                    {t("addTitle", { field: t("User") })}
                                </h2>
                                <div className="mt-1">
                                    <p className="text-sm text-light">
                                        {t("addSubtitle", { field: t("User") })}
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
                                            disabled={selectedItem?.id ? true : false}
                                            required
                                        />
                                        <CustomTextField
                                            name="fullName"
                                            label="fullName"
                                            control={control}
                                            errors={errors.fullName}
                                            required
                                        />
                                        <CustomSelect
                                            name="roleId"
                                            label="Role"
                                            control={control}
                                            
                                            // errors={errors.truckType}
                                            options={(listRole?.content || []).map((x) => {
                                                return { id: x.id, value: x.roleName};
                                            })}
                                            errors={errors.roleId}
                                            // options={truckTypeList?.content || []}
                                            // required
                                        />
                                        <CustomSelect
                                            name="branchIdString"
                                            label="Site ID"
                                            control={control}
                                            
                                            // errors={errors.truckType}
                                            options={(siteLocation?.listSiteLocation || []).map((x) => {
                                                return { id: x.idSite, value: `${x.siteName} (${x.idSite})` };
                                            })}
                                            errors={errors.branchId}
                                            // options={truckTypeList?.content || []}
                                            // required
                                        />
                                        <CustomTextField
                                            name="phone"
                                            label="phone"
                                            control={control}
                                            errors={errors.phone}
                                            disabled={selectedItem?.id && selectedItem.phone ? true : false}
                                        />
                                        <CustomTextField
                                            name="email"
                                            label="email"
                                            control={control}
                                            errors={errors.email}
                                            disabled={selectedItem?.id && selectedItem.email ? true : false}
                                        />
                                        
                                        {/* <CustomTextField
                                            name="avatar"
                                            label="avatar"
                                            control={control}
                                            errors={errors.avatar}
                                        /> */}
                                        <CustomSelect
                                            name="isActive"
                                            label="Status"
                                            control={control}
                                            // errors={errors.isActive}
                                            options={[
                                                { id: true, value: t("Active") },
                                                { id: false, value: t("Inactive") },
                                              ]}
                                        />
                                        {
                                            selectedItem?.id &&
                                            <CustomSelect
                                                name="isLocked"
                                                label="isLocked"
                                                control={control}
                                                // errors={errors.isLocked}
                                                options={[
                                                    { id: true, value: t("Locked") },
                                                    { id: false, value: t("Normal") },
                                                ]}
                                            />
                                        }
                                        {/* <CustomTextField
                                            name="branchIdString"
                                            label="branchId"
                                            control={control}
                                            errors={errors.branchIdString}
                                            disabled={selectedItem?.id}
                                        /> */}


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

export default FormUser;
