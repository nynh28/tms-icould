import LinearProgress from "@mui/material/LinearProgress";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LoadingButton } from "@mui/lab";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import { MdOutlineCheckBox, MdOutlineClose } from "react-icons/md";
import { Checkbox, Divider } from "@mui/material";
import { IoChevronBack, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import { FaEdit, FaRegTrashAlt, FaUnlock } from "react-icons/fa";
import FormDisplay from "../components/FormDisplay";
import FilterRightBar from "../components/FilterRightBar";

import { useGetRoleQuery, useGetUserQuery, useUnlockUserMutation } from "../services/apiSlice";
import FormUser from "../components/User/FormUser";
import DetailUser from "../components/User/DetailUser";
import DeleteUser from "../components/User/DeleteUser";
import FilterUser from "../components/User/FilterUser";
import { toast } from "react-hot-toast";
import ChangePassword from "../components/User/ChangePassword";
// import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane'

const UserManagement = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [filter, setFilter] = useState({});
    const [openEdit, setOpenEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [triggleSubmit, setTriggleSubmit] = useState(false)
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [tableData, settableData] = useState([])
    const [enableCheckbox, setEnableCheckbox] = useState(false)
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        roleName: "",
        userName: ''
    });

    const { data, isLoading, isFetching, isSuccess, refetch } =
        useGetUserQuery(criterias);


    const { data: listRole } = useGetRoleQuery({page: 0, rowsPerPage: 99});


    const [unlockUser, { isLoading: isLoadingUnlock }] = useUnlockUserMutation();

    const handleUnlock = async () => {
        if (selectedRow && selectedRow.id) {
            await unlockUser(selectedRow.id)
            toast.success(t("message.success.unlock", { field: t("User") }));
            setShowDetail(false)
            refetch()
        }
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
        {
            field: "userId",
            headerName: t("id"),
            renderCell: ({ row, value }) => (
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
                    {value}
                </div>
            ),
            minWidth: 150,
        },
        {
            field: "branchIdString",
            headerName: t("branchId"),
            minWidth: 100,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "userName",
            headerName: t("userName"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "roleName",
            headerName: t("roleName"),
            minWidth: 150,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "fullName",
            headerName: t("fullName"),
            minWidth: 250,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "phone",
            headerName: t("phone"),
            minWidth: 200,
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "email",
            headerName: t("email"),
            minWidth: 200,
            //   headerAlign: 'center',
            //   align: 'center',
        },

        // {
        //     field: "avatar",
        //     headerName: t("avatar"),
        //     minWidth: 300,
        //     //   headerAlign: 'center',
        //     //   align: 'center',
        // },
        {
            field: "isActive",
            headerName: t("isActive"),
            minWidth: 120,
            renderCell: ({ value }) => value ? (<span className="text-[#00b11f]">{t("active")}</span>) : (<span className="text-[#cc0b0b] font-semibold">{t("inActive")}</span>),
            //   headerAlign: 'center',
            //   align: 'center',
        },
        {
            field: "isLocked",
            headerName: t("isLocked"),
            minWidth: 120,
            renderCell: ({ value }) => value ? (<span className="text-[#cc0b0b] font-semibold">{t("locked")}</span>) : (<span className="text-[#00b11f]">{t("normal")}</span>),

            // renderCell: ({value}) => value ? 'Locked' : 'Normal',
            //   headerAlign: 'center',
            //   align: 'center',
        },


        // {
        //     field: "action",
        //     headerName: "",
        //     minWidth: 10,
        //     width: 10,
        //     align: "right",
        //     renderCell: (params) => (
        //         <div className="flex gap-2">
        //             <FaAngleRight />

        //         </div>
        //     ),
        // },
    ];

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
                                                    {t('User')}
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

                                    <DeleteUser open={open} setOpen={onDoneDelete} deleteId={selectedRow?.id} />

                                </div>
                            </div>
                        </div>
                        <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                            <div className="bg-white">
                                <div className="h-[50px] border-b px-3 flex justify-between items-center">
                                    <div className="title text-[16px]">
                                        {t('User')}
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

                                                <Tooltip title={'Change Password'} placement="bottom-start" arrow>
                                                    <button onClick={() => setShowChangePassword(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaEdit className="mr-2" />
                                                        <span>Change Password</span>
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title={'Edit'} placement="bottom-start" arrow>
                                                    <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaEdit className="mr-2" />
                                                        <span>Edit</span>
                                                    </button>
                                                </Tooltip>
                                                {/* <Tooltip title={'Change Password'} placement="bottom-start" arrow>
                                            <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                <FaEdit className="mr-2" />
                                                <span>Change Password</span>
                                            </button>
                                        </Tooltip> */}
                                                {selectedRow?.isLocked && <Tooltip title={'UnLock'} placement="bottom-start" arrow>
                                                    <LoadingButton
                                                        onClick={() => handleUnlock()}
                                                        loading={isLoadingUnlock}
                                                        className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                        <FaUnlock className="mr-2" />
                                                        <span>UnLock</span>
                                                    </LoadingButton>
                                                </Tooltip>}
                                                <Divider orientation="vertical" flexItem variant="middle" />
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
                                    {showDetail && (openEdit ? <FormUser listRole={listRole}  selectedItem={selectedRow} refetch={() => { refetch(); setOpenEdit(false) }} triggleSubmit={triggleSubmit} setTriggleSubmit={setTriggleSubmit} setOpenForm={setShowDetail} submitError={() => setTriggleSubmit(false)} /> : <DetailUser detailRow={selectedRow} />)}
                                </div>
                            </div>
                        </div>
                {/* <SplitPane split="vertical" onChange={changePane}>
                    <Pane minSize="30%" maxSize="100%">
                    </Pane>
                    {showDetail && <Pane initialSize={detailPaneWidth + "%"} minSize="30%" maxSize="70%">
                    </Pane>}
                </SplitPane> */}

            </div>

            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}>
                <FilterUser filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter} />
                {/* <FilterUser fleets={[]} filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}/> */}
            </FilterRightBar>
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                <FormUser listRole={listRole} selectedItem={null} refetch={refetch} setTriggleSubmit={setTriggleSubmit} setOpenForm={setOpenForm} />
            </FormDisplay>
            <ChangePassword open={showChangePassword} setOpen={setShowChangePassword} user={selectedRow} refetch={refetch} />
        </>
    );
};

export default UserManagement;
