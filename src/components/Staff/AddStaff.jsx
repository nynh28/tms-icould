import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useAddStaffMutation } from "../../services/apiSlice";
import CustomDateTimeField from "../FormField/CustomDateTimeField";
import CustomDateField from "../FormField/CustomDateField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
import CustomTextField from "../FormField/CustomTextField";

const AddStaff = ({ refetch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
//   const { masterDatas } = useSelector((state) => state.masterDatas);
  const [addStaff, { isLoading }] = useAddStaffMutation();

  // Validation
  const schema = yup.object().shape({
    citizenId: yup
      .string()
      .required(t("message.validation.required", { field: t("citizenId") })),
    firstName: yup
      .string()
      .required(t("message.validation.required", { field: t("firstName") })),
    title: yup
      .string()
      .required(t("message.validation.required", { field: t("title") })),
    type: yup
      .string()
      .required(t("message.validation.required", { field: t("type") })),
    // loadingWeight: yup
    //   .number()
    //   .nullable()
    //   .typeError(t("message.validation.invalid", { field: t("loadingWeight") }))
    //   .required(
    //     t("message.validation.required", { field: t("loadingWeight") })
    //   ),
    // registrationCertificateExpirationDate: yup
    //   .date()
    //   .nullable()
    //   .typeError(
    //     t("message.validation.invalid", {
    //       field: t("registrationCertificateExpirationDate"),
    //     })
    //   )
    //   .required(
    //     t("message.validation.required", {
    //       field: t("registrationCertificateExpirationDate"),
    //     })
    //   ),
    // insuranceExpirationDate: yup
    //   .date()
    //   .nullable()
    //   .typeError(
    //     t("message.validation.invalid", { field: t("insuranceExpirationDate") })
    //   )
    //   .required(
    //     t("message.validation.required", {
    //       field: t("insuranceExpirationDate"),
    //     })
    //   ),
    // ageOfTruck: yup
    //   .string()
    //   .nullable()
    //   .typeError(t("message.validation.invalid", { field: t("ageOfTruck") }))
    //   .required(
    //     t("message.validation.required", { field: t("ageOfTruck") })
    //   ),
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
        citizenId: "",
        firstName: "",
        lastName: "",
        title: "",
        type: "",
    },
  });

  const titles = ['Mr', 'Ms', 'Mrs']
  const types = [
    {id: 1, value: "HELPER"},
    {id: 2, value: "CLERKER"},
    {id: 3, value: "Exp. Second Driver"}
  ]

  const onSubmit = async (data) => {
    const transformData = {
      ...data,
    //   registrationCertificateExpirationDate: dayjs(
    //     data.registrationCertificateExpirationDate
    //   ).format(),
    //   insuranceExpirationDate: dayjs(data.insuranceExpirationDate).format(),
    //   registrationCertificate: ["JORA21U6U0UOUERZWND6EGKHND2V.jpg"],
    //   mid: "mid",
    //   insurance: ["JORA21U6U0UOUERZWND6EGKHND2V.jpg"],
    //   truckImages: ["JORA21U6U0UOUERZWND6EGKHND2V.jpg"],
    //   truckType: Number(data.truckType),
    //   ageOfTruck: data.ageOfTruck,
    };

    try {
      await addStaff(transformData).unwrap();
      toast.success(
        t("message.success.add", {
          field: t("staff"),
        })
      );
      reset();
      refetch();
      setOpen(false);
    } catch (error) {
      if (error.data.status === 400) {
        toast.error('lỗi');
      }
    }
    console.log(data);
    console.log(transformData);
  };

  const onClose = () => {
    setOpen(false);
    clearErrors();
    reset();
  };

  return (
    <>
      <Button
        variant="contained"
        className="px-6 capitalize"
        startIcon={<FiUserPlus className="h-5 w-5" />}
        onClick={() => setOpen(true)}
      >
        {t("addStaff")}
      </Button>
      <Transition.Root show={open} as={Fragment}>
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
            <div className="pointer-events-auto w-screen max-w-md">
              <form
                noValidate
                className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  <div className="bg-primary-700 py-6 px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium capitalize text-white">
                        {t("addTitle", { field: t("staff") })}
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
                        {t("addSubtitle", { field: t("staff") })}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6 h-full border-r">
                      <div className="space-y-4 pt-6 pb-5">
                        <CustomSelect
                          name="title"
                          label="title"
                          control={control}
                          errors={errors.groupId}
                          options={titles.map((x) => {
                            return { id: x, value: x };
                          })}
                          required
                        />
                        <CustomTextField
                          name="firstName"
                          label="firstName"
                          control={control}
                          errors={errors.firstName}
                          required
                        />
                        <CustomTextField
                          name="lastName"
                          label="lastName"
                          control={control}
                          errors={errors.lastName}
                          required
                        />
                        <CustomNumberField
                          name="citizenId"
                          label="citizenId"
                          control={control}
                          errors={errors.citizenId}
                          required
                        />
                        <CustomSelect
                          name="type"
                          label="type"
                          control={control}
                          errors={errors.type}
                          options={types}

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
                    loading={isLoading}
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

export default AddStaff;
