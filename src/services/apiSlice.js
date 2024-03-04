import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import { identity } from "lodash";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        // console.log(getState())
        const token = getState().auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    // keepUnusedDataFor: 1,
    tagTypes: [
        "Fleets",
        "Carriers",
        "Trucks",
        "Driver",
        "Jobs",
        "Customers",
        "Rating",
        "Companys",
        "Areas",
        "ChargeFees",
        "IDSender",
        "IDPickup",
        "Area",
        "Unit",
        "TruckType",
        "Expense",
        "Role",
        "User",
    ],
    endpoints: (builder) => ({
        dashboardTotal: builder.query({
            query: (data) => ({
                url: "/api/dashboard/total",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),
        dashboardDelivery: builder.query({
            query: (data) => ({
                url: "/api/dashboard/delivery-order",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),
        dashboardDeliveryOrder: builder.query({
            query: (data) => ({
                url: "/api/dashboard/delivery-order/status",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),

        dashboardDeliveryOrderSiteDC: builder.query({
            query: (data) => ({
                url: "/api/dashboard/delivery-order/site-dc",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),
        dashboardShipment: builder.query({
            query: (data) => ({
                url: "/api/dashboard/shipment/status",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),
        // dashboardDeliveryOrder: builder.query({
        //     query: (data) => ({
        //         url: "/api/dashboard/delivery-order",
        //         method: "POST",
        //         body: data,
        //     }),
        //     providesTags: ["Dashboard"],
        // }),
        // dashboardDeliveryOrderSiteDC: builder.query({
        //     query: (data) => ({
        //         url: "/api/dashboard/delivery-order/site-dc",
        //         method: "POST",
        //         body: data,
        //     }),
        //     providesTags: ["Dashboard"],
        // }),
        // dashboardShipment: builder.query({
        //     query: (data) => ({
        //         url: "/api/dashboard/shipment",
        //         method: "POST",
        //         body: data,
        //     }),
        //     providesTags: ["Dashboard"],
        // }),
        dashboardTruck: builder.query({
            query: (data) => ({
                url: "/api/dashboard/truck",
                method: "POST",
                body: data,
            }),
            providesTags: ["Dashboard"],
        }),
        getShipments: builder.query({
            query: (data) => ({
                url: "/api/shipment/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Shipments"],
        }),
        createShipment: builder.mutation({
            query: (data) => ({
                url: "/api/shipment/create",
                method: "POST",
                body: data,
            }),
            // invalidatesTags: (result, error, arg) => {
            //     if(!error && result){
            //         return ['Shipments']
            //     }
            //     return []
            // },
        }),
        getUnAssignDO: builder.query({
            query: (data) => ({
                url: "/api/rtt/delivery-order/list-unassigned",
                method: "POST",
                body: data,
            }),
            providesTags: ["DeliveryOrder"],
        }),
        getShipmentsOrder: builder.query({
            query: (data) => ({
                url: "/api/shipment/list/shipment-order",
                method: "POST",
                body: data,
            }),
            providesTags: ["Shipments"],
        }),
        getShipmentsExpense: builder.query({
            query: (data) => ({
                url: "/api/shipment/list/shipment-order-expense",
                method: "POST",
                body: data,
            }),
            providesTags: ["Shipments"],
        }),
        // getApproveShipmentsOrder: builder.query({
        //     query: (data) => ({
        //         url: "/api/shipment/list/shipment-order?shipmentStatus="+data.shipmentStatus,
        //         method: "POST",
        //         body: data,
        //     }),
        //     providesTags: ["Shipments"],
        // }),
        getApproveShipmentsOrder: builder.query({
            query: (data) => ({
                url: "/api/shipment/list/approve-shipment-order",
                method: "POST",
                body: data,
            }),
            providesTags: ["Shipments"],
        }),
        getShipmentDetail: builder.query({
            query: (id) => ({
                url: "/api/shipment/detail/"+id,
                method: "GET",
                // body: data,
            }),
            providesTags: ["Shipments"],
        }),
        shipmentUpdateStatus: builder.mutation({
            query: (data) => ({
                url: "/api/shipment/update",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Shipments"],
        }),
        deliveryOrderUpdateStatus: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/delivery-order/update",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["DeliveryOrder"],
        }),
        shipmentGenerateQRCode: builder.mutation({
            query: ({shipmentId, data}) => ({
                url: `/api/shipment/generate-qr/`+shipmentId,
                method: "POST",
                body: data,
            }),
            // invalidatesTags: ["Shipments",],
        }),
        shipmentAssignTruck: builder.mutation({
            query: (data) => ({
                url: "/api/shipment/assign-truck",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Shipments", "Trucks"],
        }),
        shipmentAssignTruckDriverStaff: builder.mutation({
            query: (data) => ({
                url: "/api/shipment/assign",
                method: "POST",
                body: data,
            }),
           invalidatesTags: (result, error, arg) => {
                if(!error && result){
                    return ['Shipments']
                }
                return []
            },
        }),
        shipmentAssignDriver: builder.mutation({
            query: (data) => ({
                url: "/api/shipment/assign-driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Shipments", "Drivers"],
        }),
        addDoToShipment: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/delivery-order/add-to-shipment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["DeliveryOrder"],
        }),
        shipmentAddStaff: builder.mutation({
            query: ({shipmentId, staffIds}) => ({
                url: `/api/shipment/${shipmentId}/add-staff`,
                method: "POST",
                body: {staffIds},
            }),
            invalidatesTags: ["Shipments", "Staff"],
        }),
        shipmentAddExpense: builder.mutation({
            query: ({shipmentId, data}) => ({
                url: `/api/shipment/${shipmentId}/add-expense`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => {
                if(!error && result){
                    return ['Shipments']
                }
                return []
            },
        }),
        shipmentUpdateExpense: builder.mutation({
            query: ({shipmentId, data}) => ({
                url: `/api/shipment/${shipmentId}/update-expense`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => {
                if(!error && result){
                    return ['Shipments']
                }
                return []
            },

            // invalidatesTags: (result, error, arg) => {
            //     console.log(result, error, arg)
            //     return ['Shipments']
            // },
        }),
       
        //
        getFleets: builder.query({
            query: (data) => ({
                url: "/api/group/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Fleets"],
        }),
        addFleet: builder.mutation({
            query: (fleet) => ({
                url: "/api/company/group/add",
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Fleets"],
        }),
        updateFleet: builder.mutation({
            query: (fleet) => ({
                url: "/api/company/group/update",
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Fleets"],
        }),
        updateFleet1: builder.mutation({
            query: (fleet) => ({
                url: "/api/group/update",
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Fleets"],
        }),
        getCarriers: builder.query({
            query: (data) => ({
                url: "/api/company/user/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Carriers"],
        }),
        addCarrier: builder.mutation({
            query: (fleet) => ({
                url: "/api/company/user/add",
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Carriers"],
        }),
        updateCarrier: builder.mutation({
            query: (fleet) => ({
                url: "/api/company/user/update",
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Carriers"],
        }),
        updateCarrier1: builder.mutation({
            query: (fleet) => ({
                url: `/api/carrier/update/${fleet.id}`,
                method: "POST",
                body: fleet,
            }),
            invalidatesTags: ["Carriers"],
        }),
        //staff 
        getStaffs: builder.query({
            query: (data) => ({
                url: "/api/rtt/staff/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Staffs"],
        }),
        getStaffDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/staff/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Staffs"],
        }),
        addStaff: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/staff/add",
                method: "POST",
                body: data,
            }),
        }),
        updateStaff: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/staff/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteStaff: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/staff/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Staffs"],
        }),

        // Delivery status
        getDeliveryStatus: builder.query({
            query: (data) => ({
                url: "/api/delivery-status/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["DeliveryStatus"],
        }),
        getDeliveryStatusDetail: builder.query({
            query: (id) => ({
                url: `/api/delivery-status/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["DeliveryStatus"],
        }),
        addDeliveryStatus: builder.mutation({
            query: (data) => ({
                url: "/api/delivery-status/add",
                method: "POST",
                body: data,
            }),
        }),
        updateDeliveryStatus: builder.mutation({
            query: (data) => ({
                url: `/api/delivery-status/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteDeliveryStatus: builder.mutation({
            query: (id) => ({
                url: `/api/delivery-status/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DeliveryStatus"],
        }),

        // Delivery type
        getDeliveryType: builder.query({
            query: (data) => ({
                url: "/api/rtt/delivery-type/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["DeliveryType"],
        }),
        getDeliveryTypeDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/delivery-type/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["DeliveryType"],
        }),
        addDeliveryType: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/delivery-type/add",
                method: "POST",
                body: data,
            }),
        }),
        updateDeliveryType: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/delivery-type/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteDeliveryType: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/delivery-type/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DeliveryType"],
        }),

        // Document type
        getDocumentType: builder.query({
            query: (data) => ({
                url: "/api/rtt/document-type/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["DocumentType"],
        }),
        getDocumentTypeDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/document-type/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["DocumentType"],
        }),
        addDocumentType: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/document-type/add",
                method: "POST",
                body: data,
            }),
        }),
        updateDocumentType: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/document-type/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteDocumentType: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/document-type/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DocumentType"],
        }),

        // ID Pickup
        getIDPickup: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-pickup/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["IDPickup"],
        }),
        getIDPickupDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-pickup/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["IDPickup"],
        }),
        addIDPickup: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-pickup/add",
                method: "POST",
                body: data,
            }),
        }),
        updateIDPickup: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-pickup/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteIDPickup: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-pickup/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["IDPickup"],
        }),

        // ID Sender
        getIDSender: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-sender/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["IDSender"],
        }),
        getIDSenderDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-sender/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["IDSender"],
        }),
        addIDSender: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-sender/add",
                method: "POST",
                body: data,
            }),
            providesTags: ["IDSender"],
        }),
        updateIDSender: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-sender/update/${data.id}`,
                method: "POST",
                body: data,
            }),
            providesTags: ["IDSender"],
        }),
        deleteIDSender: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-sender/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["IDSender"],
        }),

        // ID SiteDC
        getIDSiteDC: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-site/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["IDSiteDC"],
        }),
        getIDSiteDCDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-site/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["IDSiteDC"],
        }),
        addIDSiteDC: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-site/add",
                method: "POST",
                body: data,
            }),
        }),
        updateIDSiteDC: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-site/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteIDSiteDC: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-site/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["IDSiteDC"],
        }),

         //truck TYPE 
         getTruckType: builder.query({
            query: (data) => ({
                url: "/api/rtt/car-characteristic/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["TruckType"],
        }),
        getTruckTypeDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/car-characteristic/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["TruckType"],
        }),
        addTruckType: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/car-characteristic/add",
                method: "POST",
                body: data,
            }),
        }),
        updateTruckType: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/car-characteristic/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteTruckType: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/car-characteristic/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TruckType"],
        }),

         //EXPENSE
        getExpense: builder.query({
            query: (data) => ({
                url: "/api/rtt/shipment-expense/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Expense"],
        }),
        getExpenseDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/shipment-expense/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Expense"],
        }),
        addExpense: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/shipment-expense/add",
                method: "POST",
                body: data,
            }),
        }),
        updateExpense: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/shipment-expense/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/shipment-expense/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Expense"],
        }),

        // TYPE OF CARGO
        getTypeOfCargo: builder.query({
            query: (data) => ({
                url: "/api/rtt/type-of-cargo/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["TypeOfCargo"],
        }),
        getTypeOfCargoDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/type-of-cargo/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["TypeOfCargo"],
        }),
        addTypeOfCargo: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/type-of-cargo/add",
                method: "POST",
                body: data,
            }),
        }),
        updateTypeOfCargo: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/type-of-cargo/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteTypeOfCargo: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/type-of-cargo/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TypeOfCargo"],
        }),
        
        // UNIT
        getUnit: builder.query({
            query: (data) => ({
                url: "/api/rtt/unit/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Unit"],
        }),
        getUnitDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/unit/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Unit"],
        }),
        addUnit: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/unit/add",
                method: "POST",
                body: data,
            }),
        }),
        updateUnit: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/unit/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteUnit: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/unit/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Unit"],
        }),

         // ROLE
         getRole: builder.query({
            query: (data) => ({
                url: "/api/rtt/role/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Role"],
        }),
        getRoleDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/role/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Role"],
        }),
        addRole: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/role/add",
                method: "POST",
                body: data,
            }),
        }),
        updateRole: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/role/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/role/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        }),

         // USER
         getUser: builder.query({
            query: (data) => ({
                url: "/api/rtt/user/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["User"],
        }),
        getUserDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/user/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        addUser: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/user/add",
                method: "POST",
                body: data,
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/user/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        unlockUser: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/user/unlock/${id}`,
                method: "POST",
                // body: data,
            }),
        }),
        changePasswordUser: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/user/change-password`,
                method: "POST",
                body: data,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/user/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),

        // AREA
        getIDAreaMaster: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-area-master/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Area"],
        }),
        getIDAreaMasterDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-area-master/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Area"],
        }),
        addIDAreaMaster: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-area-master/add",
                method: "POST",
                body: data,
            }),
        }),
        updateIDAreaMaster: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-area-master/update/${data.areaRttId}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteIDAreaMaster: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-area-master/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Area"],
        }),

        // ID DELIVERY SHIP TO
        getIDDeliveryShipTo: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-delivery-ship-to/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["IDDeliveryShipTo"],
        }),
        getIDDeliveryShipToDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-delivery-ship-to/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["IDDeliveryShipTo"],
        }),
        addIDDeliveryShipTo: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-delivery-ship-to/add",
                method: "POST",
                body: data,
            }),
        }),
        updateIDDeliveryShipTo: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-delivery-ship-to/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteIDDeliveryShipTo: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-delivery-ship-to/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["IDDeliveryShipTo"],
        }),
        // CALCULATION ORDER
        getCaculationOrder: builder.query({
            query: (data) => ({
                url: "/api/rtt/calculation-order/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["CaculationOrder"],
        }),
        getCaculationOrderDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/calculation-order/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["CaculationOrder"],
        }),
        addCaculationOrder: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/calculation-order/add",
                method: "POST",
                body: data,
            }),
        }),
        updateCaculationOrder: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/calculation-order/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteCaculationOrder: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/calculation-order/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CaculationOrder"],
        }),

        //COMPANY
        getRttCompany: builder.query({
            query: (data) => ({
                url: "/api/rtt/id-company/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Companys"],
        }),
        getRttCompanyDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/id-company/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Companys"],
        }),
        addRttCompany: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/id-company/add",
                method: "POST",
                body: data,
            }),
        }),
        updateRttCompany: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/id-company/update/${data.id}`,
                method: "POST",
                body: data,
            }),
        }),
        deleteRttCompany: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/id-company/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Companys"],
        }),

        

        // TRuck
        getTrucks: builder.query({
            query: (data) => ({
                url: "/api/rtt/truck/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Trucks"],
        }),
        getTruckDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/truck/detail/${id}`,
                method: "GET",
            }),
            providesTags: ["Trucks"],
        }),
        addTruck: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/truck/add",
                method: "POST",
                body: data,
            }),
        }),
        updateTruck: builder.mutation({
            query: (data) => ({
                url: `/api/rtt/truck/update/${data.id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteTruck: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/truck/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trucks"],
        }),
        getTrucksCompany: builder.query({
            query: (data) => ({
                url: "/api/company/truck/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["TrucksCompany"],
        }),
        getTrucksAdmin: builder.query({
            query: (data) => ({
                url: "/api/device/truck/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["TrucksAdmin"],
        }),
        getDrivers: builder.query({
            query: (data) => ({
                url: "/api/rtt/driver/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Drivers"],
        }),
        getDriversDetail: builder.query({
            query: (id) => ({
                url: `/api/rtt/driver/detail/${id}`,
                method: "GET",
                // body: data,
            }),
            providesTags: ["Drivers"],
        }),
        addDriver: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/driver/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Drivers"],
        }),
        updateDriver: builder.mutation({
            query: (data) => ({
                url: "/api/rtt/driver/update/"+data.id,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Drivers"],
        }),
        deleteDriver: builder.mutation({
            query: (id) => ({
                url: `/api/rtt/driver/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Drivers"],
        }),
        getDriversCompany: builder.query({
            query: (data) => ({
                url: "/api/company/driver/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["DriversCompany"],
        }),
        getJobs: builder.query({
            query: (data) => ({
                url: "/api/job/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Jobs"],
        }),
        addJob: builder.mutation({
            query: (data) => ({
                url: "/api/job/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Jobs"],
        }),
        assignDriver: builder.mutation({
            query: (data) => ({
                url: "/api/job/rtt/assign-driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Jobs", "Calendar"],
        }),
        assignJob: builder.mutation({
            query: (data) => ({
                url: "/api/job/rtt/assign-driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Jobs", "Calendar"],
        }),
        getFleetCarriers: builder.query({
            query: (data) => ({
                url: "/api/group/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["FleetCarriers"],
        }),
        getCalendarTruck: builder.query({
            query: (data) => ({
                url: "/api/truck/list/job-number",
                method: "POST",
                body: data,
            }),
            providesTags: ["Calendar"],
        }),
        getCustomers: builder.query({
            query: (data) => ({
                url: "/api/customer/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Customers"],
        }),
        addCustomer: builder.mutation({
            query: (data) => ({
                url: "/api/customer/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Customers"],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/api/customer/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Customers"],
        }),
        updateCustomer: builder.mutation({
            query: (data) => ({
                url: "/api/customer/update",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Customers"],
        }),
        getDevices: builder.query({
            query: (data) => ({
                url: "/api/device/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Devices"],
        }),
        addDevice: builder.mutation({
            query: (data) => ({
                url: "/api/device/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Devices"],
        }),
        deleteDevice: builder.mutation({
            query: (id) => ({
                url: `/api/device/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Devices"],
        }),
        getSalesOrder: builder.query({
            query: (data) => ({
                url: "/api/sales-order/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["SalesOrder"],
        }),
        addSalesOrder: builder.mutation({
            query: (data) => ({
                url: "/api/sales-order/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SalesOrder"],
        }),
        deleteSalesOrder: builder.mutation({
            query: (id) => ({
                url: `/api/sales-order/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SalesOrder"],
        }),
        updateSalesOrder: builder.mutation({
            query: (data) => ({
                url: "/api/sales-order/update",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SalesOrder"],
        }),
        getRating: builder.query({
            query: (data) => ({
                url: "/api/carrier/rating/job/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Rating"],
        }),
        addRating: builder.mutation({
            query: (data) => ({
                url: "/api/carrier/rating/job",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Rating"],
        }),
        
        getCompanys: builder.query({
            query: (data) => ({
                url: "/api/admin/company/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["Companys"],
        }),
        addCompany: builder.mutation({
            query: (data) => ({
                url: "/api/company/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Companys"],
        }),
        // getAreas: builder.query({
        //     query: (data) => ({
        //         url: "/api/area/list",
        //         method: "POST",
        //         body: data,
        //     }),
        //     providesTags: ["Areas"],
        // }),
        // addArea: builder.mutation({
        //     query: (data) => ({
        //         url: "/api/area/add",
        //         method: "POST",
        //         body: data,
        //     }),
        //     invalidatesTags: ["Areas"],
        // }),
        // deleteArea: builder.mutation({
        //     query: (id) => ({
        //         url: `/api/area/${id}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["Areas"],
        // }),
        // deleteAreaDriver: builder.mutation({
        //     query: ({ areaId, areaDrivers }) => ({
        //         url: `/api/area/${areaId}/edit`,
        //         method: "PATCH",
        //         body: { areaDrivers },
        //     }),
        //     invalidatesTags: ["Areas"],
        // }),
        getChargeFees: builder.query({
            query: (data) => ({
                url: "/api/charge-fee/list",
                method: "POST",
                body: data,
            }),
            providesTags: ["ChargeFees"],
        }),
        addChargeFee: builder.mutation({
            query: (data) => ({
                url: "/api/charge-fee/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ChargeFee"],
        }),
        deleteChargeFee: builder.mutation({
            query: (id) => ({
                url: `/api/charge-fee/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ChargeFee"],
        }),

        //Report
        getReportShipment: builder.query({
            query: (data) => ({
                url: "/api/report/shipment",
                method: "POST",
                body: data,
            }),
            providesTags: ["Report"],
        }),
        getReportShipmentStaff: builder.query({
            query: (data) => ({
                url: "/api/report/shipment-staff",
                method: "POST",
                body: data,
            }),
            providesTags: ["Report"],
        }),
        getReportShipmentExpense: builder.query({
            query: (data) => ({
                url: "/api/report/shipment-expense",
                method: "POST",
                body: data,
            }),
            providesTags: ["Report"],
        }),

    }),
});

export const {
    //Report
    useLazyGetReportShipmentQuery,
    useLazyGetReportShipmentStaffQuery,
    useLazyGetReportShipmentExpenseQuery,

    //Dashboard
    useLazyDashboardDeliveryQuery,
    useLazyDashboardDeliveryOrderQuery,
    useLazyDashboardDeliveryOrderSiteDCQuery,
    useLazyDashboardShipmentQuery,
    useLazyDashboardTruckQuery,
    useLazyDashboardTotalQuery,

    //Shipment
    useCreateShipmentMutation,
    useGetShipmentsQuery,
    useGetShipmentsOrderQuery,
    useLazyGetShipmentsOrderQuery,
    useLazyGetUnAssignDOQuery,
    useGetShipmentsExpenseQuery,
    useGetApproveShipmentsOrderQuery,
    useGetShipmentDetailQuery,
    useLazyGetShipmentDetailQuery,
    useShipmentGenerateQRCodeMutation,
    useShipmentAssignTruckMutation,
    useShipmentAssignDriverMutation,
    useShipmentAssignTruckDriverStaffMutation,
    useShipmentAddStaffMutation,
    useShipmentAddExpenseMutation,
    useShipmentUpdateExpenseMutation,
    useDeliveryOrderUpdateStatusMutation,
    useAddDoToShipmentMutation,
    useShipmentUpdateStatusMutation,
    //
    useGetFleetsQuery,
    useAddFleetMutation,
    useUpdateFleetMutation,
    useUpdateFleet1Mutation,
    useGetCarriersQuery,
    useAddCarrierMutation,
    useUpdateCarrierMutation,
    useUpdateCarrier1Mutation,
    useGetTrucksQuery,
    useLazyGetTrucksQuery,
    useGetTruckDetailQuery,
    useAddTruckMutation,
    useUpdateTruckMutation,
    useDeleteTruckMutation,
    useGetStaffsQuery,
    useLazyGetStaffsQuery,
    useGetStaffDetailQuery,
    useAddStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
    useGetTrucksCompanyQuery,
    useGetDriversQuery,
    useLazyGetDriversQuery,
    useGetDriversDetailQuery,
    useAddDriverMutation,
    useUpdateDriverMutation,
    useDeleteDriverMutation,
    useGetDriversCompanyQuery,
    useGetJobsQuery,
    useAddJobMutation,
    useAssignDriverMutation,
    useAssignJobMutation,
    useGetFleetCarriersQuery,
    useGetCalendarTruckQuery,
    useGetCustomersQuery,
    useAddCustomerMutation,
    useDeleteCustomerMutation,
    useUpdateCustomerMutation,
    useGetDevicesQuery,
    useAddDeviceMutation,
    useDeleteDeviceMutation,
    useGetTrucksAdminQuery,
    useGetSalesOrderQuery,
    useAddSalesOrderMutation,
    useDeleteSalesOrderMutation,
    useUpdateSalesOrderMutation,
    useGetRatingQuery,
    useAddRatingMutation,
    useGetCompanysQuery,
    useAddCompanyMutation,
    // useGetAreasQuery,
    // useAddAreaMutation,
    // useDeleteAreaMutation,
    // useDeleteAreaDriverMutation,
    useGetChargeFeesQuery,
    useAddChargeFeeMutation,
    useDeleteChargeFeeMutation,
    //
    useGetDeliveryStatusQuery,
    useGetDeliveryStatusDetailQuery,
    useAddDeliveryStatusMutation,
    useUpdateDeliveryStatusMutation,
    useDeleteDeliveryStatusMutation,
    //
    useGetDeliveryTypeQuery,
    useGetDeliveryTypeDetailQuery,
    useAddDeliveryTypeMutation,
    useUpdateDeliveryTypeMutation,
    useDeleteDeliveryTypeMutation,
    //
    useGetDocumentTypeQuery,
    useGetDocumentTypeDetailQuery,
    useAddDocumentTypeMutation,
    useUpdateDocumentTypeMutation,
    useDeleteDocumentTypeMutation,
    //
    useGetIDPickupQuery,
    useGetIDPickupDetailQuery,
    useAddIDPickupMutation,
    useUpdateIDPickupMutation,
    useDeleteIDPickupMutation,
    //
    useGetIDSenderQuery,
    useGetIDSenderDetailQuery,
    useAddIDSenderMutation,
    useUpdateIDSenderMutation,
    useDeleteIDSenderMutation,
    //
    useGetIDSiteDCQuery,
    useGetIDSiteDCDetailQuery,
    useAddIDSiteDCMutation,
    useUpdateIDSiteDCMutation,
    useDeleteIDSiteDCMutation,
    //
    useGetTypeOfCargoQuery,
    useGetTypeOfCargoDetailQuery,
    useAddTypeOfCargoMutation,
    useUpdateTypeOfCargoMutation,
    useDeleteTypeOfCargoMutation,
    //
    useGetUnitQuery,
    useGetUnitDetailQuery,
    useAddUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
    //
    useGetIDAreaMasterQuery,
    useGetIDAreaMasterDetailQuery,
    useAddIDAreaMasterMutation,
    useUpdateIDAreaMasterMutation,
    useDeleteIDAreaMasterMutation,
    //
    useGetIDDeliveryShipToQuery,
    useGetIDDeliveryShipToDetailQuery,
    useAddIDDeliveryShipToMutation,
    useUpdateIDDeliveryShipToMutation,
    useDeleteIDDeliveryShipToMutation,
    //
    useGetCaculationOrderQuery,
    useGetCaculationOrderDetailQuery,
    useAddCaculationOrderMutation,
    useUpdateCaculationOrderMutation,
    useDeleteCaculationOrderMutation,
     //
     useGetRttCompanyQuery,
     useGetRttCompanyDetailQuery,
     useAddRttCompanyMutation,
     useUpdateRttCompanyMutation,
     useDeleteRttCompanyMutation,

     //
     useGetTruckTypeQuery,
     useGetTruckTypeDetailQuery,
     useAddTruckTypeMutation,
     useUpdateTruckTypeMutation,
     useDeleteTruckTypeMutation,
     //

     useGetExpenseQuery,
     useGetExpenseDetailQuery,
     useAddExpenseMutation,
     useUpdateExpenseMutation,
     useDeleteExpenseMutation,

     //
     useGetRoleQuery,
     useGetRoleDetailQuery,
     useAddRoleMutation,
     useUpdateRoleMutation,
     useDeleteRoleMutation,

     //
     useGetUserQuery,
     useGetUserDetailQuery,
     useAddUserMutation,
     useUnlockUserMutation,
     useChangePasswordUserMutation,
     useUpdateUserMutation,
     useDeleteUserMutation,
} = apiSlice;
