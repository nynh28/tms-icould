import { SearchIcon } from "@heroicons/react/outline";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import { exportJob, exportJob1, viewReportJob } from "../api";
import { listStatus } from "../data/status";
import { useGetDriversQuery, useGetTrucksQuery, useLazyGetReportShipmentExpenseQuery, useLazyGetReportShipmentQuery, useLazyGetReportShipmentStaffQuery } from "../services/apiSlice";
import { formatMoney } from "../utils/common";

const listReportType = [
  {
    value: 1,
    text: "Products by Jobs",
  },
  {
    value: 2,
    text: "Jobs by Drivers",
  },
  {
    value: 3,
    text: "Transporter Review",
  },
];

const Report = () => {
  const { t } = useTranslation();
  const { masterDatas } = useSelector((state) => state.masterDatas);
  const [dateFrom, setDateFrom] = useState(new Date().setHours(0, 0, 0, 0));
  const [dateTo, setDateTo] = useState(new Date().setHours(23, 59, 0, 0));
  const [formData, setFormData] = useState({
    driverId: "",
    truckId: "",
    status: "",
    fileType: "",
    reportType: 1,
    typeOfGoods: "",
    dateFrom: dayjs(dateFrom).format(),
    dateTo: dayjs(dateTo).format(),
  });

  const [fetchShipment1, { data: dataPlanStatus2, isFetching: fetchingShipment2, isSuccess: successShipment2, isError: errorShipment2 }] = useLazyGetReportShipmentQuery()
  const [fetchShipment, { data: dataPlanStatus, isFetching: fetchingShipment, isSuccess: successShipment, isError: errorShipment }] = useLazyGetReportShipmentStaffQuery()
  const [fetchShipmentExpend, { data: dataPlanStatus1, isFetching: fetchingShipment1, isSuccess: successShipment1, isError: errorShipment1 }] = useLazyGetReportShipmentExpenseQuery()


  useEffect(_ => {
    // onExportWaybill()
    fetchShipment({page: 0,
        rowsPerPage: 1000,
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),})
        fetchShipmentExpend({page: 0,
        rowsPerPage: 1000,
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),})

  }, [])

  const onExportWaybill = async () => {
    setLoading(true);
    try {
      const response = await exportJob1({page: 0,
        rowsPerPage: 1000,
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),})
        console.log(response)
      const file = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const { data: trucks } = useGetTrucksQuery({});
  const { data: drivers } = useGetDriversQuery({});

  const getCargoName = (value) => {
    if (value) {
      return masterDatas?.find(
        (x) => x.type === "CARGO" && x.intValue === value
      )?.name;
    }
  };

  const getUnitName = (value) => {
    if (value) {
      return masterDatas?.find((x) => x.type === "UNIT" && x.intValue === value)
        ?.name;
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await viewReportJob(formData);
      setJobs(response.data.content);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onExport = async (type) => {
    let newData = {
      ...formData,
      fileType: type,
      reportType: listReportType.find((x) => x.value === formData.reportType)
        .text,
    };
    try {
      const response = await exportJob(newData);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      let d = new Date();
      link.setAttribute(
        "download",
        `Report-${d.toISOString()}.${type === "excel" ? "xlsx" : "Pdf"}`
      );
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-center gap-4 border-b border-gray-200 bg-white pt-5 pb-4 pl-6">
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            {t("reportType")}
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label={t("reportType")}
            value={formData.reportType}
            onChange={(e) =>
              setFormData({ ...formData, reportType: Number(e.target.value) })
            }
          >
            {listReportType.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {t(item.text)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            {t("typeOfGoods")}
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label={t("typeOfGoods")}
            value={formData.typeOfGoods}
            onChange={(e) =>
              setFormData({ ...formData, typeOfGoods: Number(e.target.value) })
            }
          >
            {masterDatas
              .filter((x) => x.type === "CARGO")
              .map((item) => (
                <MenuItem key={item.intValue} value={item.intValue}>
                  {t(item.name)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {drivers && (
          <Autocomplete
            size="small"
            options={drivers?.content.map((item) => ({
              id: item.id,
              label: item.fullName,
            }))}
            sx={{ width: 250 }}
            onChange={(event, newValue) =>
              setFormData({ ...formData, driverId: newValue?.id })
            }
            renderInput={(params) => (
              <TextField {...params} label={t("driver")} />
            )}
          />
        )}
        {trucks && (
          <Autocomplete
            size="small"
            options={trucks?.content.map((item) => ({
              id: item.id,
              label: item.plateLicence,
            }))}
            onChange={(event, newValue) =>
              setFormData({ ...formData, truckId: newValue?.id })
            }
            sx={{ width: 250 }}
            renderInput={(params) => (
              <TextField {...params} label={t("truck")} />
            )}
          />
        )}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            {t("status")}
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label={t("status")}
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: Number(e.target.value) })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {listStatus.map((item) => (
              <MenuItem
                key={item.intValue}
                value={item.intValue}
                className={item.colorText}
              >
                {t(item.text)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="flex items-center gap-2">
          <DateTimePicker
            label={t("dateFrom")}
            value={dateFrom}
            inputFormat="HH:mm DD/MM/YYYY"
            mask=""
            onChange={(value) => {
              setDateFrom(value);
              setFormData({ ...formData, dateFrom: dayjs(value).format() });
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
          <DateTimePicker
            label={t("dateTo")}
            value={dateTo}
            inputFormat="HH:mm DD/MM/YYYY"
            mask=""
            onChange={(value) => {
              setDateTo(value);
              setFormData({ ...formData, dateTo: dayjs(value).format() });
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </div>
        <LoadingButton
          variant="contained"
          startIcon={<SearchIcon className="h-4 w-4" />}
          onClick={onSubmit}
          loading={loading}
        >
          {t("search")}
        </LoadingButton>
        <div className="mr-6 flex items-center justify-center gap-2">
          <Tooltip title="Download Excel" placement="top-start" arrow>
            <div
              className="cursor-pointer rounded-lg border border-gray-300 p-1 shadow hover:bg-gray-200"
              onClick={() => onExport("excel")}
            >
              <img src="/images/excel1.svg" className="h-5 w-5" />
            </div>
          </Tooltip>
          <Tooltip title="Download PDF" placement="top-start" arrow>
            <div
              className="cursor-pointer rounded-lg border border-gray-300 p-1 shadow hover:bg-gray-200"
              onClick={() => onExport("Pdf")}
            >
              <img src="/images/pdf2.svg" className="h-5 w-5" />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="mx-auto my-4 w-[calc(100vw_-_42px)] rounded-lg bg-white p-6 shadow">
        <DataGrid
          dataSource={jobs}
          keyExpr="jobId"
          showBorders={true}
          showRowLines={true}
        >
          <Paging defaultPageSize={25} />
          <Pager
            visible={true}
            allowedPageSizes={[25, 50, 100]}
            displayMode="full"
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          <Column dataField="jobId" width={100} />
          <Column
            dataField="jobStatus"
            alignment="left"
            minWidth={150}
            cellRender={({ data }) => (
              <Chip
                label={t(
                  listStatus.find((x) => x.intValue === data.jobStatus)?.text
                )}
                className={`${
                  listStatus.find((x) => x.intValue === data.jobStatus)?.color
                } text-white`}
                size="small"
              />
            )}
          />
          <Column
            caption={t("commodityInformation")}
            minWidth={300}
            cellRender={(data) => (
              <>
                <div className="grid grid-cols-[120px_auto]">
                  <p>
                    <span className="font-medium">{t("nameOfGoods")}: </span>
                  </p>
                  <p>{data.data.commodity?.nameOfGoods}</p>
                </div>
                <div className="grid grid-cols-[120px_auto]">
                  <p>
                    <span className="font-medium">{t("typeOfGoods")}: </span>
                  </p>
                  <p>{t(getCargoName(data.data.commodity?.typeOfGoods))}</p>
                </div>
                <div className="grid grid-cols-[120px_auto]">
                  <p>
                    <span className="font-medium">{t("tripType")}: </span>
                  </p>
                  <p>
                    {data.data.commodity?.tripType === 1
                      ? t("singleTrip")
                      : t("roundTrip")}
                  </p>
                </div>
                <div className="grid grid-cols-[120px_auto]">
                  <p>
                    <span className="font-medium">{t("loadingWeight")}: </span>
                  </p>
                  <p className="break-all">
                    {data.data.commodity?.cargoWeight} {t(getUnitName(data.data.commodity?.unit))}
                  </p>
                </div>
              </>
            )}
          />
          <Column
            dataField="salesOrder"
            minWidth={300}
            cellRender={(data) => (
              <>
                <div className="grid grid-cols-[120px_auto]">
                  <p className="font-medium">{t("orderCode")}: </p>
                  <p className="font-normal">
                    {data.data.salesOrder?.orderCode}
                  </p>
                </div>
                <div className="grid grid-cols-[120px_auto]">
                  <p className="font-medium">{t("customerName")}: </p>
                  <p className="font-normal">
                    {data.data.salesOrder?.customerName}
                  </p>
                </div>
                <div className="grid grid-cols-[120px_auto]">
                  <p className="font-medium">{t("transportFee")}: </p>
                  <p className="font-normal">
                    {formatMoney(data.data.salesOrder?.transportFee || 0)} THB
                  </p>
                </div>
              </>
            )}
          />
          <Column dataField="groupName" width={200} />
          <Column
            dataField="truckPlateLicence"
            caption={t("licensePlate")}
            width={150}
          />
          <Column dataField="driverName" minWidth={250} />
          <Column
            caption={t("locations")}
            minWidth={600}
            width="auto"
            cellRender={(data) => (
              <div>
                {data.data.locations
                  .filter((x) => x.locationType === 1)
                  .map((item) => (
                    <li key={item.locationId} className="list-none">
                      <div className="relative pb-4">
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                        <div className="relative flex items-start space-x-3">
                          <div className="mt-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white ring-8 ring-white">
                              <span className="text-base">P</span>
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                            <p>{item.locationAddress}</p>
                            <div className="whitespace-nowrap text-gray-500">
                              <p>
                                {t("pickupDate")}:{" "}
                                {dayjs(item.locationDateTime).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                {data.data.locations
                  .filter((x) => x.locationType === 2)
                  .map((item, index) => (
                    <li key={item.locationId} className="list-none">
                      <div className="relative pb-4">
                        {index !==
                          data.data.locations?.filter(
                            (x) => x.locationType === 2
                          ).length -
                            1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="mt-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 bg-white text-lg text-blue-500 ring-8 ring-white">
                              D
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                            <p>{item.locationAddress}</p>
                            <div className="whitespace-nowrap text-gray-500">
                              <p>
                                {t("deliveryDate")}:{" "}
                                {dayjs(item.locationDateTime).format(
                                  "HH:mm DD/MM/YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </div>
            )}
          />
          <Column
            caption={t("contact")}
            minWidth={300}
            cellRender={(data) => (
              <div>
                {data.data.locations
                  .filter((x) => x.locationType === 1)
                  .map((item) => (
                    <li key={item.locationId} className="list-none">
                      <div className="relative pb-4">
                        <div className="relative flex items-start space-x-3">
                          <FiUser className="mt-2 h-8 w-8 text-gray-200" />
                          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                            <p>
                              {t("senderName")}: {item.contactName}
                            </p>
                            <div className="whitespace-nowrap text-gray-500">
                              <p>
                                {t("phone")}: {item.contactPhone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                {data.data.locations
                  .filter((x) => x.locationType === 2)
                  .map((item, index) => (
                    <li key={item.locationId} className="list-none">
                      <div className="relative pb-4">
                        <div className="relative flex items-start space-x-3">
                          <FiUser className="mt-2 h-8 w-8 text-gray-200" />
                          <div className="flex min-w-0 flex-1 flex-col justify-between space-y-1 pt-1">
                            <p>
                              {t("deliveryName")}: {item.contactName}
                            </p>
                            <div className="whitespace-nowrap text-gray-500">
                              <p>
                                {t("phone")}: {item.contactPhone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </div>
            )}
          />
        </DataGrid>
      </div>
    </div>
  );
};

export default Report;
