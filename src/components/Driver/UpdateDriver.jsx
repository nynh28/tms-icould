import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// import { addDriver } from "../../api";
import CustomTextField from "../FormField/CustomTextField";
import CustomDateTimeField from "../FormField/CustomDateTimeField";
import CustomDateField from "../FormField/CustomDateField";
import CustomSelect from "../FormField/CustomSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useGetFleetCarriersQuery,
  useAddDriverMutation,
  useUpdateDriverMutation,
} from "../../services/apiSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { fetchDriverDetail, uploadImage } from "../../api";

const UpdateDriver = ({ formData, openUpdate, setOpenUpdate, refetch }) => {
  const { t } = useTranslation();
  const [criterias, setCriterias] = useState({
    page: 0,
    rowsPerPage: 10,
    groupId: "",
  });
  const { data } = useGetFleetCarriersQuery(criterias);
  const [updateDriver, { isLoading }] = useUpdateDriverMutation();
  //   const [updateDriver, { isLoading }] = useUpdateDriverMutation();


  useEffect(() => {
    // reset(formData)
    if (formData) {
      const response = fetchDriverDetail(formData.id)
      response.then(i => {
        console.log(i.data)
        reset(i.data)
      })
    }
  }, [formData])


  useEffect(() => {

  })

  // Validation
  const schema = yup.object().shape({
    groupId: yup
      .string()
      .required(t("message.validation.required", { field: t("branchName") })),
    fullName: yup
      .string()
      .required(t("message.validation.required", { field: t("fullName") })),
    userName: yup
      .string()
      .required(t("message.validation.required", { field: t("userName") })),
    phoneNumber: yup
      .string()
      .required(t("message.validation.required", { field: t("phone") })),
    email: yup
      .string()
      .required(t("message.validation.required", { field: t("email") })),
    address: yup
      .string()
      .required(t("message.validation.required", { field: t("address") })),
    drivingLicence: yup
      .string()
      .required(
        t("message.validation.required", { field: t("drivingLicense") })
      ),
    drivingLicenceNumber: yup
      .string()
      .required(
        t("message.validation.required", { field: t("drivingLicense") })
      ),
  });

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      userName: "",
      phoneNumber: "",
      email: "",
      address: '',
      drivingLicenceNumber: '',
      drivingLicenceExpirationDate: '',
      drivingLicenceClass: '',
      drivingLicence: '',
      avatar: '',
      groupId: '',
      dateOfBirth: "",
      lastMedicalTest: "",
      drivingLicenseValidityTo: "",
      roadSignalizationTestDate: "",
      driverHandbook: "",
      defensiveDrivingTheoryDate: "",
      defensiveDrivingPracticalDate: "",
      productsBasicKnowledgeTraining: "",
      safeToLoadCheckDate: "",
      loadingOperationTrainingDate: "",
      deliveriesTrainingDate: "",
      alertProcedureTrainingDate: "",
      firefightingTrainingDate: "",
      firstAidTrainingDate: "",
      othersTrainingDate: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateDriver(data).unwrap();
      toast.success(t("message.success.update", { field: t("driver") }));
      refetch();
      reset();
      setOpen(false);
    } catch (error) {
      if (error?.data?.validMsgList?.userName) {
        toast.error(error?.data?.validMsgList?.userName?.[0]);
      }
      else {
        toast.error("Something went wrong. Please try again!");
      }
    }
    console.log(data);
  };

  const onClose = () => {
    setOpenUpdate(false);
    clearErrors();
    reset();
  };

  // Upload ảnh
  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append("file", file);

    try {
      const response = await uploadImage(fd);
      return response.data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>

      <Transition.Root show={openUpdate} as={Fragment}>
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
            <div className="pointer-events-auto w-screen max-w-4xl">
              <form
                noValidate
                className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  <div className="bg-primary-700 py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium capitalize text-white">
                        {t("updateTitle", { field: t("driver") })}
                      </h2>
                      <div className="ml-3 flex h-7 items-center justify-center gap-4">
                        <button
                          type="button"
                          className="rounded-md bg-primary-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpenUpdate(false)}
                        >
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-primary-300">
                        {t("updateSubtitle", { field: t("driver") })}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6 w-1/2 border-r">
                      <div className="space-y-6 pt-6 pb-5">
                        <CustomTextField
                          name="fullName"
                          label="fullName"
                          control={control}
                          errors={errors.fullName}
                          required
                        />
                        <CustomTextField
                          name="userName"
                          label="userName"
                          control={control}
                          errors={errors.userName}
                          required
                        />
                        <CustomTextField
                          name="phoneNumber"
                          label="phone"
                          control={control}
                          errors={errors.phoneNumber}
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
                          name="address"
                          label="address"
                          control={control}
                          errors={errors.address}
                          required
                        />
                        <CustomTextField
                          name="drivingLicenceNumber"
                          label="drivingLicense"
                          control={control}
                          errors={errors.drivingLicenceNumber}
                          required
                        />
                        <div>
                          <Controller
                            name="drivingLicence"
                            control={control}
                            render={({ field }) => (
                              <input
                                type="file"
                                className="block w-full cursor-pointer appearance-none overflow-hidden rounded-md border border-gray-200 bg-white p-2"
                                onChange={async (e) => {
                                  const image = await handleUpload(
                                    e.target.files[0]
                                  );
                                  field.onChange(image.fileName);
                                }}
                              />
                            )}
                          />
                          {errors && errors?.drivingLicence && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors?.drivingLicence?.message}
                            </p>
                          )}
                        </div>
                        <CustomSelect
                          name="groupId"
                          label="branchName"
                          control={control}
                          errors={errors.groupId}
                          options={data?.content?.map((x) => {
                            return { id: x.groupId, value: x.groupName };
                          })}
                          required
                        />
                        <CustomDateField
                          name="dateOfBirth"
                          label="dateOfBirth"
                          control={control}
                          errors={errors.dateOfBirth}
                        />
                        <CustomTextField
                          name="ageOfDrive"
                          label="ageOfDrive"
                          control={control}
                          errors={errors.ageOfDrive}
                        />
                        <CustomDateField
                          name="lastMedicalTest"
                          label="lastMedicalTest"
                          control={control}
                          errors={errors.lastMedicalTest}
                        />
                        <CustomDateField
                          name="drivingLicenseValidityTo"
                          label="drivingLicenseValidityTo"
                          control={control}
                          errors={errors.drivingLicenseValidityTo}
                        />

                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 px-4 sm:px-6 w-1/2">
                      <div className="space-y-6 pt-6 pb-5">
                        <CustomDateField
                          name="roadSignalizationTestDate"
                          label="roadSignalizationTestDate"
                          control={control}
                          errors={errors.roadSignalizationTestDate}
                        />
                        <CustomTextField
                          name="driverHandbook"
                          label="driverHandbook"
                          control={control}
                          errors={errors.driverHandbook}
                        />
                        <CustomDateField
                          name="defensiveDrivingTheoryDate"
                          label="defensiveDrivingTheoryDate"
                          control={control}
                          errors={errors.defensiveDrivingTheoryDate}
                        />
                        <CustomDateField
                          name="defensiveDrivingPracticalDate"
                          label="defensiveDrivingPracticalDate"
                          control={control}
                          errors={errors.defensiveDrivingPracticalDate}
                        />
                        <CustomTextField
                          name="productsBasicKnowledgeTraining"
                          label="productsBasicKnowledgeTraining"
                          control={control}
                          errors={errors.productsBasicKnowledgeTraining}
                        />
                        <CustomDateField
                          name="safeToLoadCheckDate"
                          label="safeToLoadCheckDate"
                          control={control}
                          errors={errors.safeToLoadCheckDate}
                        />
                        <CustomDateField
                          name="loadingOperationTrainingDate"
                          label="loadingOperationTrainingDate"
                          control={control}
                          errors={errors.loadingOperationTrainingDate}
                        />
                        <CustomDateField
                          name="deliveriesTrainingDate"
                          label="deliveriesTrainingDate"
                          control={control}
                          errors={errors.deliveriesTrainingDate}
                        />
                        <CustomDateField
                          name="alertProcedureTrainingDate"
                          label="alertProcedureTrainingDate"
                          control={control}
                          errors={errors.alertProcedureTrainingDate}
                        />
                        <CustomDateField
                          name="firefightingTrainingDate"
                          label="firefightingTrainingDate"
                          control={control}
                          errors={errors.firefightingTrainingDate}
                        />
                        <CustomDateField
                          name="firstAidTrainingDate"
                          label="firstAidTrainingDate"
                          control={control}
                          errors={errors.firstAidTrainingDate}
                        />
                        <CustomDateField
                          name="othersTrainingDate"
                          label="othersTrainingDate"
                          control={control}
                          errors={errors.othersTrainingDate}
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
                    loading={isLoading}
                  >
                    {t("confirm")}
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

export default UpdateDriver;
