import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLazyGetShipmentsOrderQuery } from "../services/apiSlice";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import {  AiOutlineExpandAlt } from "react-icons/ai";
import { Checkbox, Divider, TextField } from "@mui/material";
import { IoFilterOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { MdOutlineClose } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaEdit, FaFileDownload } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import FilterRightBar from "../components/FilterRightBar";
import { MdOutlineCheckBox } from "react-icons/md";
import { exportJob1 } from "../api";
import DetailPlanning from "../components/Planning/DetailPlanning";
import DetailShipment from "../components/Planning/DetailShipment";
import dayjs from "dayjs";
import FilterReport from "../components/Report/FilterReport";
import { expenseTypesObject } from "../constants/constants";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { setSelectedShipment } from "../features/shipment/shipmentSlice";
// import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane'
// import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

// import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
// import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

const ReportShipment = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [loading, setLoading] = useState(false)


    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        shipmentId: '',
        shipmentStatus: [7],
        reportType: 1,
        dateFrom: dayjs().subtract(1, 'months').startOf('day'),
        dateTo: dayjs().endOf('day'),
    });

    const dispatch = useDispatch()

    useEffect(e => {
        if(selectedRow && selectedRow.id && selectedRow.type == 'SM'){
            dispatch(setSelectedShipment(selectedRow))
        }
    }, [selectedRow])



    const [fetchData, { data, isLoading, isFetching, isSuccess, refetch }] = useLazyGetShipmentsOrderQuery();

    const updateFilter = (value) => {
        console.log(value)
        let fil = { ...criterias, ...value, page: 0 }
        if(value.reportType == 1){
            fil.expenseType = ''
        }else{
            fil.staffName = ''
            fil.staffType = ''
            fil.positionStaff = ''
        }
        setCriterias({ ...fil});
        fetchData({ ...fil})
    };

    const exportReport = async () => {
        setLoading(true);
        try {
          const response = await exportJob1({page: 0,
            rowsPerPage: 1000,
            dateFrom: criterias.dateFrom.startOf('day'),
            dateTo: criterias.dateTo.endOf('day')})
            // console.log(response)
        //   const file = new Blob([response.data], { type: "application/vnd.openxmlformats;" });
        //   const fileURL = URL.createObjectURL(file);
        //   window.open(fileURL);
            const url = URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ReportShipment_${dayjs(criterias.dateFrom).format('DD/MM/YYYY')}-${dayjs(criterias.dateTo).format('DD/MM/YYYY')}.xlsx`);
            document.body.appendChild(link);
            link.click();
    
        // OR you can save/write file locally.
        // fs.writeFileSync(outputFilename, response.data);
    
        } catch (error) {
          console.log(error);
        }
    
        setLoading(false);
      };

    useEffect(_ => {
        fetchData(criterias)
    }, []) 

    useEffect(_ => {
        if(!isFetching){
            setTimeout(_ => {
                setTriggleFiter(false)

            },500)
        }
    }, [isFetching])

    var newData = []
    useEffect(_ => {
        let list = []
        if (data && data?.content?.length > 0) {
            let i = 1
            // console.log(data.content)
            data.content.forEach((dt, index) => {
                // console.log(dt)
                list.push({ ...dt, key: dt.shipmentId, type: 'SM' })
                if (criterias.reportType == 1 && dt.staffs) {
                    let DOList = dt.staffs.map(doItem => {
                        let a = ({
                            ...doItem,
                            index: i,
                            type: 'DO',
                            name: doItem.firstName + ' ' + doItem.lastName,
                            key: i,
                            startTime: dayjs(dt.history[0].createdAt).format('DD/MM/YYYY HH:mm:ss'),
                            endTime: dayjs(dt.history[dt.history.length -1].createdAt).format('DD/MM/YYYY HH:mm:ss'),
                        })
                        i++;
                        return a
                    });
                    list = list.concat(DOList)
                }else if(criterias.reportType == 2 && dt.expenses){
                    let DOList = dt.expenses.map(doItem => {
                        let a = ({
                            ...doItem,
                            index: i,
                            type: 'DO',
                            expense_name: expenseTypesObject[doItem.expenseType],
                            key: i,
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

   

    const showDetailRow = (params) => {
        // console.log(params)
        setSelectedRow(params.row)
        // if (params.row.type == 'DO') {
        //     if (enableCheckbox) {
        //         setSelectedCheckbox(prevState => ({
        //             ...prevState,
        //             [params.id]: prevState[params.id] ? !prevState[params.id] : true
        //         }))

        //     } else {
        //         setShowDetail(true)
        //     }
        //     // console.log(params)
        // }
        // setSelectedRowID(params.id)
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
                return row.type == 'SM' ? 50 : 1
            },
            renderCell: ({ row }) => (
                <div>
                    {row.type == 'SM'
                        ? (
                            <div className="flex items-center">
                                <div className="text-primary-900 underline font-semibold cursor-pointer" onClick={() => {
                                    setSelectedRow(row)
                                    setShowDetail(true)
                                }}>{row.key}</div>
                               
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
            width: 80
        },
      
      
        {
            field: "expense_name",
            headerName: t("Expense Type"),
            minWidth: 150,
            flex: 1,
            hide: criterias.reportType == 1
        },
        {
            field: "totalLiter",
            headerName: t("totalLiter"),
            minWidth: 150,
            flex: 1,
            hide: criterias.reportType == 1
        },
        {
            field: "totalMoney",
            headerName: t("totalMoney"),
            minWidth: 150,
            flex: 1,
            hide: criterias.reportType == 1
        },
        {
            field: "details",
            headerName: t("details"),
            minWidth: 150,
            flex: 1,
            hide: criterias?.reportType == 1
        },
        {
            field: "note",
            headerName: t("note"),
            minWidth: 150,
            flex: 1,
            hide: criterias?.reportType == 1
        },
        {
            field: "name",
            headerName: t("staffName"),
            minWidth: 150,
            flex: 1,
            hide: criterias?.reportType == 2
        },
        {
            field: "idSite",
            headerName: t("idSite"),
            minWidth: 80,
            hide: criterias?.reportType == 2
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "staffType",
            headerName: t("staffType"),
            minWidth: 150,
            hide: criterias?.reportType == 2,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "positionStaff",
            headerName: t("positionStaff"),
            minWidth: 150,
            hide: criterias?.reportType == 2
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "startTime",
            headerName: t("startTime"),
            minWidth: 200,
            hide: criterias?.reportType == 2
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "endTime",
            headerName: t("endTime"),
            minWidth: 200,
            hide: criterias?.reportType == 2
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "createdByName",
            headerName: t("createdByName"),
            minWidth: 200,
            hide: criterias?.reportType == 1
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "createAt",
            headerName: t("createAt"),
            minWidth: 200,
            hide: criterias?.reportType == 1
            //   headerAlign: 'center',
            //   align: 'center',
        },
        
       
    ];
    // const onSelectionChanged = useCallback(() => {
    //     const selectedRows = gridRef.current.api.getSelectedRows();

    //     console.log(selectedRows)
    //     // document.querySelector('#selectedRows').innerHTML =
    //     //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    //   }, []);


   
    // const changePane = e => {
    //     if (showDetail) {
    //         setDetailPaneWidth('Nan')
    //     }
    //     let a = e[1]
    //     localStorage.setItem('detailPanel', a)
    // }
    // const [detailPaneWidth, setDetailPaneWidth] = useState(45)

    // useEffect(_ => {
    //     if (!showDetail) {
    //         let a = localStorage.getItem('detailPanel')
    //         if (a) {
    //             setDetailPaneWidth(Number(a.replace('%', '')))
    //         }
    //     }
    // }, [showDetail])

    // useEffect(_ => {
    //     let a = localStorage.getItem('detailPanel')
    //     if (a) {
    //         setDetailPaneWidth(Number(a.replace('%', '')))
    //     }
    // }, [])

    return (
        <>
            <div className=" flex relative h-[calc(100vh_-_57px)]">
                <div className="flex-1 transition-all duration-[300ms]">

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
                                            Report 
                                        </div>
                                        <div className="action flex items-center gap-[8px]">
                                            <Tooltip title={'Export'} placement="bottom-start" arrow>
                                                <LoadingButton
                                                    type="button"
                                                    // disabled={!selectedDriver && !selectedDriver?.driverId && !selectedTruck && !selectedTruck?.truckId}
                                                    onClick={exportReport}
                                                    variant="contained"
                                                    loading={loading}>
                                                        <FaFileDownload className="w-5 h-5"/>
                                                    </LoadingButton>
                                                {/* <button className="btn-primary py-[7px] px-[5px] rounded-[3px] bg-white border text-[13px] border-[#0000003b] text-primary-900" onClick={() => exportReport()}>

                                                </button> */}
                                                </Tooltip>
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
                                    // onRowClick={(params) => showDetailRow(params)}
                                    columns={columns}
                                    selectionModel={selectedRow?.key}
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
                                        </Tooltip>
                                        <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                            <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                <FaEdit className="mr-2" />
                                                <span>Edit</span>
                                            </button>
                                        </Tooltip>
                                        <Divider orientation="vertical" flexItem variant="middle" /> */}
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
                        <div className="max-w-[700px] p-4 min-h-[50vh] bg-white border m-auto ">
                            {showDetail && (selectedRow?.type == 'DO' ? <DetailPlanning detailRow={selectedRow} /> : <DetailShipment detailRow={selectedRow} />)}
                        </div>
                    </div>
                </div>

            </div>

            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFilter={triggleFiter} setTriggleFiter={setTriggleFiter} >
                <FilterReport  filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} />

            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                {/* <AddTruckForm1 fleets={[]} setOpenForm={setOpenForm} /> */}
            </FormDisplay>
            {/* <AssignTruck refetch={refetch} shipment={selectedShipment} open={showAssignTruck} setOpen={setShowAssignTruck}/> */}
            {/* <AssignDriver refetch={refetch} shipment={selectedShipment} open={showAssignDriver} setOpen={setShowAssignDriver}/> */}
            {/* <AddStaff shipment={selectedShipment} open={showAddStaff} setOpen={setShowAddStaff}/> */}
        </>
    );
};

export default ReportShipment;
