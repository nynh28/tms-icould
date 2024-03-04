import { DataGrid } from '@mui/x-data-grid';
import React, { Component, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { BsCamera, BsFillCircleFill, BsPencil } from 'react-icons/bs';
import { FaEdit, FaPencilAlt, FaTruck } from 'react-icons/fa';
import { HiOutlineCreditCard, HiOutlinePencilAlt } from 'react-icons/hi';
import { BiPhoneCall } from 'react-icons/bi';
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, CardContent, Divider, LinearProgress, Tooltip } from '@mui/material';
import { IoChevronBack, IoChevronForward, IoFilterOutline } from 'react-icons/io5';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { useGetShipmentsOrderQuery, useGetTypeOfCargoQuery, useLazyGetShipmentsOrderQuery } from '../services/apiSlice';
import { MdOutlineClose } from 'react-icons/md';
import DetailPlanning from '../components/Planning/DetailPlanning';
import DetailShipment from '../components/Planning/DetailShipment';
import ChangeStatus from '../components/Planning/ChangeStatus';
import dayjs from 'dayjs';
import FilterRightBar from '../components/FilterRightBar';
import FilterApprovedShipment from '../components/Planning/FilterApprovedShipment';
import { shipmentStatusObject } from '../constants/constants';
import DeliveryOrderHistoryModal from '../components/Planning/DeliveryOrderHistoryModal';
import { useDispatch } from 'react-redux';
import { setSelectedShipment } from '../features/shipment/shipmentSlice';
// import DetailShipment from '../components/Planning/DetailShipment';

const OrderTracking = () => {
    const { t } = useTranslation();
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDetail, setShowDetail] = useState(false)
    const [openEdit, setOpenEdit] = useState(false);
    const [openHistoryDO, setOpenHistoryDO] = useState(false);
    const [selectedDO, setSelectedDO] = useState(null)
    const [openFilter, setOpenFilter] = useState(false);
    const [triggleFiter, setTriggleFiter] = useState(false)
    const [tableData, setTableData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(0)
    
    const dispatch = useDispatch()
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        dateFrom: dayjs().subtract(1, 'months').startOf('day'),
        dateTo: dayjs().endOf('day'),
        shipmentStatus: [ 2,3,4,5, 6],
    });

    const { data: typeOfGood } =
        useGetTypeOfCargoQuery({ page: 0, rowsPerPage: 100 });

    const getTypeOfGood = (type) => {
        if (typeOfGood && typeOfGood.content) {

            let t = Number(type);
            let find = typeOfGood.content.find(i => i.id == type)
            if (find) {
                return find.englishName
            }
        }
        return type
    }

    const [fetchData, { data, isLoading, isFetching, isSuccess }] = useLazyGetShipmentsOrderQuery();
    // const data = [
    //     { id: 1 },
    //     { id: 2 },
    //     { id: 3 },
    //     { id: 4 },
    // ]


    useEffect(e => {
        if(selectedRow && selectedRow.id && !selectedRow.deliveryOrderId){
            dispatch(setSelectedShipment(selectedRow))
        }
    }, [selectedRow])

    useEffect(_ => {
        fetchData(criterias)
    }, []) 

    const refetch =() => {
        fetchData({...criterias, page: 0, })
    }

    useEffect(_ => {
        if(!isFetching){
            setTimeout(_ => {
                setTriggleFiter(false)

            },500)
        }
    }, [isFetching])

    useEffect(_ => {
        if(data?.content){
            setTableData([...data.content])
        }else{
            setTableData([])
        }
    }, [data?.content])

    const handleOpenHistoryDO = (item) => {
        setSelectedDO(item)
        if(item && item.id){
            setOpenHistoryDO(true)
        }
        
    }

    const getStatusValue = (status) => {

    }



    const shipmentStatus1 = [
        {id: 1, value : 'Planning'},
        {id: 2, value : 'Preparing for Delivery'},
        {id: 3, value : 'Picking for Delivery'},
        {id: 4, value : 'On Delivery'},
        {id: 5, value : 'Delivery Completed'},
    ]

    const shipmentStatus2 = shipmentStatusObject

    const getStatusColor = (status) => {
        let color = ''
        let text = ''
        switch (status) {
            case 1:
                // color = 'bg-primary-100'
                text = 'Not Started'
                break
            case 2:
                // color = 'bg-primary-100'
                text = 'Checkin start'
                break
            case 3:
                // color = 'bg-primary-100'
                text = 'Checkin finish'
                break
            case 4:
                // color = 'bg-primary-100'
                text = 'Loading start'
                break
            case 5:
                // color = 'bg-primary-100'
                text = 'Loading finish'
                break
            case 6:
                // color = 'bg-primary-100'
                text = 'Loading complete start'
                break
            case 7:
                color = 'bg-primary-100'
                text = 'Loading complete finish'
                break
            case 8:
                color = 'bg-[#00b11f]'
                text = 'Delivery finish'
                break;
            case 9:
                color = 'bg-red-100';
                text = 'Delivery Reject'
                break;
            default:
                break
        }
        return { color, text }
    }

    const updateFilter = (value) => {
        // console.log(value)
        fetchData({ ...criterias, ...value })
        setCriterias({ ...criterias, ...value });
    };

    const filterByStatus = (status) => {
        setSelectedStatus(status)
        if(status == 0){
            setTableData((data.content || []))
            return
        }
        const newData = (data.content || []).filter(i => i.shipmentStatus == status)
        setTableData(newData)
        // console.log(newData)
    }

    const columns = [
        {
            field: "driver",
            headerName: t("Driver & Truck"),
            width: 250,
            headerAlign: 'center',
            headerClassName: " w-100 font-light  px-2",
            // headerClassName: " w-100 bg-[#fff4bc] font-light text-[20px] px-2",
            renderCell: ({ row }) => (
                <div className='w-full flex flex-col justify-evenly h-full' onClick={() => { setSelectedRow(row); setShowDetail(true) }}>
                    
                    {row.shipmentStatus == 2 && <h4 className='text-xl text-[#EF4444] border text-center border-[#EF4444] py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>}
                    {row.shipmentStatus == 3 && <h4 className='text-xl text-primary-500 border text-center border-primary-500 py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>}
                    {row.shipmentStatus == 4 && <h4 className='text-xl text-[#4229cf] border text-center border-[#4229cf] py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>}
                    {row.shipmentStatus == 5 && <h4 className='text-xl text-[#ffc018] border text-center border-[#ffc018] py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>}
                    {row.shipmentStatus == 6 && <h4 className='text-xl text-[#00b11f] border text-center border-[#00b11f] py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>}
                    {/* {row.shipmentStatus == 6 && <h4 className='text-xl text-[#00b11f] border text-center border-[#00b11f] py-2'>{shipmentStatus2[row.shipmentStatus]}</h4>} */}
                    {/* <h4 className='text-xl'>{shipmentStatus2[row.shipmentStatus]}</h4> */}
                    <div>

                    <p className='text-[#ffc018] text-[18px] font-weigh-medium'>{t("driver")}: {row.driverName}</p>
                    <p>{t("shipmentNo")}: {row.shipmentId}</p>
                    <p>{t("tel")}: {row?.driver?.phoneNumber}</p>
                    <p>{t("totalDO")}: {row.deliveryOrderList.length}</p>
                    <p>{t("truck")}: {row?.truck?.plateLicense} - {row?.truck?.carCharactersName}</p>
                    <p>{t("createdDate")}: {dayjs(row?.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                    <div className='flex justify-between'>

                        {/* <div className='flex items-center gap-[5px]'>
                            Driver
                            <BsFillCircleFill className="text-primary-500 text-[12px]" />
                        </div> */}
                        {/* <div>
                            <HiOutlineCreditCard className='text-primary-500 text-[30px]' />
                        </div> */}
                    </div>
                    </div>
                </div>
            )
        },
        {
            field: "id",
            headerName: t("Order"),
            minWidth: 150,
            width: 1000,
            flex: 1,
            sortable: false,
            cellClassName: "p-0",
            headerAlign: 'center',
            headerClassName: " w-100 px-2",
            // headerClassName: " w-100 bg-[#fff4bc] font-light text-[20px] px-2",
            renderCell: ({ row }) => (
                <PerfectScrollbar>

                <table className='block'>
                    <tbody>

                        <tr className=''>
                            {
                                row.deliveryOrderList && row.deliveryOrderList.map((item, index) => {
                                    return (
                                        <td key={index} className={
                                            (getStatusColor(item.status).color) + ' border border-l-0 min-w-[300px] w-[300px] border-t-0'
                                        }>
                                            <div className='flex text-[20px] items-center py-1 '>
                                                <div className='w-[20%]'>
                                                    <BsPencil onClick={() => { setSelectedRow(item); setShowDetail(true) }} className='m-auto cursor-pointer ' />
                                                </div>
                                                <div className='w-[20%]'>
                                                    <BsCamera className='m-auto cursor-pointer' onClick={() => handleOpenHistoryDO({...item, createdAt: row.createdAt})}/>
                                                </div>
                                                <div className='w-[20%]'>
                                                    <HiOutlinePencilAlt className='m-auto cursor-pointer' />
                                                </div>
                                                <div className='w-[20%]'>
                                                    <FaTruck className='m-auto cursor-pointer' />
                                                </div>
                                                <div className='w-[20%]'>
                                                    <BiPhoneCall className='m-auto cursor-pointer' />
                                                </div>
                                            </div>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                        <tr>
                            {row.deliveryOrderList && row.deliveryOrderList.map((item, index) => {
                                return (
                                    <td key={index} onClick={() => { setSelectedRow(item); setShowDetail(true) }} className='p-2 border border-l-0 border-b-0 text-[12px] text-[#444]'>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Sender Name:</span>
                                            {item?.senderName}
                                        </div>
                                        <div className='flex justify-between'>
                                            <div>
                                                <span className='text-[#eb3936] font-medium mr-2'>Document Type:</span>
                                                {item?.documentType}
                                            </div>
                                            <div>
                                                <span className='text-[#eb3936] font-medium mr-2'>Delivery Status:</span>
                                                {item?.deliveryStatus}
                                            </div>
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Invoice No:</span>
                                            {item?.invoiceNo}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Receiver's Name:</span>
                                            {item?.senderName}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Receiver's Phone:</span>
                                            {item?.senderPhone}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Loading box:</span>
                                            {item?.loadingBox}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Loading weight:</span>
                                            {item?.loadingWeight}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Loading CBM:</span>
                                            {item?.loadingCbm}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Due Date:</span>
                                            {(item?.dueDate)}
                                        </div>
                                        <div>
                                            <span className='text-[#eb3936] font-medium mr-2'>Pickup note:</span>
                                            {item?.pickupNote}
                                        </div>
                                        {/* <p className='text-[16px] text-[#111] font-weight-medium'>{getTypeOfGood(item.typeOfGood)}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("orderNo")}:</span> {Number(item.deliveryId)}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("pickupPoint")}:</span> {item.pickupPoint}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("pickupTime")}:</span> {item.pickupTime}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("deliveryPoint")}:</span> {item.deliveryPoint}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("dueDate")}:</span> {item.dueDate}</p>
                                        <p className='mb-[5px]'><span className='font-medium'>{t("state")}:</span> {getStatusColor(item.status).text}</p> */}
                                        {/* <p className='mb-1'>Due Date: {item.dueDate}</p>
                                        <p className='mb-1'>Actual: 09:00 - 09:30</p> */}
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
                </PerfectScrollbar>
            )
        },
    ];


    return (
       
        <>
            <div className="relative flex">
                <div className="flex-1 transition-all duration-[300ms]">
                    <div className="bg-white">
                        <div className="h-[50px] py-1 border-b px-3 flex justify-between items-center">
                            {/* {
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
                                ) : ( */}
                            <>
                                <div className="title text-[16px] flex overflow-hidden gap-5">
                                    {/* {t('orderTracking')} */}
                                    <span className='cursor-pointer whitespace-nowrap' onClick={() => filterByStatus(0)}>
                                        Tracking Shipment Order
                                    </span>
                                    <div className='flex gap-5'>
                                        <span className={(selectedStatus == 2 && 'underline')+ " text-[#EF4444] cursor-pointer  font-bold"} onClick={() => filterByStatus(2)}>Waiting Driver Accept ({(data?.content || []).filter(i => i.shipmentStatus ==2).length})</span>
                                        <span className={(selectedStatus == 3 && 'underline')+ " text-[#5f6368] cursor-pointer  font-bold"} onClick={() => filterByStatus(3)}>Not Started ({(data?.content || []).filter(i => i.shipmentStatus ==3).length})</span>
                                        <span className={(selectedStatus == 4 && 'underline')+ " text-primary-900 cursor-pointer  font-bold"} onClick={() => filterByStatus(4)}>Started ({(data?.content || []).filter(i => i.shipmentStatus ==4).length})</span>
                                        <span className={(selectedStatus == 5 && 'underline')+ " text-[#F59E0B] cursor-pointer  font-bold"} onClick={() => filterByStatus(5)}>On Delivery ({(data?.content || []).filter(i => i.shipmentStatus == 5).length})</span>
                                        <span className={(selectedStatus == 6 && 'underline')+ " text-[#00b11f] cursor-pointer  font-bold"} onClick={() => filterByStatus(6)}>Delivery Completed ({(data?.content || []).filter(i => i.shipmentStatus == 6).length})</span>
                                    </div>
                                </div>
                                <div className="action flex items-center gap-[8px]">
                                            {/* <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => setOpenForm(true)}>+ {t('add')}</button> */}
                                            {/* <Divider orientation="vertical" flexItem variant="middle" /> */}
                                            {/* &nbsp; */}
                                            <IoFilterOutline onClick={() => setOpenFilter(true)} className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />

                                            {/* <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" /> */}
                                            {/* <button onClick={() => setEnableCheckbox(true)}>
                                                <MdOutlineCheckBox className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                                            </button> */}
                                        </div>
                            </>
                            {/* ) */}
                            {/* } */}

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
                                        overflowX: 'scroll'
                                    }}
                                    // getRowId={(row) => row.id}
                                    rows={tableData || []}
                                    // hideFooter={true}
                                    headerHeight={38}
                                    // rowHeight={38}
                                    // checkboxSelection
                                    getRowHeight={() => 'auto'}
                                    // onRowClick={(params) => showDetailRow(params)}
                                    columns={columns}
                                    getRowId={(row) => row.shipmentId}
                                    // selectionModel={selectedRow?.shipmentId}
                                    showCellRightBorder={true}
                                    disableSelectionOnClick
                                    rowsPerPageOptions={[25, 50, 100]}
                                    paginationMode="server"
                                    rowCount={data?.totalElements || 0}
                                    pageSize={data?.size || 25}
                                    onPageChange={(page) => { setCriterias({ ...criterias, page });fetchData(criterias) }}
                                    onPageSizeChange={(rowsPerPage) => { setCriterias({ ...criterias, rowsPerPage });fetchData(criterias) }}
                                />
                            </div>

                            {/* <DeleteTruck truckTypes={dataTruckTypes} open={open} setOpen={onDoneDelete} deleteId={selectedRow?.id} /> */}

                        </div>
                    </div>
                </div>
                <div className={(showDetail ? 'w-[650px]' : 'w-[0px]') + " transition-all duration-[300ms]  border-l"}>
                    <div className="bg-white">
                        <div className="py-1 h-[50px] border-b px-3 flex justify-between items-center">
                            <div className="title text-[16px]">
                                {selectedRow?.type == 'DO' ? 'Delivery Order Detail' : 'Shipment Detail'}
                            </div>
                            <div className="action flex items-center gap-[8px]">
                                {/* {openEdit ? (
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
                                ) : ( */}
                                    <>
                                        {/* <Tooltip title={'Delete'} placement="bottom-start" arrow>
                                            <button onClick={() => onShowModalDelete(selectedRow.id)} className="p-1 outline-none hover:bg-[#f1f1f1] border rounded-[5px]">
                                                <FaRegTrashAlt className="h-6 w-6 flex-shrink-0 text-primary-900 cursor-pointer" aria-hidden="true" />
                                            </button>
                                        </Tooltip> */}
                                        {selectedRow?.deliveryOrderId
                                            ? <Tooltip title={'Change DO State'} placement="bottom-start" arrow>
                                                <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                    <FaEdit className="mr-2" />
                                                    <span>Change DO State</span>
                                                </button>
                                            </Tooltip>
                                            : <Tooltip title={'Change Shipment State'} placement="bottom-start" arrow>
                                                <button onClick={() => setOpenEdit(true)} className="btn-primary py-[6px] px-3 rounded-[5px] flex items-center bg-primary-900 text-[13px] text-white">
                                                    <FaEdit className="mr-2" />
                                                    <span>Change Shipment State</span>
                                                </button>
                                            </Tooltip>
                                        }
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
                                {/* )} */}

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
                        <div className="max-w-[600px] p-4 min-h-[50vh] bg-white border m-auto ">
                            {showDetail && (selectedRow?.deliveryOrderId ? <DetailPlanning detailRow={selectedRow} /> : <DetailShipment detailRow={selectedRow} />)}
                        </div>
                    </div>
                </div>
            </div>
            <FilterRightBar open={openFilter} setOpen={setOpenFilter} triggleFilter={triggleFiter} setTriggleFiter={setTriggleFiter} >
                <FilterApprovedShipment menu='approved' filter={criterias} setFilter={updateFilter} triggleFiter={triggleFiter} setTriggleFiter={setTriggleFiter}/>

            </FilterRightBar>
            <ChangeStatus open={openEdit} setOpen={setOpenEdit} shipment={selectedRow} refetch={() => {setShowDetail(false); refetch()}}/>
            <DeliveryOrderHistoryModal open={openHistoryDO} setOpen={setOpenHistoryDO} data={selectedDO}/>
        </>
        
    )
}


export default OrderTracking