import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import JobDetailByDay from "../components/Job/Calendar/JobDetailByDay";
import { ROLES } from "../constants/constants";
import { HinoConnect, LoginLayout, MainLayout } from "../layouts";
import {
//   CarrierManagement,
//   ChargeFeeManagement,
//   CompanyManagement,
//   CustomerManagement,
  Dashboard,
//   DeviceManagement,
  DriverManagement,
//   FleetManagement,
  History,
  Home,
  Jobs,
  Map,
  NotFound,
  PermissionDenied,
  Profile,
  Report,
  RoutingSample,
//   SalesOrderManagement,
  Tracking,
  TrackingOrder,
  TruckManagement,
} from "../pages";
import ProtectedRoutes from "./ProtectedRoutes";
import StaffManagement from "../pages/StaffManagement";
import DeliveryStatusManagement from "../pages/DeliveryStatusManagement";
import DeliveryTypeManagement from "../pages/DeliveryTypeManagement";
import DocumentTypeManagement from "../pages/DocumentTypeManagement";
import IDPickupManagement from "../pages/IDPickupManagement";
import IDSenderManagement from "../pages/IDSenderManagement";
import IDSiteDCManagement from "../pages/IDSiteDCManagement";
import MasterData from "../pages/MasterData";
import UnitManagement from "../pages/UnitManagement";
import IDDeliveryShipToManagement from "../pages/IDDeliveryShipToManagement";
import TypeOfCargoManagement from "../pages/TypeOfCargoManagement";
import OrderTracking from "../pages/OrderTracking";
import ShipmentManager from "../pages/ShipmentManager";
import SiteLocation from "../pages/SiteLocationManager";
import SiteLocationMapView from "../pages/SiteLocationMapView";
import PlanningManagement from "../pages/PlanningManager";
import CaculationOrderManagement from "../pages/CaculationOrderManagement";
import IDAreaMasterManagement from "../pages/IDAreaMasterManagement";
import TruckTypeManagement from "../pages/TruckTypeManagement";
import ResetPasswordLayout from "../layouts/ResetPasswordLayout";
import ApprovedShipmentManager from "../pages/ApprovedShipmentManager";
import ClosedShipmentManager from "../pages/ClosedShipmentManager";
import CompanyManagement from "../pages/CompanyManagement";
import ExpenseManager from "../pages/ExpenseManager";
import RoleManagement from "../pages/RoleManagement";
import UserManagement from "../pages/UserManagement";
import ReportStaff from "../pages/ReportStaff";
import ReportShipment from "../pages/ReportShipment";
import ReportExpense from "../pages/ReportExpense";
import UnAssignDOManagement from "../pages/UnAssignDOManagement";
import DashboardNew from "../pages/dashboardNew";

const Routers = () => {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="login" element={<LoginLayout />} />
      <Route path="reset-password" element={<ResetPasswordLayout />} />
      <Route path="hinoconnect" element={<HinoConnect />} />
      <Route path="job-detail/:id" element={<TrackingOrder />} />
      <Route path="denied" element={<PermissionDenied />} />

      {/* Proteced routes */}
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard-new" element={ <DashboardNew />} />
          //
          <Route path="dashboard/truck" element={<TruckManagement />} />
          <Route path="dashboard/drive" element={<DriverManagement />} />
          <Route path="dashboard/staff" element={<StaffManagement />} />
          <Route path="dashboard/DC" element={<IDSiteDCManagement />} />
          //
          <Route path="trucks" element={<TruckManagement />} />
          <Route path="approved-shipment" element={<ApprovedShipmentManager />} />
          <Route path="closed-shipment" element={<ClosedShipmentManager />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="expense" element={<ExpenseManager />} />
          {/* <Route path="planning" element={<PlanningManagement />} /> */}
          <Route path="unassign-do" element={<UnAssignDOManagement />} />
          <Route path="delivery-type" element={<TruckManagement />} />
          <Route path="map-job" element={<TruckManagement />} />
          <Route path="reports" element={<Report />} />
          <Route path="site-location" element={<SiteLocation />} />
          <Route path="site-location-map" element={<SiteLocationMapView />} />
          <Route path="tracking-shipment" element={<OrderTracking />} />
          {/* <Route path="working" element={<OrderTracking />} />
          <Route path="checkin" element={<OrderTracking />} />
          <Route path="shipment-order-job" element={<OrderTracking />} /> */}
          <Route path="user" element={<UserManagement />} />
          <Route path="/" element={<Navigate replace to="dashboard" />} />
          <Route path="home" element={<Home />}>
            <Route path="/home" element={<Navigate replace to="dashboard" />} />
            <Route path="profile" element={<Profile />} />
            {/* <Route path="customers" element={<CustomerManagement />} /> */}
            {/* <Route path="sales-order" element={<SalesOrderManagement />} /> */}
            {/* <Route path="devices" element={<DeviceManagement />} /> */}
            {/* <Route path="charge-fee" element={<ChargeFeeManagement />} /> */}


          </Route>

          {/* COMPANY */}
          <Route
            element={
              <ProtectedRoutes allowedRole={[ROLES.Company, ROLES.Admin]} />
            }
          >
            {/* <Route path="branch" element={<FleetManagement />} />
            <Route path="user" element={<CarrierManagement />} /> */}
          </Route>

          {/* CARRIER */}
          <Route
            element={
              <ProtectedRoutes
                allowedRole={[ROLES.Admin, ROLES.Company, ROLES.Carrier]}
              />
            }
          >
            <Route path="trucks" element={<TruckManagement />} />

            <Route path="drivers" element={<DriverManagement />} />
            <Route path="staff" element={<StaffManagement />} />

          </Route>

          <Route path="reports" element={<MasterData />}>
            <Route path="/reports" element={<Navigate replace to="expen-report" />} />
            <Route path="shipment" element={<ReportShipment />} />
            <Route path="staff" element={<ReportStaff />} />
            <Route path="expen-report" element={<ReportExpense />} />
          
          </Route>
          <Route path="master-data" element={<MasterData />}>
            <Route path="/master-data" element={<Navigate replace to="staff" />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="truck" element={<TruckManagement />} />
            <Route path="truck-type" element={<TruckTypeManagement />} />
            <Route path="driver" element={<DriverManagement />} />
            <Route path="delivery-status" element={<DeliveryStatusManagement />} />
            <Route path="delivery-type" element={<DeliveryTypeManagement />} />
            <Route path="document-type" element={<DocumentTypeManagement />} />
            <Route path="pickup" element={<IDPickupManagement />} />
            <Route path="sender" element={<IDSenderManagement />} />
            <Route path="site" element={<IDSiteDCManagement />} />
            <Route path="area" element={<IDAreaMasterManagement />} />
            <Route path="type-of-cargo" element={<TypeOfCargoManagement />} />
            <Route path="unit" element={<UnitManagement />} />
            <Route path="calculation-order" element={<CaculationOrderManagement />} />
            <Route path="delivery-ship-to" element={<IDDeliveryShipToManagement />} />
            {/* <Route path="company" element={<CompanyManagement />} /> */}
            <Route path="role" element={<RoleManagement />} />
          </Route>
        </Route>


        <Route path="calendar" element={<Jobs />} />
        {/* <Route path="jobs-calendar" element={<JobDetailByDay />} /> */}
        <Route path="map" element={<Map />} />
        {/* <Route path="shipment" element={<ShipmentManager />} /> */}
        <Route path="order" element={<History />} />
        <Route path="order/:id" element={<History />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="route-planning" element={<RoutingSample />} />
      </Route>




      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppRoute))