import React, { useState } from "react";
import { useSelector } from "react-redux";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useTranslation } from "react-i18next";
import { FaTruck } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useGetTrucksQuery, useGetDriversQuery } from "../../services/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";

const ListTruck = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("0");
  const [criterias, setCriterias] = useState({
    page: 0,
    rowsPerPage: 10,
  });

  const [criteriasDriver, setCriteriasDriver] = useState({
    page: 0,
    rowsPerPage: 10,
  });

  const { data, error, isLoading, isSuccess, refetch } =
    useGetTrucksQuery(criterias);
  // const { drivers } = useSelector((state) => state.drivers);
  const trucks = data?.content;

  const {
    data: dataDriver,
    error: errorDriver,
    isLoading: isLoadingDriver,
    isSuccess: isSuccessDriver,
    refetch: refetchDriver,
  } = useGetDriversQuery(criteriasDriver);
  const drivers = dataDriver?.content;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="pointer-events-none inset-y-0 right-0 z-[2] flex max-w-full overflow-hidden">
      <div className="pointer-events-auto w-screen max-w-xs">
        <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="border-b border-gray-200">
              <div className="flex py-[23px] items-center justify-between px-4">
                <h2 className="text-lg font-medium">{t("tabMap_2")}</h2>
              </div>
            </div>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChange} variant="fullWidth">
                  <Tab label={t("truck")} value="0" />
                  <Tab label={t("driver")} value="1" />
                </TabList>
              </Box>

              {/* Xe */}
              <TabPanel value="0" className="flex-1 p-0">
                {isLoading && (
                  <div className="my-auto flex h-full items-center justify-center">
                    <CircularProgress />
                  </div>
                )}
                <div
                  style={{ gridAutoRows: "20%" }}
                  className="grid h-full grid-flow-row grid-cols-none grid-rows-none divide-y divide-gray-200 overflow-auto"
                >
                  {isSuccess &&
                    trucks?.map((truck) => (
                      <div key={truck.id} className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full border border-primary-500 p-2">
                            <FaTruck />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {truck.plateLicence}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {truck.brand}
                            </p>
                            <p className="truncate text-sm text-gray-900">
                              {truck.drivers?.map((item) => item.fullName)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabPanel>

              <TabPanel value="1" className="flex-1 p-0">
                {isLoadingDriver && (
                  <div className="my-auto flex h-full items-center justify-center">
                    <CircularProgress />
                  </div>
                )}
                <div
                  style={{ gridAutoRows: "20%" }}
                  className="grid h-full grid-flow-row grid-cols-none grid-rows-none divide-y divide-gray-200 overflow-auto"
                >
                  {isSuccess &&
                    drivers?.map((truck) => (
                      <div key={truck.id} className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full border border-primary-500 p-2">
                            <FiUser />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {truck.fullName}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {truck.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabPanel>

              {/* Tài xế */}
              {/* <TabPanel value="1" className="p-0">
                <div className="grid flex-1 grid-rows-5 gap-px bg-gray-100">
                  {drivers?.map((truck) => (
                    <div key={truck.id} className="bg-white p-4">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full border border-primary-500 p-2">
                          <FiUser />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {truck.fullName}
                          </p>
                          <p className="flex items-center gap-2 truncate text-sm text-gray-500">
                            <HiOutlineMail className="h-5 w-5" />
                            {truck.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel> */}
            </TabContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTruck;
