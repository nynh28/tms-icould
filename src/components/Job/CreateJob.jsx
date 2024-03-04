import React, { useEffect, useState } from "react";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Accordion from "@mui/material/Accordion";
import Button from "@mui/material/Button";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import {
  fetchDrivers,
  fetchFleets,
  suggestSalesOrder,
  uploadImage,
} from "../../api";
import {
  useAddJobMutation,
  useAssignJobMutation,
} from "../../services/apiSlice";
import CustomDateTimeField from "../FormField/CustomDateTimeField";
import CustomMapField from "../FormField/CustomMapField";
import CustomNumberField from "../FormField/CustomNumberField";
import CustomSelect from "../FormField/CustomSelect";
import CustomTextField from "../FormField/CustomTextField";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { formatMoney } from "../../utils/common";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

const CreateJob = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const { masterDatas } = useSelector((state) => state.masterDatas);
  const [addJob, { isLoading }] = useAddJobMutation();
  const [cooridinate, setCooridinate] = useState({
    lat: 13.759056594460827,
    lng: 100.49986200303755,
  });
  const [directionResponse, setDirectionResponse] = useState(null);

  const [listLatLng, setListLatLng] = useState([]);
  const [valueOption, setValueOption] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedFleet, setSelectedFleet] = useState(null);

  const [assignJob] = useAssignJobMutation();

  useEffect(() => {
    const renderDirections = (locations) => {
      let lastDirection = locations.length - 1;
      const waypoints = [];
      if (locations.length > 2) {
        for (let i = 1; i < locations.length; i++) {
          waypoints.push({
            location: new window.google.maps.LatLng(
              locations[i].locationLatitude,
              locations[i].locationLongitude
            ),
            stopover: true,
          });
        }
      }

      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route(
        {
          origin: new window.google.maps.LatLng(
            locations[0].locationLatitude,
            locations[0].locationLongitude
          ),
          destination: new window.google.maps.LatLng(
            locations[lastDirection].locationLatitude,
            locations[lastDirection].locationLongitude
          ),
          waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    };

    if (listLatLng.length >= 2) {
      renderDirections(listLatLng);
    }
  }, [listLatLng]);

  useEffect(() => {
    if (!selectedFleet) return;

    const getDriverMapped = async () => {
      try {
        const response = await fetchDrivers({
          isMapped: true,
          page: 0,
          rowsPerPage: 1000,
          groupId: selectedFleet,
        });
        setDrivers(response.data.content);
      } catch (error) {
        console.log(error);
      }
    };

    getDriverMapped();
  }, [selectedFleet]);

  // Validation Schema
  const schema = Yup.object().shape({
    groupId: Yup.string().required(
      t("message.validation.required", {
        field: t("fleetName"),
      })
    ),
    driverId: Yup.string().required(
      t("message.validation.required", {
        field: t("driverName"),
      })
    ),
    commodity: Yup.object().shape({
      orderId: Yup.string()
        .required(
          t("message.validation.required", {
            field: t("salesOrder"),
          })
        )
        .nullable(),
      tripType: Yup.number()
        .required(
          t("message.validation.required", {
            field: t("tripType"),
          })
        )
        .nullable(),
      cargoWeight: Yup.number()
        .required(
          t("message.validation.required", {
            field: t("loadingWeight"),
          })
        )
        .typeError(
          t("message.validation.required", {
            field: t("loadingWeight"),
          })
        )
        .positive(`Please enter a valid loading weight`)
        .nullable(),
      unit: Yup.number()
        .required(
          t("message.validation.required", {
            field: t("unit"),
          })
        )
        .nullable(),
    }),
    locations: Yup.array().of(
      Yup.object().shape({
        locationAddress: Yup.string().required(
          t("message.validation.required", {
            field: t("location"),
          })
        ),
        contactName: Yup.string().required(
          t("message.validation.required", {
            field: t("name"),
          })
        ),
        contactPhone: Yup.string()
          .matches(
            /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
            "Phone number is not valid"
          )
          .required(
            t("message.validation.required", {
              field: t("phone"),
            })
          ),
        locationDateTime: Yup.date()
          .nullable()
          .typeError(
            t("message.validation.invalid", {
              field: t("date"),
            })
          )
          .required(
            t("message.validation.required", {
              field: t("date"),
            })
          ),
      })
    ),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupId: "",
      driverId: "",
      commodity: {
        nameOfGoods: "",
        typeOfGoods: "",
        cargoWeight: 0,
        unit: null,
        note: "",
        attachments: [],
        orderId: "",
      },
      locations: [
        {
          locationType: 1,
          addressType: 0,
          locationDateTime: "",
          contactName: "",
          contactPhone: "",
          locationAddress: "",
          locationLatitude: 0,
          locationLongitude: 0,
          note: "",
          attachments: [],
        },
        {
          locationType: 2,
          addressType: 0,
          locationDateTime: "",
          contactName: "",
          contactPhone: "",
          locationAddress: "",
          locationLatitude: 0,
          locationLongitude: 0,
          note: "",
          attachments: [],
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "locations",
    control,
  });

  const searchHandler = async () => {
    try {
      const response = await suggestSalesOrder(inputValue || "");
      setOptions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    searchHandler();
  }, [valueOption, inputValue]);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const response = await fetchFleets({
          page: 0,
          rowsPerPage: 1000,
        });
        if (response.status === 200) {
          setGroups(response.data?.content);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getGroups();
  }, []);

  const onClose = () => {
    setOpen(false);
    setListLatLng([]);
    setValueOption(null);
    setDirectionResponse(null);
    setDrivers([]);
    reset();
  };

  useEffect(() => {
    const onChangeSalesOrder = (data) => {
      if (!data) {
        setCustomer(null);
        return;
      }
      setValue("commodity.nameOfGoods", data.nameOfGoods);
      setValue("commodity.typeOfGoods", data.typeOfGoods);
      setCustomer(data);
    };
    onChangeSalesOrder(valueOption);
  }, [valueOption]);

  const onSubmit = async (data) => {
    try {
      const response = await addJob(data).unwrap();
      await assignJob({
        driverId: data.driverId,
        jobId: response.jobId
      }).unwrap();
      setListLatLng([]);
      setDirectionResponse(null);
      reset();
      setOpen(false);
      toast.success(t("message.success.add", { field: t("job") }));
    } catch (error) {
      console.log(error);
    }
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

  // Thêm điểm nhận hàng
  const appendPickup = () => {
    append({
      locationType: 1,
      addressType: 0,
      locationDateTime: "",
      contactName: "",
      contactPhone: "",
      locationAddress: "",
      locationLatitude: 0,
      locationLongitude: 0,
      note: "",
      attachments: [],
    });
  };

  // Thêm điểm giao hàng
  const appendDelivery = () => {
    append({
      locationType: 2,
      addressType: 0,
      locationDateTime: "",
      contactName: "",
      contactPhone: "",
      locationAddress: "",
      locationLatitude: 0,
      locationLongitude: 0,
      note: "",
      attachments: [],
    });
  };

  // Index của các điểm
  const indexes = new Map(fields.map(({ id }, index) => [id, index]));

  // Sắp xếp các điểm
  const sortedFields = [...fields].sort(
    (a, b) => a.locationType - b.locationType
  );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className="absolute flex h-full w-full items-center justify-center">
          <div className="pointer-events-auto mx-4 min-h-[98vh] w-screen max-w-[1600px] overflow-hidden rounded-lg bg-white">
            <div className="border-b border-gray-200 py-6 px-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="whitespace-nowrap text-2xl font-medium capitalize">
                    {t("createJob")}
                  </h2>
                </div>
                <div className="ml-3 flex h-7 items-center justify-center gap-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex max-h-full w-full shadow-xl">
              <div className="flex min-h-0 w-2/5 flex-1 flex-col overflow-y-auto">
                <div className="relative flex flex-1 flex-col bg-gray-100">
                  <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="h-[calc(100vh_-_80px)]"
                  >
                    <PerfectScrollbar>
                      {/* Commodity */}
                      <div className="m-4 space-y-4 rounded-lg bg-white p-4 pb-5">
                        <h2 className="font-medium">
                          {t("commodityInformation")}
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                          <Controller
                            name="groupId"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <FormControl
                                variant="standard"
                                sx={{ m: 0, minWidth: 120 }}
                                fullWidth
                                error={!!errors.groupId}
                              >
                                <InputLabel>{t("fleetName")}</InputLabel>
                                <Select
                                  label={t("fleetName")}
                                  onChange={(e) => {
                                    setSelectedFleet(e.target.value);
                                    onChange(e.target.value);
                                  }}
                                  value={value}
                                >
                                  {groups.map((item) => (
                                    <MenuItem
                                      key={item.groupId}
                                      value={item.groupId}
                                    >
                                      {t(item.groupName)}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors && (
                                  <FormHelperText>
                                    {errors.groupId?.message}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            )}
                          />
                          <CustomSelect
                            name={`commodity.tripType`}
                            label="tripType"
                            control={control}
                            errors={errors.commodity?.tripType}
                            options={[
                              { id: 1, value: t("singleTrip") },
                              { id: 2, value: t("roundTrip") },
                            ]}
                            required
                          />
                        </div>
                        <div>
                          <CustomSelect
                            name={`driverId`}
                            label="driverName"
                            control={control}
                            errors={errors.driverId}
                            options={drivers?.map((x) => {
                              return { id: x.id, value: x.fullName };
                            })}
                            required
                          />
                        </div>
                        <Controller
                          name="commodity.orderId"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              id="orderId"
                              getOptionLabel={(option) =>
                                typeof option === "string"
                                  ? option
                                  : option.orderCode
                              }
                              filterOptions={(x) => x}
                              options={options}
                              autoComplete
                              includeInputInList
                              filterSelectedOptions
                              value={valueOption}
                              onChange={(event, newValue) => {
                                setOptions(
                                  newValue ? [newValue, ...options] : options
                                );
                                setValueOption(newValue);
                                field.onChange(newValue.orderId);
                              }}
                              onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t("salesOrder")}
                                  variant="standard"
                                  size="small"
                                  fullWidth
                                  error={!!errors.commodity?.orderId}
                                  helperText={
                                    errors
                                      ? errors.commodity?.orderId?.message
                                      : ""
                                  }
                                />
                              )}
                              renderOption={(props, options) => {
                                return (
                                  <li
                                    {...props}
                                    className="grid cursor-pointer grid-cols-3 p-2 hover:bg-gray-200"
                                    key={options.orderId}
                                  >
                                    <p className="col-span-2 pr-2 font-medium text-amber-800">
                                      {options.orderCode}
                                    </p>
                                    <p className=" ">{options.nameOfGoods}</p>
                                  </li>
                                );
                              }}
                            />
                          )}
                        />
                        {customer && (
                          <div className="border border-gray-200 p-4">
                            <div className="grid grid-cols-2">
                              <p>{t("customerName")}:</p>
                              <span className="font-semibold">
                                {customer.customer.fullName}
                              </span>
                            </div>

                            <div className="grid grid-cols-2">
                              <p>{t("phoneNumber")}:</p>
                              <span className="font-semibold">
                                {customer.customer.phoneNumber}
                              </span>
                            </div>

                            <div className="grid grid-cols-2">
                              <p>{t("email")}:</p>
                              <span className="font-semibold">
                                {customer.customer.email}
                              </span>
                            </div>

                            <div className="grid grid-cols-2">
                              <p>{t("idCard")}:</p>
                              <span className="font-semibold">
                                {customer.customer.idCard}
                              </span>
                            </div>

                            <div className="grid grid-cols-2">
                              <p>{t("transportFee")}:</p>
                              <span className="font-semibold">
                                {formatMoney(customer.transportFee)} THB
                              </span>
                            </div>
                          </div>
                        )}
                        <CustomTextField
                          name={`commodity.nameOfGoods`}
                          label="nameOfGoods"
                          control={control}
                          errors={errors.commodity?.nameOfGoods}
                          required
                          disabled
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <CustomSelect
                            name={`commodity.typeOfGoods`}
                            label="typeOfGoods"
                            control={control}
                            errors={errors.commodity?.typeOfGoods}
                            options={masterDatas
                              .filter((x) => x.type === "CARGO")
                              .map((x) => {
                                return { id: x.intValue, value: x.name };
                              })}
                            required
                            disabled
                          />
                          <CustomNumberField
                            name={`commodity.cargoWeight`}
                            label="loadingWeight"
                            control={control}
                            errors={errors.commodity?.cargoWeight}
                            required
                          />
                          <CustomSelect
                            name={`commodity.unit`}
                            label="unit"
                            control={control}
                            errors={errors.commodity?.unit}
                            options={masterDatas
                              .filter((x) => x.type === "UNIT")
                              .map((x) => {
                                return { id: x.intValue, value: x.name };
                              })}
                            required
                          />
                        </div>

                        <CustomTextField
                          name={`commodity.note`}
                          label="note"
                          control={control}
                          errors={errors.commodity?.note}
                          multiline
                          rows={4}
                        />

                        <Controller
                          name="commodity.attachments"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <input
                              type="file"
                              className="block w-full cursor-pointer appearance-none overflow-hidden rounded-md border border-gray-200 bg-white p-2"
                              onChange={async (e) => {
                                const image = await handleUpload(
                                  e.target.files[0]
                                );
                                field.onChange([image.fileName]);
                              }}
                            />
                          )}
                        />
                      </div>

                      {/* Pickup & Delivery point*/}
                      <div className="p-4 pt-0">
                        {sortedFields.map((item, index) => (
                          <div key={item.id}>
                            <Accordion
                              defaultExpanded={true}
                              className="mb-2 border border-gray-200 shadow"
                            >
                              <AccordionSummary
                                expandIcon={
                                  <ChevronDownIcon className="h-5 w-5" />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <div className="flex w-full justify-between">
                                  <div className="flex items-center gap-2">
                                    {item.locationType === 1 ? (
                                      <Avatar
                                        className="bg-blue-500"
                                        sx={{ width: 24, height: 24 }}
                                      >
                                        P
                                      </Avatar>
                                    ) : (
                                      <Avatar
                                        className="border border-blue-500 bg-white text-blue-500"
                                        sx={{ width: 24, height: 24 }}
                                      >
                                        D
                                      </Avatar>
                                    )}
                                    <h2 className="font-medium">
                                      {item.locationType === 1
                                        ? t("pickupPoint")
                                        : t("deliveryPoint")}
                                    </h2>
                                  </div>
                                  {sortedFields
                                    .map((el) => el.locationType)
                                    .indexOf(1) !== index &&
                                    item.locationType === 1 && (
                                      <div
                                        className="group z-20 mr-4 rounded-lg border border-gray-200 p-1 shadow-sm transition-all duration-300 hover:border-red-500 hover:bg-red-500"
                                        onClick={() =>
                                          remove(indexes.get(item.id))
                                        }
                                      >
                                        {
                                          <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
                                        }
                                      </div>
                                    )}
                                  {sortedFields
                                    .map((el) => el.locationType)
                                    .indexOf(2) !== index &&
                                    item.locationType === 2 && (
                                      <div
                                        className="group z-20 mr-4 rounded-lg border border-gray-200 p-1 shadow-sm transition-all duration-300 hover:border-red-500 hover:bg-red-500"
                                        onClick={() =>
                                          remove(indexes.get(item.id))
                                        }
                                      >
                                        {
                                          <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
                                        }
                                      </div>
                                    )}
                                </div>
                              </AccordionSummary>
                              <AccordionDetails className="space-y-4">
                                <Controller
                                  name={`locations.${indexes.get(
                                    item.id
                                  )}.locationAddress`}
                                  control={control}
                                  render={({ field: { onChange, value } }) => (
                                    <CustomMapField
                                      onChange={onChange}
                                      onUpdate={update}
                                      itemIndex={indexes.get(item.id)}
                                      control={control}
                                      value={value}
                                      setListLatLng={setListLatLng}
                                      errors={
                                        errors.locations?.[indexes.get(item.id)]
                                          ?.locationAddress
                                      }
                                    />
                                  )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                  <CustomTextField
                                    name={`locations.${indexes.get(
                                      item.id
                                    )}.contactName`}
                                    label={
                                      item.locationType === 1
                                        ? "senderName"
                                        : "receiverName"
                                    }
                                    control={control}
                                    errors={
                                      errors.locations?.[indexes.get(item.id)]
                                        ?.contactName
                                    }
                                    required
                                  />
                                  <CustomTextField
                                    name={`locations.${indexes.get(
                                      item.id
                                    )}.contactPhone`}
                                    label="phone"
                                    control={control}
                                    errors={
                                      errors.locations?.[indexes.get(item.id)]
                                        ?.contactPhone
                                    }
                                    required
                                  />
                                </div>
                                <CustomDateTimeField
                                  name={`locations.${indexes.get(
                                    item.id
                                  )}.locationDateTime`}
                                  label={
                                    item.locationType === 1
                                      ? "pickDate"
                                      : "deliveryDate"
                                  }
                                  control={control}
                                  errors={
                                    errors.locations?.[indexes.get(item.id)]
                                      ?.locationDateTime
                                  }
                                  required
                                />
                                <CustomTextField
                                  name={`locations.${indexes.get(
                                    item.id
                                  )}.note`}
                                  label="note"
                                  control={control}
                                  errors={
                                    errors.locations?.[indexes.get(item.id)]
                                      ?.note
                                  }
                                  multiline
                                  rows={4}
                                />
                                <Controller
                                  name={`locations.${indexes.get(
                                    item.id
                                  )}.attachments`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <input
                                      type="file"
                                      className="block w-full cursor-pointer appearance-none overflow-hidden rounded-md border border-gray-200 bg-white p-2"
                                      onChange={async (e) => {
                                        const image = await handleUpload(
                                          e.target.files[0]
                                        );
                                        field.onChange([image.fileName]);
                                      }}
                                    />
                                  )}
                                />
                              </AccordionDetails>
                            </Accordion>
                            {index ===
                              sortedFields
                                .map((el) => el.locationType)
                                .lastIndexOf(1) && (
                                <a
                                  onClick={appendPickup}
                                  className="mb-4 mt-2 block cursor-pointer text-sm text-indigo-500"
                                >
                                  + Add more pickup point
                                </a>
                              )}
                            {index ===
                              sortedFields
                                .map((el) => el.locationType)
                                .lastIndexOf(2) && (
                                <a
                                  onClick={appendDelivery}
                                  className="mb-14 mt-2 block cursor-pointer text-sm text-indigo-500"
                                >
                                  + Add more delivery point
                                </a>
                              )}
                          </div>
                        ))}
                      </div>
                    </PerfectScrollbar>

                    {/* Submit button */}
                    <div className="absolute bottom-0 z-10 flex w-full justify-end gap-4 bg-white px-4 py-2 text-lg">
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
              </div>
              <div className="w-3/5">
                <GoogleMap
                  center={cooridinate}
                  zoom={12}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {directionResponse && (
                    <DirectionsRenderer directions={directionResponse} />
                  )}
                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default CreateJob;
