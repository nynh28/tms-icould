import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Button from "@mui/material/Button";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiUserPlus } from "react-icons/fi";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useAddCustomerMutation,
  useGetCompanysQuery,
  useUpdateCustomerMutation,
} from "../../services/apiSlice";
import CustomTextField from "../FormField/CustomTextField";
import CustomSelect from "../FormField/CustomSelect";
import { ROLES } from "../../constants/constants";

const AddCustomer = ({ open, setOpen, customer, setSelectedCustomer }) => {
  const { t } = useTranslation();
  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [updateCustomer, { isLoading: isUpdate }] = useUpdateCustomerMutation();
  const { data: companys } = useGetCompanysQuery({});
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // Validation
  const schema = yup.object().shape({
    fullName: yup
      .string()
      .required(t("message.validation.required", { field: t("fullName") })),
    address: yup
      .string()
      .required(t("message.validation.required", { field: t("address") })),
    idCard: yup
      .string()
      .required(t("message.validation.required", { field: t("idCard") })),
    phoneNumber: yup
      .string()
      .required(t("message.validation.required", { field: t("phoneNumber") })),
    email: yup
      .string()
      .required(t("message.validation.required", { field: t("email") })),
    taxCode: yup
      .string()
      .required(t("message.validation.required", { field: t("taxCode") })),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: "",
      fullName: "",
      idCard: "",
      phoneNumber: "",
      email: "",
      taxCode: "",
    },
  });

  useEffect(() => {
    if (!customer) {
      reset();
      return;
    }
    setValue("customerId", customer.customerId);
    setValue("address", customer.address);
    setValue("fullName", customer.fullName);
    setValue("idCard", customer.idCard);
    setValue("phoneNumber", customer.phoneNumber);
    setValue("email", customer.email);
    setValue("taxCode", customer.taxCode);
    setValue("companyId", customer.companyId);
  }, [customer, open]);

  const onAddCustomer = async (data) => {
    try {
      await addCustomer(data).unwrap();
      toast.success(t("message.success.add", { field: t("customer") }));
      reset();
      setOpen(false);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error?.response?.data?.validMsgList?.userName[0]);
      }
    }
  };

  const onUpdateCustomer = async (data) => {
    try {
      await updateCustomer(data).unwrap();
      toast.success(t("message.success.update", { field: t("customer") }));
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error?.response?.data?.validMsgList?.userName[0]);
      }
    }
  };

  const onSubmit = (data) => {
    if (!customer) {
      onAddCustomer(data);
    } else {
      onUpdateCustomer(data);
    }
  };

  const onClose = () => {
    setOpen(false);
    clearErrors();
    reset();
    setSelectedCustomer(null);
  };

  return (
    <>
      <Button
        variant="contained"
        className="px-6 capitalize"
        startIcon={<FiUserPlus className="h-5 w-5" />}
        onClick={() => setOpen(true)}
      >
        {t("addCustomer")}
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
                        {customer
                          ? t("updateTitle", { field: t("customer") })
                          : t("addTitle", { field: t("customer") })}
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
                        {customer
                          ? t("updateSubtitle", { field: t("customer") })
                          : t("addSubtitle", { field: t("customer") })}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col">
                    <div className="divide-y divide-gray-200 px-4 sm:px-6">
                      <div className="space-y-6 pt-6 pb-5">
                        {role === ROLES.Admin && (
                          <CustomSelect
                            name="companyId"
                            label="companyId"
                            control={control}
                            errors={errors.companyId}
                            options={companys?.content.map((x) => {
                              return { id: x.companyId, value: x.companyName };
                            })}
                            required
                          />
                        )}
                        <CustomTextField
                          name="fullName"
                          label="fullName"
                          control={control}
                          errors={errors.fullName}
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
                          name="phoneNumber"
                          label="phoneNumber"
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
                          name="idCard"
                          label="idCard"
                          control={control}
                          errors={errors.idCard}
                          required
                        />
                        <CustomTextField
                          name="taxCode"
                          label="taxCode"
                          control={control}
                          errors={errors.taxCode}
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
                    loading={isLoading || isUpdate}
                  >
                    {customer ? t("save") : t("confirm")}
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

export default AddCustomer;
