import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomAsyncSelect,
} from "../components";
import {
    useGetDocumentTypeQuery,
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
import DetailDriver from "../components/Driver/DetailDriver";
import FormDriver from "../components/Driver/FormDriver";

const DriverManagement = () => {
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
    const [enableCheckbox, setEnableCheckbox] = useState(false)
  const [criterias, setCriterias] = useState({
    page: 0,
    rowsPerPage: 25,
    // isMapped: false,
  });
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


  const { data, isLoading, isFetching, isSuccess, refetch } =
  useGetDriversQuery(criterias);

 

  const columns = [
    {
      field: "id",
      headerName: t("driverId"),
      minWidth: 100,
    },
    {
      field: "userName",
      headerName: t("userName"),
      minWidth: 200,
    },
    {
      field: "fullName",
      headerName: t("fullName"),
      minWidth: 200,
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: t("phoneNumber"),
      minWidth: 200,
    },
    {
      field: "email",
      headerName: t("email"),
      minWidth: 200,
    },
    {
      field: "drivingLicenceNumber",
      headerName: t("drivingLicense"),
      minWidth: 200,
    },
    {
      field: "insuranceExpirationDate",
      headerName: t("insuranceExpirationDate"),
      minWidth: 200,
    }
    // {
    //   field: "action",
    //   headerName: t("action"),
    //   minWidth: 140,
    //   renderCell: (params) => (
    //     <div className="flex gap-2">
    //       <AssignTruckToDriver driver={params.row} refetch={refetch} />
    //       <Tooltip title={t("update")} placement="top-start" arrow>
    //         <a
    //           href="#"
    //           className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
    //           onClick={() => onShowUpdate(params.row)}
    //         >
    //           <AiFillEdit className="h-5 w-5 text-purple-500 group-hover:text-white" />
    //         </a>
    //       </Tooltip>
    //       <Tooltip title={t("delete")} placement="top-start" arrow>
    //         <a
    //           href="#"
    //           className="group rounded-lg border border-gray-200 p-1 hover:bg-red-500"
    //           onClick={() => onShowModalDelete(params.row)}
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
                                            {t('driver')}
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

                            {/* <DeleteTruck open={open} setOpen={onDoneDelete} truckId={selectedTruck} /> */}
                           
                        </div>
                    </div>
                </div>
                <div className={(showDetail ? 'w-[800px]' : 'w-[0px]') + " w-[800[px] transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="py-1 h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                Driver
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
                            {showDetail && (openEdit ? <FormDriver triggleSubmit={triggleSubmit} submitError={() => setTriggleSubmit(false)} /> : <DetailDriver detailRow={selectedRow} />)}
                        </div>
                    </div>
                </div>
            </div>
            <FilterRightBar open={openFilter} setOpen={setOpenFilter} >

                <FilterDriver fleets={[]}/>

            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                <FormDriver setOpenForm={setOpenForm} />
            </FormDisplay>
    </>
    // <div className="h-full min-h-[calc(100vh_-_190px)] px-4 sm:px-6 lg:mx-auto lg:max-w-full lg:px-8">
    //   <div className="flex h-full flex-col rounded-lg bg-white shadow-sm">
    //     <div className="p-7 sm:flex sm:items-center">
    //       <div className="sm:flex-auto">
    //         <h1 className="text-xl font-semibold text-gray-900">
    //           {t("drivers")}
    //         </h1>
    //       </div>
    //       <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
    //         {(role === ROLES.Company || role === ROLES.Carrier) && (
    //           <AddDriver refetch={refetch} />
    //         )}
    //       </div>
    //     </div>
    //     <div className="space-x-4 px-7 pb-4 pt-2">
    //       <div className="flex items-center gap-4">
    //         <CustomAsyncSelect
    //           label="branchName"
    //           data={dataFleet?.content.map((item) => ({
    //             id: item.groupId,
    //             text: item.groupName,
    //           }))}
    //           isFetching={isFetchingFleet}
    //           isLoading={isLoadingFleet}
    //           onChange={handleChange}
    //         />

    //         <CustomAsyncSelect
    //           label="phone"
    //           data={data?.content?.map((item) => ({
    //             id: item.phoneNumber,
    //             text: item.phoneNumber,
    //           }))}
    //           isFetching={isFetching}
    //           isLoading={isLoading}
    //           onChange={handleChangePhone}
    //         />

    //         <CustomAsyncSelect
    //           label="fullName"
    //           data={data?.content?.map((item) => ({
    //             id: item.fullName,
    //             text: item.fullName,
    //           }))}
    //           isFetching={isFetching}
    //           isLoading={isLoading}
    //           onChange={handleChangeFullName}
    //         />
    //         <div className="flex items-end justify-end">
    //           <BsFilter className="h-7 w-7" />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex flex-1 flex-col p-4">
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
    //         onPageChange={(page) => {setCriterias({...criterias, page})}}
    //         onPageSizeChange={(rowsPerPage) => {setCriterias({...criterias, rowsPerPage})}}
    //       />
    //     </div>
    //     <DeleteDriver
    //       open={open}
    //       setOpen={setOpen}
    //       driverId={selectedDriver?.id}
    //       driverName={selectedDriver?.fullName}
    //     />
    //     <UpdateDriver formData={selectedRowUpdate} openUpdate={openUpdate} setOpenUpdate={setOpenUpdate} refetch={refetch}/>

    //   </div>
    // </div>
  );
};

export default DriverManagement;
