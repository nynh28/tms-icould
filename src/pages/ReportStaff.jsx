import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { LoadingButton } from "@mui/lab";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import { MdOutlineCheckBox, MdOutlineClose } from "react-icons/md";
import { Checkbox, Divider } from "@mui/material";
import { IoChevronBack, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import { useSelector } from "react-redux";
import FilterRightBar from "../components/FilterRightBar";
import { useGetTruckTypeQuery, useGetTrucksQuery, useLazyGetReportShipmentExpenseQuery, useLazyGetReportShipmentStaffQuery } from "../services/apiSlice";
import DetailTruck from "../components/Truck/DetailTruck";
import DeleteTruck from "../components/Truck/DeleteTruck";
import AddTruckForm from "../components/Truck/Form";
import FilterReport from "../components/Report/FilterReport";
import dayjs from "dayjs";
// import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane'
const ReportStaff = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const { masterDatas } = useSelector((state) => state.masterDatas);
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        dateFrom: dayjs().subtract(1, 'months'),
        dateTo: dayjs(),
        shipmentId: "",
        reportType: 1
    });

    const [fetchData, {data, isLoading, isFetching, isSuccess}] = useLazyGetReportShipmentStaffQuery()
    // const [fetchData1] = useLazyGetReportShipmentExpenseQuery()

    useEffect(_ => {
        fetchData(criterias)
        // fetchData1(criterias)
    }, [])

    // const { data, isLoading, isFetching, isSuccess, refetch } =
    //     useGetTrucksQuery(criterias);
    //     //  console.log(useGetTrucksQuery())

        // const a = useMemo(() => )

    

    const showDetailRow = (params) => {
        setSelectedRow(params.row)
        if (enableCheckbox) {
            setSelectedCheckbox(prevState => ({
                ...prevState,
                [params.id]: prevState[params.id] ? !prevState[params.id] : true
            }))

        } else {
            if(!showDetail){
                // console.log('a')
                // alert(1)
                setShowDetail(true)
            }
        }
    }


    const getPrevRow = () => {
        if (selectedRow && selectedRow.id) {
            let findIndex = data.content.findIndex(i => i.id == selectedRow.id)
            if (findIndex > 0) {
                setSelectedRow(data.content[findIndex - 1])
            }
        }
    }
    const getNextRow = () => {
        if (selectedRow && selectedRow.id) {
            let findIndex = data.content.findIndex(i => i.id == selectedRow.id)
            if (findIndex >= 0 && findIndex < data.content.length - 1) {
                setSelectedRow(data.content[findIndex + 1])
            }
        }
    }

    const onShowModalDelete = (id) => {
        setOpen(true);
    };


    const updateFilter = (value) => {
        const filter = { ...criterias, ...value }
        fetchData(filter);
        setCriterias(filter);
    };


    const onDoneDelete = (e) => {
        setOpen(false)
        setShowDetail(false)
        refetch()
    }
    const columns = [
        {
            field: "shipmentId",
            headerName: t("Shipment No"),
            // renderCell: ({ row }) => (
            //     <div>
                   
            //         {row.shipmentId}
            //     </div>
            // ),
            minWidth: 150,
        },
        {
            field: "startDate",
            headerName: t("Work start date"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "vehicleCode",
            headerName: t("Vehicle Code"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "vehicleRegistration",
            headerName: t("Vehicle registration"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "vehicleTypeCode",
            headerName: t("Vehicle type code"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "farthestProvince",
            headerName: t("Farthest delivery area (province)"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "farthestDistrict",
            headerName: t("Area Farthest delivery (district)"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "farthestSubdistrict",
            headerName: t("Farthest delivery area (subdistrict)"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "",
            headerName: t("Total distance"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "totalRefrigerationHours",
            headerName: t("Total refrigeration hours"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "itemOrder",
            headerName: t("Item order"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "jobDescription",
            headerName: t("Job description"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "employeeCode",
            headerName: t("Employee code"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "employeeFirstName",
            headerName: t("Employee first name"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "employeeLastName",
            headerName: t("Employee last name"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "idCardNumber",
            headerName: t("ID card number"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        
    ];

    // const changePane = e => {
    //     if(showDetail){
    //         setDetailPaneWidth('Nan')
    //     }
    //     let a = e[1]
    //     localStorage.setItem('detailPanel', a)
    // }
    // const [detailPaneWidth, setDetailPaneWidth] = useState(45)

    // useEffect(_ => {
    //     if(!showDetail){
    //         let a = localStorage.getItem('detailPanel')
    //         if(a){
    //             setDetailPaneWidth(Number(a.replace('%','')))
    //         }
    //     }
    // }, [showDetail])

    // useEffect(_ => {
    //     let a = localStorage.getItem('detailPanel')
    //     if(a){
    //         setDetailPaneWidth(Number(a.replace('%','')))
    //     }
    // }, [])

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
                                                    {t('Report Staff')}
                                                </div>
                                                <div className="action flex items-center gap-[8px]">
                                                    {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenForm(true)}>+ {t('add')}</button> */}
                                                    <Divider orientation="vertical" flexItem variant="middle" />
                                                    &nbsp;
                                                    <IoFilterOutline onClick={() => setOpenFilter(true)} className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                                    <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                                    {/* <button onClick={() => setEnableCheckbox(true)}>
                                                        <MdOutlineCheckBox className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                                    </button> */}
                                                </div>
                                            </>
                                        )
                                    }

                                </div>
                            </div>

                            <div className="h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full ">
                                <div className="flex h-full  min-h-[calc(100vh_-_110px)] bg-white ">


                                    <div className="flex flex-1 flex-col">

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
                                            rows={(data?.content || []).map((item, index) => {

                                                return {...item, key: index}
                                            })}
                                            headerHeight={38}
                                            rowHeight={38}
                                            // checkboxSelection
                                            // onRowClick={(params) => showDetailRow(params)}
                                            columns={columns}
                                            // selectionModel={selectedRow?.shipmentId}
                                            rowsPerPageOptions={[25, 50, 100]}
                                            paginationMode="server"
                                            rowCount={data?.totalElements || 0}
                                            pageSize={data?.size || 25}
                                            onPageChange={(page) => { setCriterias({ ...criterias, page }) }}
                                            onPageSizeChange={(rowsPerPage) => { setCriterias({ ...criterias, rowsPerPage }) }}
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                            <div className="bg-white">
                                <div className="h-[50px] border-b px-3 flex justify-between items-center">
                                    <div className="title text-[16px]">
                                        {t('Truck')}
                                    </div>
                                    <div className="action flex items-center gap-[8px]">
                                        {(
                                            <>
                                                {/* <Tooltip title={'Delete'} placement="bottom-start" arrow>
                                                    <button onClick={() => onShowModalDelete(selectedRow.id)} className="p-1 outline-none hover:bg-[#f1f1f1] border rounded-[5px]">
                                                        <FaRegTrashAlt className="h-6 w-6 flex-shrink-0 text-primary-900 cursor-pointer" aria-hidden="true" />
                                                    </button>
                                                </Tooltip>
                                                
                                                <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                                    <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaEdit className="mr-2" />
                                                        <span>Edit</span>
                                                    </button>
                                                </Tooltip> */}
                                                {/* <Divider orientation="vertical" flexItem variant="middle" /> */}
                                                {/* &nbsp; */}
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
                            <div className="h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full p-[15px] overflow-auto">
                                <div className="max-w-[600px] p-4 min-h-[50vh] bg-white border m-auto ">
                                    {showDetail &&  <DetailTruck detailRow={selectedRow} />}
                                </div>
                            </div>
                        </div>                    
                {/* <SplitPane split="vertical" onChange={changePane}>
                    <Pane minSize="30%" maxSize="100%">
                    </Pane>
                    {showDetail && <Pane initialSize={detailPaneWidth+"%"} minSize="30%" maxSize="70%">
                    </Pane>}
                </SplitPane> */}
                
            </div>
            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFilter={triggleFiter} setTriggleFiter={setTriggleFiter} >
                <FilterReport  filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} />

            </FilterRightBar>
            {/* <FormDisplay open={openForm} setOpen={setOpenForm} >
                <AddTruckForm selectedItem={null} refetch={refetch} truckTypes={dataTruckTypes} setTriggleSubmit={setTriggleSubmit} setOpenForm={setOpenForm} />
            </FormDisplay> */}
        </>
    );
};

export default ReportStaff;
