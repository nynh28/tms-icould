import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    useGetExpenseQuery,
    useGetShipmentsExpenseQuery,
    useGetTypeOfCargoQuery,
} from "../services/apiSlice";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import UpdateDriver from "../components/Driver/UpdateDriver";
import { MdOutlineCheckBox, MdOutlineClose } from "react-icons/md";
import { Checkbox, Divider } from "@mui/material";
import { IoChevronBack, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import FilterRightBar from "../components/FilterRightBar";
// import FormTypeOfCargo from "../components/TypeOfCargo/FormTypeOfCargo";
import DetailTypeOfCargo from "../components/TypeOfCargo/DetailTypeOfCargo";
// import FilterTypeOfCargo from "../components/TypeOfCargo/FilterTypeOfCargo";
import { LoadingButton } from "@mui/lab";
// import DeleteTypeOfCargo from "../components/TypeOfCargo/DeleteTypeOfCargo";
import DetailExpenses from "../components/Expenses/DetailExpenses";
import arraySupport from 'dayjs/plugin/arraySupport'
import dayjs from "dayjs";
// import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane'
const ExpenseManager = () => {
    dayjs.extend(arraySupport);

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
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
    });
    const { data, isLoading, isFetching, isSuccess, refetch } =
        useGetShipmentsExpenseQuery(criterias);
    // const { data, isLoading, isFetching, isSuccess, refetch } =
    //     useGetExpenseQuery(criterias);

    useEffect(_ => {
        let list = []
        if (data && data?.content?.length > 0) {
            let i = 1
            data.content.forEach((dt, index) => {
                // console.log(dt)
                list.push({ ...dt, key: dt.shipmentId, type: 'SM', totalMoney: dt?.expenses.reduce((acc, current) => acc + Number.parseInt(current.totalMoney), 0) })
                if (dt.expenses) {
                    let DOList = dt.expenses.map(doItem => {
                        let a = ({
                            ...doItem,
                            index: i,
                            type: 'EX',
                            key: doItem.id
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
    const types = [
        { id: 1, value: "Fuel" },
        { id: 2, value: "Toll Fee" },
        { id: 3, value: "traffic fines" },
        { id: 4, value: "Rental" },
    ]

    const getExpenseType = (type) => {
        let find = types.find(i => i.id == type)
        return find ? find.value : ''
    }

    const showDetailRow = (params) => {
        setSelectedRow(params.row)
        if (enableCheckbox) {
            setSelectedCheckbox(prevState => ({
                ...prevState,
                [params.id]: prevState[params.id] ? !prevState[params.id] : true
            }))

        } else {
            setShowDetail(true)
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
        setCriterias({ ...criterias, ...value });
    };


    const onDoneDelete = (e) => {
        setOpen(false)
        setShowDetail(false)
        refetch()
    }


    const columns = [
        // {
        //     field: "id",
        //     headerName: t("id"),
        //     renderCell: ({ row }) => (
        //         <div>
        //             {
        //                 enableCheckbox && (
        //                     <Checkbox
        //                         sx={{
        //                             '&.MuiCheckbox-root': { padding: 0 },
        //                             '& .MuiSvgIcon-root': { fontSize: 28 },
        //                         }}
        //                         className="mr-2"
        //                         checked={selectedCheckbox[row.id] || false} readOnly />
        //                 )
        //             }
        //             {row.id}
        //         </div>
        //     ),
        //     minWidth: 150,
        // },
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
                                    // setSelectedRow(row)
                                    // setShowDetail(true)
                                }}>{row.key}</div>
                                <div className="ml-4">
                                    <span className="mr-3">
                                        Total Money: {row.totalMoney} (THB)
                                        {/* ( Driver: {row.driverName} / Truck: {row.plateLicense}  )  */}
                                    </span>
                                    {/* {row.shipmentStatus == 2 && <span className="text-[#cc0b0b] border ml-2 px-[10px] py-[3px] border-[#cc0b0b]">Waiting to driver accept</span>}
                                    {row.shipmentStatus == 3 && <span className="text-primary-700 border ml-2 px-[10px] py-[3px] border-primary-700">Driver Accepted</span>}
                                    {row.shipmentStatus == 4 && <span className="text-[#00b11f] border ml-2 px-[10px] py-[3px] border-[#00b11f]">On Progress</span>} */}

                                    {/* <button className="btn-primary py-[4px] px-3 rounded-[7px] bg-primary-900 text-[14] text-white" onClick={() => {setShowAssignDriver(true); setSelectedShipment(row)}}>Assign Driver</button>
                                    <button className="btn-primary py-[4px] px-3 rounded-[7px] ml-3 bg-primary-900 text-[12px] text-white" onClick={() => {setShowAssignTruck(true); setSelectedShipment(row)}}>Assign Truck</button>
                                    <button className="btn-primary py-[4px] px-3 rounded-[7px] ml-3 bg-primary-900 text-[12px] text-white" onClick={() => {setShowAddStaff(true); setSelectedShipment(row)}}>Add Staff</button> */}

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
                                            checked={selectedCheckbox[row.id] || false} readOnly />
                                    )
                                }
                                {row.index}
                                {/* <input type="checkbox" hidden={!enableCheckbox} checked={selectedCheckbox[row.invoiceNo] || false} readOnly={true}/> {row.index} */}
                            </div>
                        )}
                </div>
            ),
            cellClassName: ({ row }) => row.type == 'SM' ? 'bg-[#f8f9fa]' : '',
            // valueFormatter: ({row}) => (
            //     <div>
            //         {console.log(row)}
            //         {row.type == 'SM' 
            //             ? row.key 
            //             : (
            //                 <div>
            //                     <input type="checkbox" hidden={!enableCheckbox} checked={selectedCheckbox[row.shipmentId] || false} readOnly={true}/> {row.index}
            //                 </div>
            //             )}
            //     </div>),
            width: 80
        },
        {
            field: "expenseType",
            headerName: t("Expense Type"),
            minWidth: 150,
            renderCell: ({ value }) => getExpenseType(value)
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "createdByName",
            headerName: t("Created By"),
            minWidth: 150,
            // renderCell: ({value}) => getExpenseType(value)
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "createAt",
            headerName: t("Created At"),
            minWidth: 150,
            renderCell: ({ value }) => dayjs(value).format("DD/MM/YYYY HH:mm")
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: 'totalMoney',
            headerName: t('Total Money'),
            minWidth: 100
        },
        {
            field: 'totalLiter',
            headerName: t('Total Liter'),
            minWidth: 100
        },
        {
            field: 'status',
            headerName: t('Status'),
            renderCell: ({ value }) => {
                let text = 'Waiting Approved'
                if (value == 1) {
                    text = 'Waiting Approved'
                } else if (value == 2) {
                    text = 'Approved'
                } else if (value == 3) {
                    text = 'Reject'
                } else if (value == 4) {
                    text = 'Pending'
                } else if (value == 5) {
                    text = 'Paid'
                }
                return text
            },
            minWidth: 150
        },
        {
            field: 'details',
            headerName: t('Details'),
            minWidth: 200
        },
        {
            field: 'note',
            flex: 1,
            headerName: t('Note'),
            minWidth: 200
        },
        // {
        //   field: "action",
        //   headerName: t("action"),
        //   minWidth: 150,
        //   renderCell: (params) => (
        //     <div className="flex gap-2">
        //       <Tooltip title={t("updateTypeOfCargo")} placement="top-start" arrow>
        //             <a
        //             onClick={() => onShowEdit(params.row)}
        //             className="group cursor-pointer rounded-lg border border-gray-200 p-1 text-indigo-500 hover:bg-indigo-500"
        //             >
        //             <AiFillEdit className="h-5 w-5 group-hover:text-white" />
        //             </a>
        //         </Tooltip>
        //       <Tooltip title={t("delete")} placement="top-start" arrow>
        //         <a
        //           href="#"
        //           className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
        //           onClick={() => onShowModalDelete(params.row.id)}
        //         >
        //           <TrashIcon className="h-5 w-5 text-red-500 group-hover:text-white" />
        //         </a>
        //       </Tooltip>
        //     </div>
        //   ),
        // },
    ];

    const changePane = e => {
        if (showDetail) {
            setDetailPaneWidth('Nan')
        }
        let a = e[1]
        localStorage.setItem('detailPanel', a)
    }
    const [detailPaneWidth, setDetailPaneWidth] = useState(45)

    useEffect(_ => {
        if (!showDetail) {
            let a = localStorage.getItem('detailPanel')
            if (a) {
                setDetailPaneWidth(Number(a.replace('%', '')))
            }
        }
    }, [showDetail])

    useEffect(_ => {
        let a = localStorage.getItem('detailPanel')
        if (a) {
            setDetailPaneWidth(Number(a.replace('%', '')))
        }
    }, [])

    return (
        <>

            <div className=" flex relative h-[calc(100vh_-_57px)]">
                <div className="flex-1 transition-all duration-[300ms] overflow-hidden">

                    <div className="bg-white">
                        <div className="h-[50px] border-b px-3 flex justify-between items-center">
                            {/* <ImportFromExcel open={showImportModal} setOpen={setShowImportModal} refetch={refetch} /> */}
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
                                            {t('Expenses')}
                                        </div>
                                        <div className="action flex items-center gap-[8px]">
                                            {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenForm(true)}>+ {t('add')}</button>
                        <Divider orientation="vertical" flexItem variant="middle" />
                        &nbsp; */}
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
                                    getRowId={(row) => row?.id}
                                    rows={tableData || []}
                                    headerHeight={38}
                                    rowHeight={38}
                                    // checkboxSelection
                                    onRowClick={(params) => showDetailRow(params)}
                                    columns={columns}
                                    selectionModel={selectedRow?.id}
                                    rowsPerPageOptions={[25, 50, 100]}
                                    paginationMode="server"
                                    rowCount={data?.totalElements || 0}
                                    pageSize={data?.size || 25}
                                    onPageChange={(page) => { setCriterias({ ...criterias, page }) }}
                                    onPageSizeChange={(rowsPerPage) => { setCriterias({ ...criterias, rowsPerPage }) }}
                                />
                            </div>

                            {/* <DeleteTypeOfCargo open={open} setOpen={onDoneDelete} deleteId={selectedRow?.id} /> */}

                        </div>
                    </div>
                </div>
                <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                {t('Detail Expense')}
                            </div>
                            <div className="action flex items-center gap-[8px]">
                                {openEdit ? (
                                    <>
                                        <Tooltip title={'Cancel'} placement="bottom-start" arrow>
                                            <button onClick={() => setOpenEdit(false)} className="btn-primary border py-[5px] px-3 rounded-[5px] text-primary-900 border-primary-500 hover:bg-primary-100 text-[13px]">
                                                <span>Cancel</span>
                                            </button>
                                        </Tooltip>
                                        <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                            <LoadingButton
                                                type="submit"
                                                variant="contained"
                                                className="ml-3"
                                                onClick={() => setTriggleSubmit(true)}
                                                loading={triggleSubmit}
                                            >
                                                {t("save")}
                                            </LoadingButton>
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
                                        </Tooltip> */}
                                        {/* <Divider orientation="vertical" flexItem variant="middle" /> */}
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
                            {/* {(openEdit ? <FormTypeOfCargo selectedItem={selectedRow} refetch={() => { refetch(); setOpenEdit(false) }} triggleSubmit={triggleSubmit} setTriggleSubmit={setTriggleSubmit} setOpenForm={setShowDetail} submitError={() => setTriggleSubmit(false)} /> : <DetailExpenses detailRow={selectedRow} />)} */}
                            <DetailExpenses detailRow={selectedRow} />
                        </div>
                    </div>
                </div>


            </div>


            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}>
                {/* <FilterTypeOfCargo fleets={[]} filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} /> */}
            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                {/* <FormTypeOfCargo selectedItem={null} refetch={refetch} setTriggleSubmit={setTriggleSubmit} setOpenForm={setOpenForm} /> */}
            </FormDisplay>
        </>
    );
};

export default ExpenseManager;


