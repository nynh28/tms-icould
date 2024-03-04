import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    // AddDriver,
    // AssignTruckToDriver,
    DeleteIDSender,
    CustomAsyncSelect,
} from "../components";
import {
    useGetIDSenderQuery,
    useGetDriversQuery,
    useGetFleetCarriersQuery,
} from "../services/apiSlice";
import { BsFilter } from "react-icons/bs";
import { TrashIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import { ROLES } from "../constants/constants";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import UpdateDriver from "../components/Driver/UpdateDriver";
import { MdOutlineCheckBox, MdOutlineClose } from "react-icons/md";
import { Divider } from "@mui/material";
import { IoChevronBack, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import FilterDriver from "../components/Driver/FilterDriver";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import FilterRightBar from "../components/FilterRightBar";
import FormIDSender from "../components/IDSender/FormIDSender";
import DetailIDSender from "../components/IDSender/DetailIDSender";
import FilterIDSender from "../components/IDSender/FilterIDSender";

const IDSenderManagement = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedRowUpdate, setSelectedRowUpdate] = useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState({ groupId: null, truckType: null, plateLicence: null, brand: null });
    const [openEdit, setOpenEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        // groupId: "",
        // isMapped: false,
    });
    const { data, isLoading, isFetching, isSuccess, refetch } =
        useGetIDSenderQuery(criterias);


    const showDetailRow = (params) => {
        console.log(params)
        setSelectedRow(params.row)
        setShowDetail(true)
        // setSelectedRowID(params.id)
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

    const handleChangePage = (event, newPage) => {
        setCriterias({ ...criterias, page: newPage });
    };

    const onShowModalDelete = (id) => {
        setSelectedItem(id);
        setOpen(true);
    };

    const onShowEdit = (staff) => {
        setSelectedEdit(staff);
        setOpenEdit(true);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const updateFilter = (value) => {
        setCriterias({ ...criterias, ...value });
        // refetch()
    };

    const handleChange = (value) => {
        setCriterias({ ...criterias, groupId: value ? value : null });
    };

    const onDoneDelete = (e) => {
      setOpen(false)
      setShowDetail(false)
      refetch()
    }

    const columns = [
      {
        field: "idSender",
        headerName: t("idSender"),
        minWidth: 150,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "senderName",
        headerName: t("senderName"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "senderNumber",
        headerName: t("senderNumber"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "description",
        headerName: t("description"),
        minWidth: 200,
        flex: 1,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "villageNo",
        headerName: t("villageNo"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "lane",
        headerName: t("lane"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "other",
        headerName: t("other"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "road",
        headerName: t("road"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "subDistrict",
        headerName: t("subDistrict"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "district",
        headerName: t("district"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "province",
        headerName: t("province"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "postalCode",
        headerName: t("postalCode"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "lat",
        headerName: t("lat"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
      {
        field: "lng",
        headerName: t("lng"),
        minWidth: 200,
        //   headerAlign: 'center',
        //   align: 'center',
      },
        // {
        //   field: "action",
        //   headerName: t("action"),
        //   minWidth: 150,
        //   renderCell: (params) => (
        //     <div className="flex gap-2">
        //       <Tooltip title={t("updateIDSender")} placement="top-start" arrow>
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

    return (
        <>
            <div className=" flex">
                <div className="flex-1 transition-all duration-[300ms]">

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
                                            {t('IDSender')}
                                        </div>
                                        <div className="action flex items-center gap-[8px]">
                                            <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenForm(true)}>+ {t('add')}</button>
                                            <Divider orientation="vertical" flexItem variant="middle" />
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
                                    getRowId={(row) => row.id}
                                    rows={data?.content || []}
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

                            <DeleteIDSender open={open} setOpen={onDoneDelete} deleteId={selectedItem} />

                        </div>
                    </div>
                </div>
                <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="h-[50px] py-1 border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                {t('IDSender')}
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
                                        <Tooltip title={'Delete'} placement="bottom-start" arrow>
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
                                        <Divider orientation="vertical" flexItem variant="middle" />
                                        &nbsp;
                                        <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
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
                            {showDetail && (openEdit ? <FormIDSender selectedItem={selectedRow} refetch={refetch} triggleSubmit={triggleSubmit} setTriggleSubmit={setTriggleSubmit} setOpenForm={setShowDetail} submitError={() => setTriggleSubmit(false)}  /> : <DetailIDSender detailRow={selectedRow} />)}
                        </div>
                    </div>
                </div>
            </div>
            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}>
                <FilterIDSender fleets={[]} filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}/>
                {/* <FilterDriver fleets={[]}/> */}
            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                <FormIDSender selectedItem={null} refetch={refetch} setTriggleSubmit={setTriggleSubmit} setOpenForm={setOpenForm} />
                {/* <AddTruckForm1 fleets={[]} setOpenForm={setOpenForm} /> */}
            </FormDisplay>
        </>
        // <div className="h-full min-h-[calc(100vh_-_190px)] px-4 sm:px-6 lg:mx-auto lg:max-w-full lg:px-8">
        //   <div className="flex h-full flex-col rounded-lg bg-white shadow-sm">
        //     <div className="p-7 sm:flex sm:items-center">
        //       <div className="sm:flex-auto">
        //         <h1 className="text-xl font-semibold text-gray-900">
        //           {t("IDSender")}
        //         </h1>
        //       </div>
        //       <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none ">
        //       <Button
        //             variant="contained"
        //             className="px-6 capitalize"
        //             startIcon={<FiUserPlus className="h-5 w-5" />}
        //             onClick={() => {
        //                 setSelectedEdit({})
        //                 setOpenEdit(true)
        //             }}
        //         >
        //             {t("addIDSender")}
        //         </Button>
        //       </div>
        //     </div>

        //     <div className="flex flex-1 flex-col p-2">
        //       <DataGrid
        //         loading={isLoading || isFetching}
        //         components={{
        //           LoadingOverlay: LinearProgress,
        //         }}
        //         getRowId={(row) => row.id}
        //         rows={data?.content || []}
        //         columns={columns}
        //         rowsPerPageOptions={[25, 50, 100]}
        //         disableSelectionOnClick
        //         paginationMode="server"
        //         rowCount={data?.totalElements || 0}
        //         pageSize={data?.size || 25}
        //       />
        //     </div>
        //     <FormIDSender selectedItem={selectedEdit} openForm={openEdit} setOpenForm={setOpenEdit} refetch={refetch}></FormIDSender>
        //     <DeleteIDSender open={open} setOpen={setOpen} deleteId={selectedItem} />
        //   </div>
        // </div>
    );
};

export default IDSenderManagement;


