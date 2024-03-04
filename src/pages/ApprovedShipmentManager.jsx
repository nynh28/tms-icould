import LinearProgress from "@mui/material/LinearProgress";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useCreateShipmentMutation, useGetShipmentsOrderQuery, useLazyGetShipmentsOrderQuery, useShipmentUpdateStatusMutation, } from "../services/apiSlice";

import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import { Checkbox, CircularProgress, Divider, TextField } from "@mui/material";
import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaEdit, FaPlus } from "react-icons/fa";
import DetailTruck from "../components/Truck/DetailTruck";
import { FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import FilterRightBar from "../components/FilterRightBar";
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineCheckBox } from "react-icons/md";
import { fetchShipmentDetail, uploadExcelDO } from "../api";
import ImportFromExcel from "../components/Job/ImportFromExcel";
import DetailPlanning from "../components/Planning/DetailPlanning";

import DetailShipment from "../components/Planning/DetailShipment";
import { FaCalendarCheck } from "react-icons/fa";
import { TbCalendarExclamation } from "react-icons/tb";
import { MdCancelPresentation } from "react-icons/md";
import { TbCalendarX } from "react-icons/tb";
import { TbCalendarCheck } from "react-icons/tb";
import { TbCalendarStats } from "react-icons/tb";
import FilterApprovedShipment from "../components/Planning/FilterApprovedShipment";
import AddExpense from "../components/Job/AddExpense";
import ChangeStatus from "../components/Planning/ChangeStatus";
import dayjs from "dayjs";
import { shipmentStatus } from "../constants/constants";
import { toast } from "react-hot-toast";
import CloseShipment from "../components/Planning/CloseShipment";
import { toggleExpenseForm, selectedShipmentAddDO, setSelectedShipment } from "../features/shipment/shipmentSlice";
import AssignTruckDriver from "../components/AssignTruckDriver";
import GenerateQRCode from "../components/Planning/GenerateQRCode";
import AddShipmentForm from "../components/ApproveShipment/AddShipment";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane'
// import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

// import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
// import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const ApprovedShipmentManager = () => {

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState({ groupId: null, truckType: null, plateLicence: null, brand: null });
    const [openEdit, setOpenEdit] = useState(false);
    const [openCloseShipment, setOpenCloseShipment] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();

    const [openFormAddShipment, setOpenFormAddShipment] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [showAssignTruck, setShowAssignTruck] = useState(false)
    const [showAssignDriver, setShowAssignDriver] = useState(false)
    const [showAddStaff, setShowAddStaff] = useState(false)
    const [openModalQrCode, setOpenModalQrCode] = useState(false)
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [selectedShipment, setSelectedShipmentInform] = useState(null);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        shipmentStatus: [1, 2, 3, 4, 5, 6],
        dateFrom: moment().subtract(1, 'months').startOf('day'),
        dateTo: moment().endOf('day'),
    });
    const dispatch = useDispatch()

    const [fetchData, { data, isLoading, isFetching, isSuccess }] = useLazyGetShipmentsOrderQuery();

    const updateFilter = (value) => {
        fetchData({ ...criterias, ...value })
        setCriterias({ ...criterias, ...value });
    };

    useEffect(e => {
        if (selectedRow && selectedRow.id && selectedRow.type == 'SM') {
            dispatch(setSelectedShipment(selectedRow))
        }
    }, [selectedRow])

    const refetch = () => {
        fetchData({ ...criterias, page: 0, })
    }

    useEffect(_ => {
        fetchData(criterias)
    }, [])

    useEffect(_ => {
        if (!isFetching) {
            setTimeout(_ => {
                setTriggleFiter(false)

            }, 500)
        }
    }, [isFetching])

    const gridRef = useRef();




    useEffect(_ => {
        let list = []
        if (data && data?.content?.length > 0) {
            let i = 1
            // console.log(data.content)
            data.content.forEach((dt, index) => {
                // console.log(dt)
                list.push({ ...dt, key: dt.shipmentId, type: 'SM' })
                if (dt.deliveryOrderList) {
                    let DOList = dt.deliveryOrderList.map(doItem => {
                        let a = ({
                            ...doItem,
                            index: i,
                            type: 'DO',
                            createdAt: dt.createdAt,
                            planningStatus: Math.floor(Math.random() * 4) + 1,
                            key: doItem.invoiceNo
                        })
                        i++;
                        return a
                    });
                    list = list.concat(DOList)
                }

            })

        }
        // console.log(list)
        settableData(list)

    }, [data?.content])


    const getPrevRow = () => {
        if (selectedRow && selectedRow.index) {
            let findIndex = tableData.findIndex(i => i.index == selectedRow.index - 1)
            if (findIndex > 0) {
                setSelectedRow(tableData[findIndex])
            }
        }
    }
    const getNextRow = () => {
        if (selectedRow && selectedRow.index) {
            let findIndex = tableData.findIndex(i => i.index == selectedRow.index + 1)
            if (findIndex >= 0 && findIndex < tableData.length) {
                setSelectedRow(tableData[findIndex])
            }
        }
    }

    const statusShipment = (status) => {
        let inf = shipmentStatus[status - 1];
        if (inf) {
            return (
                <span className={`border ml-2 px-[10px] py-[3px]`} style={{ borderColor: inf.color, color: inf.color }}>{inf.value}</span>
            )
        }
    }

    const showDetailRow = (params) => {
        // console.log(params)
        setSelectedRow(params.row)
        if (params.row.type == 'DO') {
            if (enableCheckbox) {
                setSelectedCheckbox(prevState => ({
                    ...prevState,
                    [params.id]: prevState[params.id] ? !prevState[params.id] : true
                }))

            } else {
                setShowDetail(true)
            }
            // console.log(params)
        }
        // setSelectedRowID(params.id)
    }


    const getPlanStatus = (plan) => {
        if (plan && plan.id) {
            let dueDate = dayjs(plan.dueDate)
            if (plan.status == 9) {
                return (
                    <div className="flex gap-2 items-center text-[#cc0b0b]">
                        <TbCalendarX className="w-5 h-5" />
                        <span>Delivery Reject</span>
                    </div>
                )
            }
            if (dayjs().isBefore(dueDate)) {
                if (plan.status == 8) {
                    return (
                        <div className="flex gap-2 items-center text-[#00b11f]">
                            <TbCalendarCheck className="w-5 h-5" />
                            <span>Arrived on time</span>
                        </div>
                    )
                }
            } else {
                if (plan.status == 8) {
                    return (
                        <div className="flex gap-2 items-center text-[#5f6368]">
                            <TbCalendarStats className="w-5 h-5" />
                            <span>Not on time</span>
                        </div>
                    )
                } else if (plan.status < 7) {
                    return (
                        <div className="flex gap-2 items-center text-[#c3ad00]">
                            <TbCalendarExclamation className="w-5 h-5" />
                            <span>Expected to be late</span>
                        </div>
                    )
                } else if (plan.status == 7) {
                    return (
                        <div className="flex gap-2 items-center text-[#cc0b0b]">
                            <TbCalendarExclamation className="w-5 h-5" />
                            <span>Arrived late</span>
                        </div>
                    )
                }
            }

        }
        return '-'
    }

    const columns = [
        {
            field: "no",
            headerName: t("#No"),
            // headerClass: 'pl-[30px]',
            //   cellClassName: 'pl-[30px]',
            //   headerAlign: 'center',
            //   align: 'center',
            colSpan: ({ row }) => {
                return row.type == 'SM' ? 55 : 1
            },
            renderCell: ({ row }) => (
                <div>
                    {row.type == 'SM'
                        ? (
                            <div className="flex items-center">
                                <div className="text-primary-900 underline font-semibold cursor-pointer" onClick={() => {
                                    setSelectedRow(row)
                                    setShowDetail(true)
                                }}>
                                    {row.key}
                                </div>
                                <div className="ml-3 flex items-center">
                                    <span className="mr-2">
                                        ( {t("driver")}: {row.driverName} / {t("truck")}: {row.plateLicense}  )
                                    </span>
                                    {
                                        statusShipment(row.shipmentStatus)
                                    }
                                    {row.shipmentStatus == 1 && (<div className="ml-4 flex">
                                        <button className="flex mr-3 items-center gap-1 btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => { dispatch(selectedShipmentAddDO(row)); navigate('/unassign-do') }}> Add DO</button>
                                        {row.deliveryOrderList.length > 0 && <>
                                            <button className="flex items-center gap-1 btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => { setShowAssignDriver(true); setSelectedShipmentInform(row); setShowDetail(false) }}> Assign Driver & Truck</button>
                                            <button className="flex ml-3 items-center gap-1 btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => { setSelectedShipmentInform(row); setOpenModalQrCode(true) }}> Generate Qr</button>
                                        </>
                                        }
                                    </div>)}
                                    {  ( row?.totalLoadingBox !== 0 || row?.totalLoadingWeight !== 0 || row?.totalLoadingLiter !== 0 || row?.totalLoadingCbm !== 0 || row?.totalLoadingTarget !== 0) &&
                                        <span className="ml-4 font-medium text-[13px] ">Total:</span>
                                    }
                                    {
                                        row?.totalLoadingBox !== 0 &&
                                        <><span className="ml-4 font-medium text-[13px]">Loading Box -
                                            <span className="font-normal">{" " + row?.totalLoadingBox.toFixed(2)}</span>
                                        </span></>
                                    }
                                    {
                                        row?.totalLoadingWeight !== 0 &&
                                        (<span className="ml-4 font-medium text-[13px]">Loading Weight -
                                            <span className="font-normal"> {" " + row?.totalLoadingWeight.toFixed(2)}</span>
                                        </span>)
                                    }
                                    {row?.totalLoadingLiter !== 0 &&
                                        (<span className="ml-4 font-medium text-[13px]">Loading Liter -
                                            <span className="font-normal"> {" " + row?.totalLoadingLiter.toFixed(2)}</span>
                                        </span>)
                                    }
                                    {row?.totalLoadingCbm !== 0 &&
                                        (<span className="ml-4 font-medium text-[13px]">Loading CBM -
                                            <span className="font-normal">{" " + row?.totalLoadingCbm.toFixed(2)}</span>
                                        </span>)
                                    }
                                    {row?.totalLoadingTarget !== 0 &&
                                        (<span className="ml-4 font-medium text-[13px]">Loading Target -
                                            <span className="font-normal">{" " + row?.totalLoadingTarget.toFixed(2)}</span>
                                        </span>)
                                    }
                                </div>
                            </div>
                        )
                        : (
                            <div>
                                {
                                    enableCheckbox && (
                                        <Checkbox
                                            sx={{
                                                '&.MuiCheckbox-root': { padding: 0 },
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                            }}
                                            className="mr-2"
                                            checked={selectedCheckbox[row.invoiceNo] || false} readOnly />
                                    )
                                }
                                {row.index}
                                {/* <input type="checkbox" hidden={!enableCheckbox} checked={selectedCheckbox[row.invoiceNo] || false} readOnly={true}/> {row.index} */}
                            </div>
                        )}
                </div>
            ),
            cellClassName: ({ row }) => row.type == 'SM' ? 'bg-[#f8f9fa]' : '',

            width: 80,
            sortable: false,
        },
        {
            field: "companyId",
            headerName: t("idCompany"),
            minWidth: 100,
            //   headerAlign: 'center',
            //
            sortable: false, align: 'center',
        },
        {
            field: "branchId",
            headerName: t("idSiteDC"),
            minWidth: 150,


            sortable: false,
        },
        // {
        //     field: "senderId",
        //     headerName: t("idSender"),
        //     minWidth: 150,

        // },
        {
            field: "senderName",
            headerName: t("senderName"),
            minWidth: 300,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "pickupId",
            headerName: t("idPickup"),
            minWidth: 80,

        },
        //name pickup point
        {
            field: "pickupPoint",
            headerName: t("pickupPoint"),
            minWidth: 200,
            flex: 1
        },
        {
            field: "pickupTime",
            headerName: t("pickupTime"),
            minWidth: 150,

        },
        {
            field: "pickupNote",
            headerName: t("pickupNote"),
            minWidth: 150,

        },

        //document Type 1/ 2
        {
            field: "documentType1",
            headerName: t("documentType1"),
            minWidth: 150,

        },
        {
            field: "documentType2",
            headerName: t("documentType2"),
            minWidth: 150,

        },
        {
            field: "deliveryStatus ",
            headerName: t("deliveryStatus"),
            minWidth: 150,

        },

        //document Type 1/ 2
        {
            field: "deliveryType1",
            headerName: t("deliveryType1"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "deliveryType2",
            headerName: t("deliveryType2"),
            minWidth: 150,

        },
        {
            field: "invoiceNo",
            headerName: t("invoiceNo"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "saleOrderNo",
            headerName: t("saleOrderNo"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "documentNo",
            headerName: t("documentNo"),
            minWidth: 150,

        },
        {
            field: "referenceNo",
            headerName: t("referenceNo"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "invoiceDate",
            headerName: t("invoiceDate"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "shipTo",
            headerName: t("shipTo"),
            minWidth: 150,

        },
        //ship to
        // {
        //     field: "deliveryId",
        //     headerName: t("idDelivery"),
        //     minWidth: 150,

        // },
        {
            field: "receiverName",
            headerName: t("receiverName"),
            minWidth: 250,

        },
        {
            field: "receiverPhone",
            headerName: t("receiverPhone"),
            minWidth: 150,

        },
        {
            field: "deliveryPoint",
            headerName: t("deliveryPoint"),
            minWidth: 150,

        },
        {
            field: "areaMasterId",
            headerName: t("idAreaMaster"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "dueDate",
            headerName: t("dueDate"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "productNo",
            headerName: t("productNo"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "ss",
            headerName: t("SS"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "s",
            headerName: t("S"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "m",
            headerName: t("M"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "l",
            headerName: t("L"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "xl",
            headerName: t("XL"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "xxl",
            headerName: t("2xL"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "xxxl",
            headerName: t("3xL"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "xxxxl",
            headerName: t("4xL"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "xxxxxl",
            headerName: t("5xL"),
            minWidth: 80,


            sortable: false,
        },
        {
            field: "loadingBox",
            headerName: t("loadingBox"),
            minWidth: 80,

        },

        {
            field: "loadingPiece",
            headerName: t("loadingPiece"),
            minWidth: 150,

        },

        {
            field: "unit",
            headerName: t("unit"),
            minWidth: 80,

        },
        {
            field: "typeOfGood",
            headerName: t("typeOfGood"),
            minWidth: 150,

        },
        {
            field: "loadingWeight",
            headerName: t("loadingWeight"),
            minWidth: 150,

        },
        {
            field: "loadingLiter",
            headerName: t("loadingLiter"),
            minWidth: 150,

        },
        {
            field: "loadingCbm",
            headerName: t("loadingCBM"),
            minWidth: 150,

        },
        {
            field: "loadingTarget",
            headerName: t("loadingTarget"),
            minWidth: 150,

        },
        {
            field: "deliveryNote",
            headerName: t("deliveryNote"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "cod",
            headerName: t("cod"),
            minWidth: 150,


            sortable: false,
        },
        {
            field: "shipmentArea",
            headerName: t("areaShipment"),
            minWidth: 150,

        },
        {
            field: "pickupLatitude",
            headerName: t("pickupLatitude"),
            minWidth: 150,

        },
        {
            field: "pickupLongtitude",
            headerName: t("pickupLongtitude"),
            minWidth: 150,

        },
        {
            field: "deliveryLatitude",
            headerName: t("deliveryLatitute"),
            minWidth: 150,

        },
        {
            field: "deliveryLongtitude",
            headerName: t("deliveryLongtitude"),
            minWidth: 150,

        },
        {
            field: "senderPhone",
            headerName: t("senderPhone"),
            minWidth: 150,

        },
        // {
        //     field: "productSize",
        //     headerName: t("productSize"),
        //     minWidth: 150,

        // },
        // {
        //     field: "shipmentType",
        //     headerName: t("shipmentType"),
        //     minWidth: 150,

        // },
        {
            field: "action",
            headerName: "",
            minWidth: 10,
            width: 10,
            cellClassName: 'px-0',
            align: "right",
            renderCell: (params) => (
                <div className="flex gap-2">
                    <FaAngleRight />
                    {/* <AssignDriverToTruck truck={params.row} refetch={refetch} />
                    <Tooltip title={t("updateTruck")} placement="top-start" arrow>
                        <a
                            onClick={() => onShowEdit(params.row)}
                            className="group cursor-pointer rounded-lg border border-gray-200 p-1 text-indigo-500 hover:bg-indigo-500"
                        >
                            <AiFillEdit className="h-5 w-5 group-hover:text-white" />
                        </a>
                    </Tooltip>
                    <Tooltip title={t("delete")} placement="top-start" arrow>
                        <a
                            href="#"
                            className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
                            onClick={() => onShowModalDelete(params.row.id)}
                        >
                            <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
                        </a>
                    </Tooltip> */}
                </div>
            ),
            sortable: false,
        },
    ];
    // const columns = [
    //     {
    //         field: "no",
    //         headerName: t("#No"),
    //         // headerClass: 'pl-[30px]',
    //         //   cellClassName: 'pl-[30px]',
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //         colSpan: ({ row }) => {
    //             return row.type == 'SM' ? 50 : 1
    //         },
    //         renderCell: ({ row }) => (
    //             <div>
    //                 {row.type == 'SM'
    //                     ? (
    //                         <div className="flex items-center">
    //                             <div className="text-primary-900 underline font-semibold cursor-pointer" onClick={() => {
    //                                 setSelectedRow(row)
    //                                 setShowDetail(true)
    //                             }}>
    //                                 {row.key}
    //                             </div>
    //                             <div className="ml-3 flex items-center">
    //                                 <span className="mr-2">
    //                                     ( {t("driver")}: {row.driverName} / {t("truck")}: {row.plateLicense}  ) 
    //                                 </span>
    //                                 {
    //                                     statusShipment(row.shipmentStatus)
    //                                 }
    //                                 {row.shipmentStatus == 1 && (<div className="ml-4 flex">
    //                                     <button className="flex items-center gap-1 btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => { setShowAssignDriver(true); setSelectedShipmentInform(row); setShowDetail(false) }}> Assign Driver & Truck</button>
    //                                     <button className="flex ml-3 items-center gap-1 btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => { setSelectedShipmentInform(row); setOpenModalQrCode(true) }}> Generate Qr</button>
    //                                 </div>)}

    //                             </div>
    //                         </div>
    //                     )
    //                     : (
    //                         <div>
    //                             {
    //                                 enableCheckbox && (
    //                                     <Checkbox
    //                                         sx={{
    //                                             '&.MuiCheckbox-root': { padding: 0 },
    //                                             '& .MuiSvgIcon-root': { fontSize: 28 },
    //                                         }}
    //                                         className="mr-2"
    //                                         checked={selectedCheckbox[row.invoiceNo] || false} readOnly />
    //                                 )
    //                             }
    //                             {row.index}
    //                             {/* <input type="checkbox" hidden={!enableCheckbox} checked={selectedCheckbox[row.invoiceNo] || false} readOnly={true}/> {row.index} */}
    //                         </div>
    //                     )}
    //             </div>
    //         ),
    //         cellClassName: ({ row }) => row.type == 'SM' ? 'bg-[#f8f9fa]' : '',

    //         width: 80,
    //     sortable: false,},
    //     {
    //         field: "planningStatus",
    //         headerName: t("planningStatus"),
    //         minWidth: 200,
    //         renderCell: ({ row }) => getPlanStatus(row),
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "senderName",
    //         headerName: t("senderName"),
    //         minWidth: 300,
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "deliveryStatus",
    //         headerName: t("deliveryType"),
    //         minWidth: 150,
    //         flex: 1,
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "companyId",
    //         headerName: t("idCompany"),
    //         minWidth: 100,
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "calculationOrder",
    //         headerName: t("calculationOrder"),
    //         minWidth: 150,
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "deliveryType",
    //         headerName: t("deliveryType"),
    //         minWidth: 150,
    //         //   headerAlign: 'center',
    //         //   align: 'center',
    //     sortable: false,},
    //     {
    //         field: "branchId",
    //         headerName: t("idSiteDC"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "senderId",
    //         headerName: t("idSender"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "pickupId",
    //         headerName: t("idPickup"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "pickupTime",
    //         headerName: t("pickupTime"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "typeOfGood",
    //         headerName: t("typeOfGood"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "pickupNote",
    //         headerName: t("pickupNote"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "invoiceNo",
    //         headerName: t("invoiceNo"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "saleOrderNo",
    //         headerName: t("saleOrderNo"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "documentNo",
    //         headerName: t("documentNo"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "productNo",
    //         headerName: t("productNo"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "referenceNo",
    //         headerName: t("referenceNo"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "invoiceDate",
    //         headerName: t("invoiceDate"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "deliveryId",
    //         headerName: t("idDelivery"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "receiverName",
    //         headerName: t("receiverName"),
    //         minWidth: 250,

    //     sortable: false,},
    //     {
    //         field: "areaMasterId",
    //         headerName: t("idAreaMaster"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "dueDate",
    //         headerName: t("dueDate"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "unit",
    //         headerName: t("unit"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "deliveryNote",
    //         headerName: t("deliveryNote"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "cod",
    //         headerName: t("cod"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "loadingBox",
    //         headerName: t("loadingBox"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "loadingWeight",
    //         headerName: t("loadingWeight"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "loadingLiter",
    //         headerName: t("loadingLiter"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "loadingCbm",
    //         headerName: t("loadingCBM"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "loadingTarget",
    //         headerName: t("loadingTarget"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "ss",
    //         headerName: t("SS"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "s",
    //         headerName: t("S"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "m",
    //         headerName: t("M"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "l",
    //         headerName: t("L"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "xl",
    //         headerName: t("XL"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "xxl",
    //         headerName: t("2xL"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "xxxl",
    //         headerName: t("3xL"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "xxxxl",
    //         headerName: t("4xL"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "xxxxxl",
    //         headerName: t("5xL"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "productSize",
    //         headerName: t("productSize"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "shipmentType",
    //         headerName: t("shipmentType"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "shipmentArea",
    //         headerName: t("areaShipment"),
    //         minWidth: 150,

    //     sortable: false,},
    //     {
    //         field: "action",
    //         headerName: "",
    //         minWidth: 10,
    //         width: 10,
    //         cellClassName: 'px-0',
    //         align: "right",
    //         renderCell: (params) => (
    //             <div className="flex gap-2">
    //                 <FaAngleRight />
    //                 {/* <AssignDriverToTruck truck={params.row} refetch={refetch} />
    //                 <Tooltip title={t("updateTruck")} placement="top-start" arrow>
    //                     <a
    //                         onClick={() => onShowEdit(params.row)}
    //                         className="group cursor-pointer rounded-lg border border-gray-200 p-1 text-indigo-500 hover:bg-indigo-500"
    //                     >
    //                         <AiFillEdit className="h-5 w-5 group-hover:text-white" />
    //                     </a>
    //                 </Tooltip>
    //                 <Tooltip title={t("delete")} placement="top-start" arrow>
    //                     <a
    //                         href="#"
    //                         className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
    //                         onClick={() => onShowModalDelete(params.row.id)}
    //                     >
    //                         <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
    //                     </a>
    //                 </Tooltip> */}
    //             </div>
    //         ),
    //     sortable: false,},
    // ];


    const onDoneDelete = (e) => {
        setOpen(false)
        setShowDetail(false)
        // refetch()
    }


    return (
        <>

            <div className=" flex relative h-[calc(100vh_-_57px)]">
                <div className="flex-1 transition-all duration-[300ms] overflow-hidden">
                    <div className="bg-white">
                        <div className="h-[50px] border-b px-3 flex justify-between items-center">
                            {
                                enableCheckbox ? (
                                    <div className="flex items-center">
                                        <Tooltip title={'Close'} placement="bottom-start" arrow>
                                            <button className="rounded-full p-1 mr-2 outline-none hover:bg-[#f1f1f1]" onClick={() => { setEnableCheckbox(false) }}>
                                                <MdOutlineClose className="h-6 w-6 flex-shrink-0 text-gray-900 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip>
                                        <div className="title text-[16px]">
                                            {Object.values(selectedCheckbox).filter(i => i).length} Selected
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="title text-[16px]">
                                            Approved Shipment

                                        </div>
                                        <div className="action flex items-center gap-[8px]">
                                            <button className="disabled:opacity-40 flex items-center gap-3 btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenFormAddShipment(true)}>
                                                {/* {isLoadingCreateShipment && <CircularProgress className="text-white w-4 h-4" />} */}

                                                {t('Create shipment')}
                                            </button>
                                            {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setShowImportModal(true)}>+ Import Excel</button> */}
                                            {/* <Divider orientation="vertical" flexItem variant="middle" /> */}
                                            &nbsp;
                                            <IoFilterOutline onClick={() => setOpenFilter(true)} className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            <button onClick={() => setEnableCheckbox(true)}>
                                                <MdOutlineCheckBox className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </>
                                )
                            }

                        </div>
                    </div>

                    <div className="h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full ">
                        <div className="flex h-full  min-h-[calc(100vh_-_110px)] bg-white ">


                            <div className="flex flex-1 flex-col ag-theme-alpine">

                                <DataGrid
                                    loading={isLoading || isFetching}
                                    components={{
                                        LoadingOverlay: LinearProgress,
                                    }}
                                    sx={{
                                        '.MuiDataGrid-columnSeparator': {
                                            display: 'none',
                                        },
                                        '&.MuiDataGrid-root': {
                                            border: 'none',
                                        },
                                        '.MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#fff',
                                        },
                                        '.MuiDataGrid-columnHeader': {
                                            borderRight: '1px solid #e5e7eb'
                                        },
                                        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                            outline: "none !important",
                                        },
                                    }}
                                    getRowId={(row) => row.key}
                                    rows={tableData || []}
                                    headerHeight={38}
                                    disableColumnMenu={true}
                                    // hideFooter={true}
                                    rowHeight={38}
                                    // checkboxSelection
                                    onRowClick={(params) => showDetailRow(params)}
                                    columns={columns}
                                    selectionModel={selectedRow?.invoiceNo}
                                    rowsPerPageOptions={[25, 50, 100]}
                                    paginationMode="server"
                                    rowCount={data?.totalElements || 0}
                                    pageSize={data?.size || 25}
                                    onPageChange={(page) => { setCriterias({ ...criterias, page }); fetchData(criterias) }}
                                    onPageSizeChange={(rowsPerPage) => { setCriterias({ ...criterias, rowsPerPage }); fetchData(criterias) }}
                                />
                            </div>

                            {/* <DeleteTruck open={open} setOpen={onDoneDelete} truckId={selectedTruck} /> */}

                        </div>
                    </div>
                </div>
                <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="py-1 h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                {selectedRow?.type == 'DO' ? 'Delivery order details' : 'Shipment details'}
                            </div>
                            <div className="action flex items-center gap-[8px]">
                                {openEdit ? (
                                    <>
                                        <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                            <button onClick={() => setOpenEdit(false)} className="btn-primary border py-[5px] px-3 rounded-[5px] text-primary-900 border-primary-500 hover:bg-primary-100 text-[13px]">
                                                <span>Cancel</span>
                                            </button>
                                        </Tooltip>
                                        <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                            <button onClick={() => setTriggleSubmit(true)} className="btn-primary py-[6px] px-4 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                <span>Save</span>
                                            </button>
                                        </Tooltip>
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                    </>
                                ) : (
                                    <>
                                        {/* <Tooltip title={'Delete'} placement="bottom-start" arrow>
                                            <button onClick={() => onShowModalDelete(selectedRow.id)} className="p-1 outline-none hover:bg-[#f1f1f1] border rounded-[5px]">
                                                <FaRegTrashAlt className="h-6 w-6 flex-shrink-0 text-primary-900 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip> */}
                                        {selectedRow?.type == 'SM' && (
                                            <>
                                                {(selectedRow.shipmentStatus > 3 && selectedRow.shipmentStatus < 5) && <Tooltip title={'Change Shipment Status'} placement="bottom-start" arrow>
                                                    <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaEdit className="mr-2" />
                                                        <span>Shipment Status</span>
                                                    </button>
                                                </Tooltip>}
                                                {(selectedRow.shipmentStatus == 6) && <Tooltip title={'Closed Shipment'} placement="bottom-start" arrow>
                                                    <button onClick={() => setOpenCloseShipment(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaEdit className="mr-2" />
                                                        <span>Closed Shipment</span>
                                                    </button>
                                                </Tooltip>}
                                                <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                                    <button onClick={() => dispatch(toggleExpenseForm(true))} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaPlus className="mr-2" />
                                                        <span>Expense</span>
                                                    </button>
                                                </Tooltip>
                                            </>
                                        )
                                        }
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        {/* <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" /> */}
                                        <Tooltip title={'Back'} placement="bottom-start" arrow>
                                            <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]" onClick={getPrevRow}>
                                                <IoChevronBack className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title={'Next'} placement="bottom-start" arrow>
                                            <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]" onClick={getNextRow}>
                                                <IoChevronForward className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip>
                                    </>
                                )}

                                <Tooltip title={'Expand'} placement="bottom-start" arrow>
                                    <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]">
                                        <AiOutlineExpandAlt className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </button>
                                </Tooltip>
                                <Tooltip title={'Close'} placement="bottom-start" arrow>
                                    <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]" onClick={() => { setShowDetail(false); setOpenEdit(false) }}>
                                        <MdOutlineClose className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full p-[16px] overflow-auto">
                        <div className="max-w-[650px] p-4 min-h-[50vh] bg-white border m-auto ">
                            {showDetail &&
                                ((selectedRow.type == 'DO' ? <DetailPlanning detailRow={selectedRow} /> : <DetailShipment detailRow={selectedRow} />))}
                        </div>
                    </div>
                </div>

            </div>
            {/* <div className=" flex">
                <div className="flex-1 transition-all duration-[300ms]">

                    
                </div>
                
            </div> */}
            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFilter={triggleFiter} setTriggleFiter={setTriggleFiter}>
                <FilterApprovedShipment fleets={[]} menu="approved" filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} />
            </FilterRightBar>

            {/* <FormDisplay open={openForm} setOpen={setOpenForm} >
                <AddTruckForm1 fleets={[]} setOpenForm={setOpenForm} />
            </FormDisplay> */}
            <AddExpense shipment={selectedRow} open={openExpense} refetch={() => { setShowDetail(false) }} setOpen={setOpenExpense} />
            <ChangeStatus open={openEdit} setOpen={setOpenEdit} shipment={selectedRow} refetch={() => { refetch() }} />
            <CloseShipment open={openCloseShipment} setOpen={setOpenCloseShipment} setCloseDetail={setShowDetail} shipment={selectedRow} />
            <AssignTruckDriver shipment={selectedShipment} open={showAssignDriver} setOpen={setShowAssignDriver} refetch={refetch} />
            <GenerateQRCode shipment={selectedShipment} open={openModalQrCode} setOpen={setOpenModalQrCode} />
            {/* <AssignTruck refetch={refetch} shipment={selectedShipment} open={showAssignTruck} setOpen={setShowAssignTruck}/>
            <AssignDriver refetch={refetch} shipment={selectedShipment} open={showAssignDriver} setOpen={setShowAssignDriver}/>
            <AddStaff shipment={selectedShipment} open={showAddStaff} setOpen={setShowAddStaff}/> */}
            <FormDisplay open={openFormAddShipment} setOpen={setOpenFormAddShipment} >
                <AddShipmentForm selectedItem={null} refetch={refetch} setTriggleSubmit={setTriggleSubmit} setOpenFormAddShipment={setOpenFormAddShipment} />
            </FormDisplay>
        </>
    );
};

export default ApprovedShipmentManager;
