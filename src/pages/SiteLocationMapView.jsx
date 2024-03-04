import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
import GoogleMapReact from "google-map-react";
import { MarkerClusterer, MarkerF } from "@react-google-maps/api";
import { FaCar, FaMapMarker, FaMarker, FaRegEdit, FaTimes, FaTrashAlt } from "react-icons/fa";
import useSupercluster from "use-supercluster";
import { MdOutlineClose } from "react-icons/md";
import PerfectScrollbar from "react-perfect-scrollbar";
import DetailSiteLocation from "../components/SiteLocation/DetailSiteLocation";
import { setSelectedLocation } from "../features/mapLocation/mapLocationSlice";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";


let eventMapActive = false
let dataInitail = []
let _iconSize = 50
let _tooltipButtom = 5
let _timeLast = ""
let _informationTemp = {}
let _firstLoad = false
let _isZoomPan = false
let _isFocus = false
let timeoutTask = null
let _markerFocus = ""
let _isZoomOfFocus = false
let _stateMapControl = {
    legendEnabled: true,
    clusterEnabled: true,
    objectEnabled: false,
    fitObjectEnabled: false,
    mapType: "roadmap",
    geofencesEnabled: [],
    dashboardEnabled: false,
    licensePlateEnabled: false,
    tableInfoEnabled: false
}
let isOnDragEnd = false
let displayDB = false
let displayTable = false
let listGeof = []

let onClickMarker = false
const SiteLocationMapView = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [page, setPage] = useState(2);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({ groupId: null, truckType: null, plateLicence: null, brand: null });
    const mapLocation = useSelector(state => state.mapLocation)
    const [openEdit, setOpenEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedTruckEdit, setSelectedTruckEdit] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showAction, setShowAction] = useState(false);
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [pointData, setPointData] = useState([]);
    const [criterias, setCriterias] = useState({
        page: 0,
        rowsPerPage: 25,
        // groupId: "",
        // isMapped: false,
    });
    const [map, setMap] = useState(null);

    useEffect(_ => {
        console.log(mapLocation.selectedLocation)
        if(mapLocation.selectedLocation && mapLocation.selectedLocation.id && mapLocation.selectedLocation.lat && mapLocation.selectedLocation.lng){
            setSelectedItem(mapLocation.selectedLocation)
            // _markerFocus = mapLocation.selectedLocation.id
            panToMarker(mapLocation.selectedLocation.lat, mapLocation.selectedLocation.lng)
        }else{
            setSelectedItem(null)
        }
    }, [mapLocation.selectedLocation])
    const mapRef = useRef();

    // useEffect(_ => {
    //     initData()
    // }, [])

    const { data, isLoading, isFetching, isSuccess, refetch } =
        useGetIDSiteDCQuery(criterias);


    const { masterDatas } = useSelector((state) => state.masterDatas);
    const { fleets, status: fleetStatus } = useSelector((state) => state.fleets);

    const [image, setImage] = useState(null);

    const handleChangePage = (event, newPage) => {
        setCriterias({ ...criterias, page: newPage });
    };

    const onShowModalDelete = (id) => {
        setSelectedTruck(id);
        setOpen(true);
    };

    const onShowEdit = (truck) => {
        setSelectedTruckEdit(truck);
        setOpenEdit(true);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getTruckName = (value) => {
        let name = "";
        const truck = masterDatas?.find(
            (x) => x.type === "VEHICLETYPE" && x.intValue === value
        );
        if (truck) name = truck?.name;

        return name;
    };

    const handleChange = (value) => {
        setCriterias({ ...criterias, groupId: value ? value : null });
    };

    const handleChangeVehicleType = (value) => {
        setCriterias({ ...criterias, truckType: value ? Number(value) : null });
    };

    const handleChangeLicensePlate = (value) => {
        setCriterias({ ...criterias, plateLicence: value ? value : null });
    };

    const handleChangeBrand = (value) => {
        setCriterias({ ...criterias, brand: value ? value : null });
    };

    const onFilter = () => {
        let crit = { ...criterias, ...filter }
        let filteredByKey = Object.fromEntries(
            Object.entries(crit).filter(([key, value]) => value != null))
        console.log(filteredByKey)
        setCriterias(prevState => ({
            ...prevState,
            ...filteredByKey
        }))
        setTimeout(_ => {
            console.log(criterias)
        }, 1000)
    }


    const handleOpenForm = () => {
        setOpenForm(true)
    }

    const handleClick = event => {
        setShowAction(event.currentTarget);
    };

    const handleClose = () => {
        setShowAction(false)
    };

    const data1 = [
        { id: 1, latitude: 13.716377, longitude: 100.608755 },
        { id: 2, latitude: 13.726377, longitude: 100.608755 },
        { id: 3, latitude: 13.736377, longitude: 100.608755 },
        { id: 4, latitude: 13.746377, longitude: 100.608755 },
        { id: 5, latitude: 13.756377, longitude: 100.608755 },
        { id: 6, latitude: 13.766377, longitude: 100.608755 },
        { id: 7, latitude: 13.776377, longitude: 100.608755 },
        { id: 8, latitude: 13.786377, longitude: 100.608755 },
    ]

    const points = mapLocation.listSiteLocation.map(dt => ({
        type: "Feature",
        properties: { cluster: false, markId: dt.id },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(dt.lng),
                parseFloat(dt.lat)
            ]
        },
        information: dt,
        // image: {
        //     class_type: dt.image.class_type,
        //     status: dt.image.status,
        //     course: dt.image.course
        // },
        vid: dt.id,
        // licenseplate: dt.licenseplate,
        // vehicle_name: dt.vehicle_name,
        // vin_no: dt.vin_no,
        // sleep_mode: dt.sleep_mode
    }));

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: {
            minPoints: 2,
            minZoom: 0,
            maxZoom: 22,
            radius: 120,
            nodeSize: 128,
        }
    });

    const panToMarker = (lat, lng) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });

            // if (!onClickMarker) mapRef.current.setZoom(15)

            // onClickMarker = false
        }
    }

    const setSmoothZoom = (map, level, cnt) => {
        if (cnt > level) {
            cnt -= 1
            setTimeout(() => {
                map.setZoom(cnt)
                setSmoothZoom(map, level, cnt);
            }, 80);
        }
        else if (cnt < level) {
            cnt += 1
            setTimeout(() => {
                map.setZoom(cnt)
                setSmoothZoom(map, level, cnt);
            }, 80);
        } else {
            return;
        }
    }

    const test = (e) => {
        console.log(e)
    }

    const setActiceMarker = (information) => {
        // if (infoLoading) return
        // alert('1243')
        // if (_markerFocus !== "" && information.plateLicence == _markerFocus) setFocusMarker()
    
        return (
          <MarkerMap
            key={information.id}
            lat={information.lat}
            lng={information.lng}
            // licensePlateEnabled={_stateMapControl.licensePlateEnabled}
            markerType={"Actived"}
            dataDetail={information}
          />
        )
      }

    let clusterDisable = (data1.length > 2) ? true : false


    return (
        <>
            <div className="bg-white">
                <div className="py-1 h-[50px] border-b px-3 flex justify-between items-center">
                    <div className="title text-[16px]">
                        Site Location
                    </div>
                    <div className="action flex items-center gap-[8px]">
                        <button className="btn-primary py-[6px] px-3 rounded-[7px] bg-primary-900 text-[13px] text-white" onClick={() => handleOpenForm()}>+ Add</button>
                        <Divider orientation="vertical" flexItem variant="middle" />
                        &nbsp;
                        <IoFilterOutline className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" />
                        {/* <AiOutlineExpandAlt className="h-5 w-5 flex-shrink-0 text-gray-500 cursor-pointer" aria-hidden="true" /> */}
                    </div>
                </div>
            </div>
            {/* <AddTruck refetch={refetch} fleets={fleets} /> */}

            <div className="h-full min-h-[calc(100vh_-_110px)] lg:mx-auto lg:max-w-full relative">
                <div className="h-[calc(100vh_-_110px)]">

                    <GoogleMapReact
                        className="h-[500px]"
                        bootstrapURLKeys={{ key: 'AIzaSyDrpgtKGMCTWJZQ5hGb_ArMGSG55ukUsvQ' + "&v=3.exp&libraries=drawing,geometry,places&language=en&region=" + 'vi' }}
                        defaultCenter={{ lat: 13.786377, lng: 100.608755 }}
                        defaultZoom={5}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map }) => {
                            map.minZoom = 0
                            mapRef.current = map;
                            setMap(map)
                            // setBusinessPOI(map)
                            // setLayerMarker(geofenceListsOnMapLoad)  // GEOSERVER GEOFENCES
                        }}
                        onClick={() => dispatch(setSelectedLocation(null))}
                        onChange={({ zoom, bounds }) => {
                            setZoom(zoom);
                            setBounds([
                                bounds.nw.lng,
                                bounds.se.lat,
                                bounds.se.lng,
                                bounds.nw.lat
                            ]);
                        }}
                        options={{
                            gestureHandling: 'greedy',
                            zoomControl: true,
                            zoomControlOptions: {
                                position: 5,
                            },
                            mapTypeControl: false,
                            streetViewControl: true,
                            streetViewControlOptions: {
                                position: 5,
                            },
                            rotateControl: false,
                            fullscreenControl: false
                        }}
                    >
                        {!isEmpty(selectedItem) && setActiceMarker(selectedItem)}
                        {
                            mapLocation.listSiteLocation.map(dt => {
                                return (
                                    <MarkerMap
                                    key={dt.id}
                                    lat={dt.lat}
                                    lng={dt.lng}
                                    dataDetail={dt}
                                // bottom={_tooltipButtom}
                                // licensePlateEnabled={stateMapControl.licensePlateEnabled}
                                // licenseplate={_licenseplate}
                                markerType={"Inactived"}
                                // classType={class_type}
                                // status={status}
                                // iconSize={_iconSize}
                                // course={course}
                                // sleep_mode={cluster.sleep_mode}
                                />
                                )
                            })
                        }
                        {/* {false ? clusters.map((cluster) => {
                            // console.log('cluster', cluster)
                            let class_type = ""
                            let status = ""
                            let course = ""
                            if (cluster.image) {
                                class_type = cluster.image.class_type;
                                status = cluster.image.status;
                                course = cluster.image.course;
                            }

                            // let _licenseplate = ""
                            // // let _licenseplate = get(cluster, 'vehicle_name')
                            // if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
                            // if (_licenseplate == "") _licenseplate = get(cluster, 'vid')

                            const [longitude, latitude] = cluster.geometry.coordinates;
                            const {
                                cluster: isCluster,
                                point_count: pointCount
                            } = cluster.properties;
                            if (isCluster) {
                                let clusterSize = `${40 + (pointCount / points.length) * 40}px`
                                return (
                                    <Marker
                                        key={`cluster-${cluster.id}`}
                                        lat={latitude}
                                        lng={longitude}
                                    >
                                        <div
                                            className="cluster-marker"
                                            style={{
                                                width: clusterSize,
                                                height: clusterSize,
                                                transform: 'translate(-50%, -50%)',
                                                cursor: 'pointer'
                                            }}

                                            onClick={() => {
                                                const expansionZoom = Math.min(
                                                    supercluster.getClusterExpansionZoom(cluster.id), 22
                                                );
                                                mapRef.current.setZoom(expansionZoom + 2);
                                                mapRef.current.panTo({ lat: latitude, lng: longitude });
                                            }}
                                        >
                                            {pointCount}
                                        </div>
                                    </Marker>
                                );
                            }

                            return (
                                <MarkerMap
                                    key={cluster.vid}
                                    lat={latitude}
                                    lng={longitude}
                                    dataDetail={cluster.information}
                                // bottom={_tooltipButtom}
                                // licensePlateEnabled={stateMapControl.licensePlateEnabled}
                                // licenseplate={_licenseplate}
                                markerType={"Inactived"}
                                // classType={class_type}
                                // status={status}
                                // iconSize={_iconSize}
                                // course={course}
                                // sleep_mode={cluster.sleep_mode}
                                />
                            );
                        })
                            : points.map((cluster, index) => {
                                // console.log('point')
                                const [longitude, latitude] = cluster.geometry.coordinates;
                                if (mapRef.current) {
                                    const bd = mapRef.current.getBounds();
                                    var latlng = new window.google.maps.LatLng(latitude, longitude);
                                    if (!bd.contains(latlng)) return
                                }

                                // let class_type = ""
                                // let status = ""
                                // let course = ""
                                // console.log(cluster)
                                // if (cluster.image) {
                                //     class_type = cluster.image.class_type;
                                //     status = cluster.image.status;
                                //     course = cluster.image.course;
                                // }

                                // let _licenseplate = get(cluster, 'vehicle_name')
                                // if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
                                // if (_licenseplate == "") _licenseplate = get(cluster, 'vin_no')

                                // console.log(">> cluster.sleep_mode 2 : ", cluster)

                                let markerType = "Inactived"

                                if (_markerFocus !== "" && cluster.vid == _markerFocus) {
                                    markerType = "Actived"
                                    // setFocusMarker()
                                }
                                return (
                                    <MarkerMap
                                        key={cluster.vid}
                                        lat={latitude}
                                        lng={longitude}
                                        onClick={() => {
                                            // alert(1)
                                            // dispatch(fetchDetailVehicle(cluster.vid, 'Marker'))
                                            _markerFocus = cluster.vid
                                        }}
                                    // bottom={_tooltipButtom}
                                    // licensePlateEnabled={stateMapControl.licensePlateEnabled}
                                    // licenseplate={_licenseplate}
                                    markerType={"Inactived"}
                                    // classType={class_type}
                                    // status={status}
                                    // iconSize={_iconSize}
                                    // course={course}
                                    // sleep_mode={cluster.sleep_mode}
                                    />
                                );
                            })} */}

                      
                    </GoogleMapReact>
                </div>
                {
                    selectedItem && (

                        <div className="absolute top-[1px] h-full right-0 w-[400px] bg-white shadow-xl">
                            
                            <div className="header border-b flex px-3 justify-between items-center h-[40px]">
                                <div className="flex gap-[12px]">
                                    <Tooltip title={'Get driving direction'} placement="bottom" arrow>

                                        <a rel='noopener noreferrer'  href={`https://www.google.com/maps?saddr&daddr=${selectedItem.lat},${selectedItem.lng}`} target="_blank" className="text-[#5f6368]"><FaCar className="w-5 h-5" /></a>
                                    </Tooltip>
                                    <Tooltip title={'Delete'} placement="bottom" arrow>

                                        <button className="text-[#5f6368]"><FaTrashAlt className="w-5 h-5" /></button>
                                    </Tooltip>
                                    <Tooltip title={'Edit'} placement="bottom" arrow>

                                        <button className="text-[#5f6368]"><FaRegEdit className="w-5 h-5" /></button>
                                    </Tooltip>
                                </div>
                                <Tooltip title={'Close'} placement="bottom-start" arrow>
                                <button className="text-[#5f6368]" onClick={() => setSelectedItem(null)}>
                                    <MdOutlineClose className="w-5 h-5"/>
                                </button>

                                </Tooltip>
                            </div>
                            <div className="overflow-auto p-3 pb-[40px] relative max-h-full">
                                <PerfectScrollbar>
                                    <DetailSiteLocation detailRow={selectedItem}/>
                                </PerfectScrollbar>
                            </div>
                        </div>
                    )
                }
            </div>

        </>
    );
};
const Marker = ({ children }) => children;
const MarkerMap = (arg) => {
    const [tooltipShow, setTooltipShow] = useState(true);
    const dispatch = useDispatch();
    // const { getInformationMarker } = RealtimeNewActions;
    // const getStatus = (status) => {
    //     let a = {
    //         'Driving': 1,
    //         'Ign. OFF': 5,
    //         '': 4,
    //         'Over speed': 2,
    //     }
    //     // 'Ign. OFF': 1,
    //     return a[status]
    // }
    // if (arg.markerType == "Actived") console.log('name', ('/icons/Marker/' + arg.classType + '-' + arg.status + '-' + arg.markerType + '.png'))
    // let ic_status = getStatus(arg.status);

    // if (ic_status === 2) ic_status = 5;
    // else if (ic_status === 5) ic_status = 2;

    // let cla_t = LT_UNKNOW.includes(arg.classType) ? "unknow" : arg.classType;
    let imgSrc = 'data:image/svg+xml;base64,CiAgICAgICAgPHN2ZwogICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICAgICAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgICAgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgICAgICBpZD0ic3ZnOCIKICAgICAgICB2ZXJzaW9uPSIxLjEiCiAgICAgICAgdmlld0JveD0iMCAwIDUuMjkxNjY2NSA3LjI2ODA3MjUiCiAgICAgICAgaGVpZ2h0PSIxNi40ODE5MjgiCiAgICAgICAgd2lkdGg9IjEyIj4KICAgICAgICA8ZGVmcyBpZD0iZGVmczIiPgogICAgICAgIDwvZGVmcz4KICAgICAgICA8ZwogICAgICAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTkuOTkxNTc4LC0yMDAuMTIwOTQpIgogICAgICAgICAgICBpZD0ibGF5ZXIxIj4KICAgIDxwYXRoCiAgICAgICBkPSJtIDEwMy43MDQsMjA1LjMzODU3IGMgMC42MzQxMSwtMC41NzgwNiAxLjM1NjExLC0xLjMzMzgyIDEuMzU2MTEsLTIuNDEwMzIgMCwtMS40MDcyOSAtMS4wODAyNywtMi41NDgwOSAtMi40MjI2OCwtMi41NDgwOSAtMS4zNDI0MywwIC0yLjQyMjcsMS4xNDA4IC0yLjQyMjcsMi41NDgwOSAwLDEuMDc2NSAwLjcyMiwxLjgzMjI2IDEuMzU2MTEsMi40MTAzMiAxLjEwODQzLDEuMDEwNDYgMC42MjUzNCwxLjgxMTEzIDEuMDY2NTksMS44MTExMyAwLjQ0MTI0LDAgLTAuMDQxOCwtMC44MDA2NyAxLjA2NjU3LC0xLjgxMTEzIHoiCiAgICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6IzE4NmRiNztmaWxsLW9wYWNpdHk6MC45ODAxNjk5ODtzdHJva2U6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4yNjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIgogICAgICAgaWQ9InBhdGg4NzkiIC8+CiAgICAgICAgPC9nPgogICAgICAgIDwvc3ZnPgogICAg';
    let imgActive = '/images/spotlight-poi3_hdpi.png';
    return (
        <Marker key={arg.key} lat={arg.latitude} lng={arg.longitude}>
            <div className={(arg.markerType== "Actived" && 'z-10' ) + " relative div-marker"} style={{ cursor: "pointer" }}>
                {/* <span
                    className="tooltipMarker"
                    style={{
                        bottom: arg.bottom,
                        fontSize: 12,
                        zIndex: 100,
                        visibility:
                            arg.markerType == "Actived"
                                ? "visible"
                                : "hidden",
                        display:
                            tooltipShow && arg.markerType === "Actived" ? "block" : "none",
                    }}
                >
                    <span
                        className="tooltipMarker__close"
                        onClick={() => {
                        }}
                    >
                        <FaTimes />xv
                    </span>
                   
                </span> */}
                <div
                    onClick={() => {
                        onClickMarker = true
                        _markerFocus = arg.id;
                        dispatch(setSelectedLocation(arg.dataDetail))
                        // dispatch(fetchDetailVehicle({ plate: arg.licenseplate, callFrom: "Marker" }));
                        // setTooltipShow(!tooltipShow);
                    }}
                >
                    {/* <p className="plate-license">{arg.licenseplate}</p> */}
                    {/* // <FaMapMarker className="text-primary-900 w-5 h-5" /> */}
                    {
                        arg.markerType== "Actived" ? (
                            <img
                        className="marker-icon"
                        src={imgActive}
                        style={{
                            width: '26px',
                            transform: "translate(-50%, -50%)",
                            zIndex: 10,
                            // transform: "translate(-50%, -50%)  rotate(" + arg.course + "deg)",
                        }}
                        onClick={() => { }}
                    />
                        ) : (
                            <img
                        className="marker-icon"
                        src={imgSrc}
                        style={{
                            width: '12px',
                            transform: "translate(-50%, -50%)",
                            // transform: "translate(-50%, -50%)  rotate(" + arg.course + "deg)",
                        }}
                        onClick={() => { }}
                    />
                        )
                    }
                </div>
            </div>
        </Marker>
    )
}


export default SiteLocationMapView;

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
