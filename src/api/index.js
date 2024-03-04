import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const baseURLF = 'http://3.1.175.195:4003/prod';

const axiosInstance = axios.create({
  baseURL,
});
const axiosInstance1 = axios.create({
    baseURL: baseURLF,
});

axiosInstance.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("token"))
    }`;
  }
  return req;
});

// AUTH
export const login = (formData) => axiosInstance.post("/api/auth/login", formData);
export const verifyUserHino = (data) => axiosInstance.post("/api/auth/hino/verify-user", data, {timeout: 1200000});

// DRIVER
export const fetchDrivers = (data) => axiosInstance.post("/api/drivers/list", data);
export const fetchDriverDetail = (id) => axiosInstance.get("/api/drivers/detail/"+id);
export const addDriver = (data) => axiosInstance.post("/api/drivers/add", data);
export const deleteDriver = (id) => axiosInstance.delete(`/api/drivers/delete/${id}`);

// USER
export const fetchUsers = (userData) => axiosInstance.post("/api/user/list", userData);

// JOB
export const fetchJobs = (data) => axiosInstance.post("/api/job/list", data);
export const getJobDetail = (id) => axiosInstance.get(`api/job/detail/${id}`);
export const addJob = (data) => axiosInstance.post("/api/job/create", data);
export const assignDriver = (data) => axiosInstance.post("/api/job/rtt/assign-driver", data);
export const reAssignDriver = (data) => axiosInstance.post("/api/job/re-assign", data);
export const exportWaybill = (jobId) => axiosInstance.get(`/api/job/waybill/${jobId}/pdf`, {
  responseType: "blob",
});
export const getListJobTruckByDate = (data, cancelToken) => axiosInstance.post("/api/job/list/by-date", data, cancelToken);
export const getListJobUnassignedByDate = (data, cancelToken) => axiosInstance.post("/api/job/list/unassigned", data, cancelToken);

// TRUCK
export const fetchTrucks = (data) => axiosInstance.post("/api/truck/list", data);
export const fetchTruckDetail = (id) => axiosInstance.get(`/api/truck/detail/${id}`);
export const addTruck = (data) => axiosInstance.post("/api/truck/add", data);
export const deleteTruck = async (id) => axiosInstance.delete(`/api/truck/delete/${id}`);
export const assignDriverToTruck = (data) => axiosInstance.post("/api/drivers/mapping/truck", data);


export const fetchTruckDetail1 = (data) => axiosInstance1.post("/fleet/report/get_data_by_license_plate_list", data);

// GET LOCATION BY PLATE
export const getLocationByPlate = (data) => axios.get('http://3.1.175.195:4003/prod/fleet/report/get_realtime_by_license_plate', { params: data });

// COMPANY
export const fetchCompanys = async () => {
  try {
    const { data } = await axiosInstance.post("/api/company/list", {
      status: 0,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchDriversByGroupId = (groupId) =>
  axiosInstance.post(`/api/area/driver-truck/${groupId}`, {});

// CARRIERS
export const fetchCarriers = (data) => axiosInstance.post("/api/user/list", data);
export const addCarrier = (data) => axiosInstance.post("/api/user/add", data);
export const assignTruck = (data) => axiosInstance.post("/api/company/user/group/assign", data);
export const assignMultiJob = (data) => axiosInstance.post("/api/job/list/assign", data);
export const getProfile = (url) => axiosInstance.get(url);
export const updateProfile = (url, data) => axiosInstance.post(url, data);
export const suggestCustomer = (name) => axiosInstance.get(`/api/customer/suggest/${name}`);
export const suggestSalesOrder = (name) => axiosInstance.get(`/api/sales-order/suggest/${name}`);
export const getDetailSalesOrder = (id) => axiosInstance.get(`/api/sales-order/detail/${id}`);
export const getJobsBySalesOrderId = (id) => axiosInstance.get(`/api/job/sales-order/${id}`);
export const getDriversAndTruckByJob = (jobId) => axiosInstance.get(`/api/job/driver-truck/${jobId}`);
export const searchCustomer = (data) => axiosInstance.post("/api/customer/list", data);
export const searchFleet = (name) => axiosInstance.get(`/api/device/group/list/${name}`);
export const getTruckDevice = (data) => axiosInstance.post("/api/device/truck/list", data);
export const getLocationsByJobId = (jobId) => axiosInstance.get(`/api/job/location/${jobId}`);
export const getTrucksTracking = (url, data) => axiosInstance.post(url, data);
export const getDriversTracking = (url, data) => axiosInstance.post(url, data);
export const getRatingByJob = (jobId) => axiosInstance.get(`/api/carrier/rating/job/${jobId}`);
export const viewReportJob = (data) => axiosInstance.post("/api/job/statistic", data);
export const exportJob = (data) => axiosInstance.post("/api/job/statistic/export", data, {
  responseType: "blob",
});
export const exportJob1 = (data) => axiosInstance.post("/api/report/shipment", data, {
  responseType: "blob",
});
export const getDetailTrackingTruck = (truckId) => axiosInstance.get(`/api/carrier/tracking/truck/${truckId}`);
export const getDetailTrackingTruckJob = (truckId, data) => axiosInstance.post(`/api/carrier/tracking/truck/${truckId}/jobs`, data);
export const getDetailTrackingDriver = (driverId) => axiosInstance.get(`/api/carrier/tracking/driver/${driverId}`);

// FLEET
export const fetchFleets = (data) => axiosInstance.post("/api/group/list", data);
export const fetchSiteLocation = (data) => axiosInstance.post("/api/rtt/id-site/list", data);
export const addFleet = (data) => axiosInstance.post("/api/company/group/add", data);
export const importCustomer = (data) => axiosInstance.post("/api/customer/import", data);

// UPLOAD
export const uploadImage = (data) => axiosInstance.post("/api/file/upload", data, {
  headers: {
    "Content-Type": "multi-part/form-data",
  },
});

export const downloadImage = (fileName) => axiosInstance.get(`/api/file/download/${fileName}`, { responseType: "blob" });

// MASTER DATA
export const fetchMasterData = (types) => axiosInstance.post(`/api/general/master-data/list`, { types });

// IMPORT
export const createMultiJobs = (data) => axiosInstance.post(`/api/job/list/create`, data);
export const uploadExcelJob = (data, options) => axiosInstance.post(`/api/job/rtt/import`, data, options);
export const uploadExcelDO = (data, options) => axiosInstance.post(`/api/rtt/delivery-order/import`, data, options);
export const publishJob = (data) => axiosInstance.post(`/api/job/rtt/publishJobList`, data);
//dashboard
export const dashboardDeliveryOrder=() => axiosInstance.post(`/api/dashboard/delivery-order`)
export const dashboardJobWeek = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role == "ROLE_CARRIER") {
    try {
      const { data } = await axiosInstance.get(
        "/api/carrier/dashboard-job-week",
        {}
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  if (user.role == "ROLE_COMPANY") {
    try {
      const { data } = await axiosInstance.get(
        "/api/company/dashboard-job-week",
        {}
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }
};

export const vDashboard = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role == "ROLE_CARRIER") {
    try {
      const data = await axiosInstance.get("/api/carrier/dashboard", {});
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  if (user.role == "ROLE_COMPANY") {
    try {
      const data = await axiosInstance.get("/api/company/dashboard", {});
      return data;
    } catch (error) {
      console.log(error);
    }
  }
};

export const dashBoardJobCompany = (data) => axiosInstance.post(`/api/company/dashboard-job`, data);

export const dashBoardJobCarrier = (data) => axiosInstance.post(`/api/carrier/dashboard-job`, data);

// PUBLIC
export const fetchJobDetail = (id) => axiosInstance.get(`/api/public/job/detail/${id}`);
export const getOtpResetPassword = (username) => axiosInstance.get(`/api/auth/verify-user/${username}`);
export const resetPassword = (data) => axiosInstance.post(`/api/auth/reset-password`, data);

export const fetchProvinces = () => axiosInstance.get("/api/general/provinces");
export const fetchDistricts = (data) => axiosInstance.post("/api/general/provinces/districts", data);

export const fetchAreas = async (data) => {
  try {
    const response = await axiosInstance.post("/api/area/list", data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/area/${id}`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editArea = (areaId, data) => axiosInstance.patch(`/api/area/${areaId}/edit`, data);


// SHIPMENT
export const fetchShipmentDetail = (id) => axiosInstance.get(`/api/shipment/detail/${id}`);
export const updateExpenseShipment = (data) => axiosInstance.post(`/api/shipment/${data.shipmentId}/update-expense`, data.data)