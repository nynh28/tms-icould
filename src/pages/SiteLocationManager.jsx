import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    AddTruck,
    AssignDriverToTruck,
    CustomAsyncSelect,
    DeleteTruck,
} from "../components";
import { useGetFleetsQuery, useGetIDSiteDCQuery, useGetTrucksQuery } from "../services/apiSlice";
import { BsFilter } from "react-icons/bs";
import { HomeIcon, TrashIcon } from "@heroicons/react/outline";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import EditTruck from "../components/Truck/EditTruck";
import { AiFillEdit, AiOutlineExpandAlt } from "react-icons/ai";
import CustomTextField from "../components/FormField/CustomTextField";
import { Avatar, Card, CardActionArea, CardHeader, Divider, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import { IoFilterOutline } from "react-icons/io5";
import AddTruckForm from "../components/Truck/Form";
import { Transition } from "@headlessui/react";
import { IoMdMore } from "react-icons/io";
import ItemSiteLocation from "../components/SiteLocation/ItemSiteLocation";
import FormDisplay from "../components/FormDisplay";
import FormSiteLocation from "../components/SiteLocation/FormSiteLocation";
import { LoadingButton } from "@mui/lab";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import DetailSiteLocation from "../components/SiteLocation/DetailSiteLocation";
import { setListLocation } from "../features/mapLocation/mapLocationSlice";

const SiteLocation = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
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
        rowsPerPage: 1000,
        // groupId: "",
        // isMapped: false,
    });

    const { data, isLoading, isFetching, isSuccess, refetch } =
        useGetIDSiteDCQuery(criterias);

    useEffect(_ => {
        if(data && data.content){
            dispatch(setListLocation(data.content))
        }
    }, [data]) 

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
    // const onShowModalDelete = (id) => {
    //         setOpen(true);
    //     };
    
    
    //     const updateFilter = (value) => {
    //         setCriterias({ ...criterias, ...value });
    //     };
    
    
    //     const onDoneDelete = (e) => {
    //         setOpen(false)
    //         setShowDetail(false)
    //         refetch()
    //     }

    return (
        <>
            <div className="flex">
                <div className="flex-1 transition-all duration-[300ms]">

                    <div className="bg-white">
                        <div className="py-1 h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                Site Location
                            </div>
                            <div className="action flex items-center gap-[8px]">
                                <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenForm(true)}>+ Add</button>
                                <Divider orientation="vertical" flexItem variant="middle" />
                                &nbsp;
                                <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                {/* <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" /> */}
                            </div>
                        </div>
                    </div>
                <div className="flex h-[calc(100vh_-_110px)] overflow-auto">

                    <div className="py-2 px-3 w-full">
                        <div className="grid grid-cols-4 gap-4">
                            {data && data?.content.map(site => {
                                if(site){

                                    return(
                                        <ItemSiteLocation key={site.id} setSelectedRow={(e) => {setSelectedRow(e); setShowDetail(true); console.log(e)}} detail={site} refetch={refetch}/>
                                    )
                                }
                            })}
                           {/* <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/>
                           <ItemSiteLocation  refetch={refetch}/> */}
                        </div>
                    </div>
                </div>
                </div>
            <div className="h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full ">
                <div className={(showDetail ? 'w-[600px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                {t('TypeOfCargo')}
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
                                        {/* <Tooltip title={'Back'} placement="bottom-start" arrow>
                                            <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]" onClick={getPrevRow}>
                                                <IoChevronBack className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title={'Next'} placement="bottom-start" arrow>
                                            <button className="rounded-full p-1 outline-none hover:bg-[#f1f1f1]" onClick={getNextRow}>
                                                <IoChevronForward className="h-6 w-6 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip> */}
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
                            {showDetail && (openEdit ? <FormSiteLocation selectedItem={selectedRow} refetch={() => {refetch(); setOpenEdit(false)}} triggleSubmit={triggleSubmit} setTriggleSubmit={setTriggleSubmit} setOpenForm={setShowDetail} submitError={() => setTriggleSubmit(false)}  /> : <DetailSiteLocation detailRow={selectedRow} />)}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            
            <FormDisplay open={openForm} setOpen={setOpenForm} >
                <FormSiteLocation selectedItem={null} refetch={refetch} setTriggleSubmit={setTriggleSubmit} setOpenForm={setOpenForm} />
            </FormDisplay>
        </>
    );
};

export default SiteLocation;

// import React, { useState } from 'react'
// import { AddTruck } from '../components'

// const TruckManagement = () => {
//   console.log("Truck Management");
//   const [number, setNumber] = useState(1);
//   return (
//     <>
//     <div>TruckManagement</div>
//     <button onClick={() => setNumber(prev => prev + 1)}>Increase</button>
//     <AddTruck />
//     </>
//   )
// }

// export default TruckManagement
