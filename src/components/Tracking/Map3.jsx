import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow, InfoWindowF, Polyline, Circle } from "@react-google-maps/api";
// import CircularProgress from "@mui/material/CircularProgress";
import InforBox from "./InforBox";
import { useDispatch, useSelector } from "react-redux";
// import { selectTruck } from "../../features/truck/truckSlice";
import GoogleMapReact from "google-map-react";
// import RealtimeNewActions from '../../redux1/RealtimeNewR/edux'
import {
    // setTempMapControl,
    fetchDetailVehicle,
    getInformationMarker,
    setInitialVehicles,
    setFitBounds,
    setZoomPan,
    setFocus,
    setStateReduxRealtime,
    setTimeLast,
    setInformation
} from "../../features/maptracking/mapTrackingSlice";
import Tail from "../../objects/Tail";
import useSupercluster from "use-supercluster";
import { get, groupBy, isEmpty } from "lodash";
import './map.css';
import { fetchTruckDetail1, getTrucksTracking } from "../../api";
// const { get } = require('lodash')
const Marker = ({ children }) => children;
let controllerSignal = [], onClickMarker = false, geofenceListsOnMapLoad = []
let onClickWindowInfo = false
import { ROLES } from "../../constants/constants";
import { FaTimes } from "react-icons/fa";

const LT_UNKNOW = [0, 1, 4, 16, 17, 18, 19, 20, 21, 23, 24, 26, 27, 32, 44]

export function setBusinessPOI(map) {
    var styles = [
      {
        featureType: 'poi.business',
        stylers: [
          { visibility: 'on' }
        ]
      }
    ];
  
    map.setOptions({ styles: styles });
  }

//#region Initial value
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
//#endregion

const MarkerMap = (arg) => {
    const [tooltipShow, setTooltipShow] = useState(true);
    const dispatch = useDispatch();
    // const { getInformationMarker } = RealtimeNewActions;
    const getStatus = (status) => {
        let a = {
            'Driving': 1,
            'Ign. OFF': 5,
            '': 4,
            'Over speed': 2,
        }
        // 'Ign. OFF': 1,
        return a[status]
    }
    // if (arg.markerType == "Actived") console.log('name', ('/icons/Marker/' + arg.classType + '-' + arg.status + '-' + arg.markerType + '.png'))
    let ic_status = getStatus(arg.status);

    // if (ic_status === 2) ic_status = 5;
    // else if (ic_status === 5) ic_status = 2;

    let cla_t = LT_UNKNOW.includes(arg.classType) ? "unknow" : arg.classType;
    return (
        <Marker key={arg.key} lat={arg.latitude} lng={arg.longitude}>
            <div className="div-marker" style={{ cursor: "pointer" }}>
                <span
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
                            setTooltipShow(!tooltipShow);
                        }}
                    >
                        <FaTimes/>
                    </span>
                    {/* <TooltipMarker /> */}
                    {<InforBox/>}
                </span>
                <div
                    onClick={() => {
                        onClickMarker = true
                        _markerFocus=arg.licenseplate;
                        dispatch(fetchDetailVehicle({ plate: arg.licenseplate, callFrom: "Marker" }));
                        setTooltipShow(!tooltipShow);
                    }}
                >
                    {/* <p className="plate-license">{arg.licenseplate}</p> */}
                    <img
                        className="marker-icon"
                          src={
                            "/public/Marker/" +
                            cla_t +
                            "-" +
                            ic_status +
                            "-" +
                            arg.markerType +
                            ".png"
                          }
                        style={{
                            width: arg.iconSize,
                            transform: "translate(-50%, -50%)",
                            // transform: "translate(-50%, -50%)  rotate(" + arg.course + "deg)",
                        }}
                        onClick={() => { }}
                    />
                </div>
            </div>
        </Marker>
    )
}

const Map3 = () => {

    const mapRef = useRef();
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [pointData, setPointData] = useState([]);
    const [map, setMap] = useState(null);
    const [requestWorking, setRequestWorking] = useState(false);
    const [infoGeofences, setInfoGeofences] = useState({
        visible: false,
        currentPage: 1,
        lat: 0,
        lng: 0,
        infoList: []
    });

    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEYS,
    //     libraries: ["places"],
    // });

    const dispatch = useDispatch();
    // const mapSelector = useSelector(state => state.mapTracking)
    const truckSelector = useSelector(state => state.truck.selected);
    const truckPosition = useSelector(state => state.truck.position);
    const displayVehicle = useSelector(state => state.mapTracking.displayVehicle);
    const information = useSelector(state => state.mapTracking.information);
    // const defaultZoom = useSelector(state => state.mapTracking.defaultZoom);
    const isFitBounds = useSelector(state => state.mapTracking.isFitBounds);
    const isZoomPan = useSelector(state => state.mapTracking.isZoomPan);
    const isFocus = useSelector(state => state.mapTracking.isFocus);
    // const defaultCenter = useSelector(state => state.mapTracking.defaultCenter);
    const initialVehiclesData = useSelector(state => state.mapTracking.initialVehiclesData);
    const stateMapControl = useSelector(state => state.mapTracking.stateMapControl);

    const timeLast = useSelector(state => state.mapTracking.timeLast);
    const geofenceByTypes = useSelector(state => state.mapTracking.geofenceByTypes);
    const merkerFocusLocation = useSelector(state => state.mapTracking.merkerFocusLocation);
    const infoLoading = useSelector(state => state.mapTracking.infoLoading);
    const user = useSelector((state) => state.auth);
    const { role } = user?.user;

   
    useEffect(() => {
        if (get(merkerFocusLocation, 'lat')) {
          let { lat, lng } = merkerFocusLocation
          if(isFocus){

            console.log(isFocus)
              panToMarker(lat, lng)
          }
        }
    }, [merkerFocusLocation])
    

    useEffect(() => {
        _isZoomPan = isZoomPan
        // console.log('zoom pan', _isZoomPan)
        if (_isZoomPan) setZoomPanMarker()
      }, [isZoomPan])

    useEffect(() => {
        // if (!_firstLoad) {
            // if (initialVehiclesData && initialVehiclesData.length > 0) {
            //     let data = JSON.parse(JSON.stringify(initialVehiclesData))
            //     // console.log(data)
            //     dataInitail = [...data]
            //     setPointData([...data])
            //     countdownUpdate()
            // }
            // else {
            // }
            loadRealtimeInitial()
        // }
        }, [])

    useEffect(() => {
        return () => {
          // componentWillUnmount
          cancelFetchApi()
          timeoutTask !== null && clearTimeout(timeoutTask)
          dispatch(setStateReduxRealtime({
            tailMarker: [],
            isFilterInteractiveDashboard: false
          }))
          console.log(timeoutTask)
        //   setStateMapControlChange(["legendEnabled"], true)
          _firstLoad = false
        }
    }, [])


    const setStateMapControlChange = (stateNameList, value) => {
        let stateMapControl = JSON.parse(JSON.stringify(_stateMapControl))
        for (let index in stateNameList) stateMapControl[stateNameList[index]] = value
        // dispatch(setTempMapControl(stateMapControl))
    }

    const countdownUpdate = () => {
        timeoutTask = setTimeout(loadRealtimeLast, 20000);
    }
    // const countdownUpdate = () => timeoutTask = setTimeout(loadRealtimeLast, 15000)

    const cancelFetchApi = () => {
        controllerSignal.forEach(controller => {
            if (!controller.signal.aborted) controller.abort()
        });
    }

    const mapDetailTruck = async (newData, license, refetch = false) => {
        const response = await fetchTruckDetail1(license);
        newData.forEach((data, key) => {
            if (response.data[key]) {
                data.driveInfo = response.data[key]
                if (_informationTemp.plateLicence == data.plateLicence) {
                    dispatch(getInformationMarker(data.plateLicence, 'Mqtt', '', false))
                    dispatch(fetchDetailVehicle({ plate: data.plateLicence, callFrom: "Mqtt" }))
                }
            }
            
        })
        dispatch(setInitialVehicles([...newData]))
        // dataInitail = [...newData]
        setPointData([...newData])
                // countdownUpdate()
        // countdownUpdate()
    }

    const loadRealtimeInitial = async () => {
        // setStateMapControlChange(["fitObjectEnabled"], false)
        cancelFetchApi()
        setRequestWorking(true)
        // Load data initial
        console.log(eventMapActive)
        if (!eventMapActive) {
            _firstLoad = true
            try {
                dispatch(setStateReduxRealtime({ vehiclesLoading: true }))
                const controller = new AbortController();
                let signal = controller.signal;
                controllerSignal.push(controller)

                let url = "";
                if (role === ROLES.Carrier) {
                    url = "/api/carrier/tracking/truck";
                } else if (role === ROLES.Company) {
                    url = "/api/company/tracking/truck";
                }

                dispatch(setTimeLast(_timeLast))
            // alert(1)
                const response = await getTrucksTracking(url, {
                    plateLicence: "",
                    groupName: "",
                    rowsPerPage: 10000
                },  {signal});
                const newData = [...response.data?.content];

                if (!isEmpty(newData)) {
                    const license = newData.map(i => i.plateLicence)
                    _timeLast = new Date().toISOString().split('.')[0]

                    mapDetailTruck(newData, license)

                    countdownUpdate()
                } else {
                    dispatch(setInitialVehicles([]))
                }
                setRequestWorking(false)
                dispatch(setStateReduxRealtime({ intitialLoadTable: false, hideOverlayPanel: false }))
            } catch (error) {
                console.log(error);
                console.log("ERR => loadRealtimeInitial : ", error)
                dispatch(setInitialVehicles([]))
                setRequestWorking(true)
                dispatch(setStateReduxRealtime({ intitialLoadTable: false, hideOverlayPanel: false }))
                // countdownUpdate()
            }
        }
    }

 
    const loadRealtimeLast = async () => {
        // return
        // console.log(eventMapActive, requestWorking)
        // console.log('1321321', requestWorking)
        if (!eventMapActive && !requestWorking) {
            // console.log(455)
            const controller = new AbortController();
            let signal = controller.signal;
            controllerSignal.push(controller)
            // console.log(controllerSignal)
            try {

                let url = "";
                if (role === ROLES.Carrier) {
                    url = "/api/carrier/tracking/truck";
                } else if (role === ROLES.Company) {
                    url = "/api/company/tracking/truck";
                }

                dispatch(setTimeLast(_timeLast))
                const response = await getTrucksTracking(url, {
                    plateLicence: "",
                    groupName: "",
                    rowsPerPage: 10000
                }, {signal});
                const newData = [...response.data?.content];
                if (!isEmpty(newData)) {
                    const license = newData.map(i => i.plateLicence)
                    _timeLast = new Date().toISOString().split('.')[0]

                    mapDetailTruck(newData, license)

                }
                setRequestWorking(false)
                dispatch(setStateReduxRealtime({ intitialLoadTable: false, hideOverlayPanel: false }))

            } catch (error) {
                // console.log('23')
                setRequestWorking(false)
            }
        }
        countdownUpdate()
    }

    if (mapRef.current) {
        let zoom = mapRef.current.getZoom()
        if (zoom < 15) {
            _iconSize = 50
            _tooltipButtom = 5
        }
        else if (zoom >= 15 && zoom <= 17) {
            _iconSize = 100
            _tooltipButtom = 15
        }
        else {
            _iconSize = 150
            _tooltipButtom = 25
        }
    }

    const fitBounds = () => {
        if (mapRef.current && isFitBounds) {
            let bounds = new window.google.maps.LatLngBounds();
            for (let index in data) {
                bounds.extend({ lat: data[index].location.latitude, lng: data[index].location.longitude })
            }
            bounds.length > 0 && mapRef.current.fitBounds(bounds)
            dispatch(setFitBounds(false))
        }
    }
    fitBounds()
    const checkLocationInBound = () => {
        for (let i in listGeof) {
            if (mapRef.current) {
                let { position, point, polyline, polygon } = listGeof[i]
                const bd = mapRef.current.getBounds()
                let latlng = new window.google.maps.LatLng(position.lat, position.lng)
                let visible = false
                if (bd.contains(latlng)) visible = true
                if (point) point.setVisible(visible)
                if (polyline) polyline.setVisible(visible)
                if (polygon) polygon.setVisible(visible)
            }
        }
    }

    const setZoomPanMarker = () => {
        // console.log('pan')
        if (mapRef.current && _informationTemp.plateLicence) {
            eventMapActive = true
            // mapRef.current.panTo({ lat: information.gps.lat, lng: information.gps.lng });
            // mapRef.current.setZoom(17)

            dispatch(setZoomPan(false))
            _markerFocus = information.plateLicence
            eventMapActive = false
        }
        else {
            dispatch(setZoomPan(false))
        }
    }

    let data = []
    _informationTemp = information
    for (let index in pointData) {
        let d = pointData[index]
        let found = true
        displayVehicle !== null && (found = displayVehicle.includes(d.plateLicence))
        //   //#region ทำลบที่ตรงกับ info
        if (!isEmpty(information) && d.plateLicence == information.plateLicence) found = false
        //   //#endregion

        //   // FILTER DATA IN BOUNDS
        let insideBounds = false
        if (mapRef.current) {
            const bd = mapRef.current.getBounds();
            var latlng = new window.google.maps.LatLng(Number(d.driveInfo?.x), Number(d.driveInfo?.y));
            if (bd.contains(latlng)) insideBounds = true
        }
        found && insideBounds && data.push({
            "category": "anti-social-behaviour",
            "location_type": "Force",
            "location": {
                "latitude": Number(d.driveInfo?.x),
                "longitude": Number(d.driveInfo?.y)
            },
            "context": "",
            "outcome_status": null,
            "persistent_id": "",
            "id": d.truckId,
            "location_subtype": "",
            "month": "2019-10",
            "image": {
                "class_type": d.truckType,
                "status": d.driveInfo?.status,
                "course": 0
            },
            "vid": d.truckId,
            "licenseplate": d.plateLicence,
            "vehicle_name": "name",
            "vin_no": "vin_no",
            "sleep_mode": "sleep_mode"
        })
    }
    const points = data.map(dt => ({
        type: "Feature",
        properties: { cluster: false, markId: dt.id },
        geometry: {
            type: "Point",
            coordinates: [
                parseFloat(dt.location.longitude),
                parseFloat(dt.location.latitude)
            ]
        },
        image: {
            class_type: dt.image.class_type,
            status: dt.image.status,
            course: dt.image.course
        },
        vid: dt.vid,
        licenseplate: dt.licenseplate,
        vehicle_name: dt.vehicle_name,
        vin_no: dt.vin_no,
        sleep_mode: dt.sleep_mode
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

    const panToMarker = (lat, lng) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });

            if (!onClickMarker) mapRef.current.setZoom(15)

            onClickMarker = false
        }
    }

    const setFocusMarker = () => {
        if (mapRef.current && isFocus && _informationTemp.plateLicence) {
            setTimeout(() => {
                try {
                    !isOnDragEnd && !_isZoomOfFocus && mapRef.current.panTo({ lat: Number(_informationTemp.driveInfo?.x), lng: Number(_informationTemp.driveInfo?.y) });
                } catch {
                    // console.log("ERRER => _informationTemp : ", _informationTemp)
                }
            }, 200);
        }
    }

    const setActiceMarker = (information) => {
        if (infoLoading) return
        // alert('1243')
        if (_markerFocus !== "" && information.plateLicence == _markerFocus) setFocusMarker()
    
        return (
          <MarkerMap
            key={get(information, 'truckId')}
            lat={get(information, 'driveInfo.x')}
            lng={get(information, 'driveInfo.y')}
            bottom={_tooltipButtom}
            // licensePlateEnabled={_stateMapControl.licensePlateEnabled}
            licenseplate={get(information, 'plateLicence')}
            markerType={"Actived"}
            classType={get(information, 'truckType')}
            status={get(information, 'driveInfo.status')}
            iconSize={_iconSize}
            course={get(information, 'gps.image.course')}
            sleep_mode={get(information, 'gps.sleep_mode', "0")}
          />
        )
      }

    let clusterDisable = (data.length > 150) ? true : false

    let disableButtons = []
    if (clusterDisable) disableButtons.push('cluster')
    if (mapRef.current && mapRef.current.zoom <= 11) disableButtons.push('nameGeof')

    // if (!isLoaded) {
    //     return (
    //         <div className="flex min-h-full items-center justify-center">
    //             <CircularProgress />
    //         </div>
    //     );
    // }

    return (
        <div style={{ height: "calc(100vh - 72px)", width: "100%", marginTop: 7 }}>

            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDrpgtKGMCTWJZQ5hGb_ArMGSG55ukUsvQ' + "&v=3.exp&libraries=drawing,geometry,places&language=en&region=" + 'vi' }}
                defaultCenter={{ lat: 13.786377, lng: 100.608755 }}
                defaultZoom={5}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map }) => {
                    map.minZoom = 0
                    mapRef.current = map;
                    setMap(map)
                    setBusinessPOI(map)
                    // setLayerMarker(geofenceListsOnMapLoad)  // GEOSERVER GEOFENCES
                }}
                onChange={({ zoom, bounds }) => {
                    setZoom(zoom);
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat
                    ]);
                }}
                onDrag={() => {
                    isOnDragEnd = true
                    eventMapActive = true
                }}
                onDragEnd={() => {
                    eventMapActive = false
                    checkLocationInBound()
                    //   setStateMapControlChange(["fitObjectEnabled"], false)
                    dispatch(setFocus(false))
                }}
                onZoomAnimationStart={() => {
                    eventMapActive = true
                    _isZoomOfFocus = true
                }}
                onZoomAnimationEnd={() => {
                    eventMapActive = false
                    checkLocationInBound()
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
                {
                    map !== null && <>
                        <Tail map={mapRef.current} />
                    </>
                }
                {!isEmpty(information) && setActiceMarker(information)}

                {clusterDisable || stateMapControl.clusterEnabled ? clusters.map((cluster) => {
                    let class_type = ""
                    let status = ""
                    let course = ""
                    if (cluster.image) {
                        class_type = cluster.image.class_type;
                        status = cluster.image.status;
                        course = cluster.image.course;
                    }

                    let _licenseplate = ""
                    // let _licenseplate = get(cluster, 'vehicle_name')
                    if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
                    if (_licenseplate == "") _licenseplate = get(cluster, 'vid')

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
                            onClick={() => {
                                // alert(2)
                                let [lng, lat] = cluster.geometry.coordinates
                                onClickMarker = true
                                dispatch(getInformationMarker(cluster.licenseplate, 'Marker', { lat, lng }))
                                _markerFocus = cluster.vid
                            }}
                            bottom={_tooltipButtom}
                            licensePlateEnabled={stateMapControl.licensePlateEnabled}
                            licenseplate={_licenseplate}
                            markerType={"Inactived"}
                            classType={class_type}
                            status={status}
                            iconSize={_iconSize}
                            course={course}
                            sleep_mode={cluster.sleep_mode}
                        />
                    );
                })
                    : points.map((cluster, index) => {
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        if (mapRef.current) {
                            const bd = mapRef.current.getBounds();
                            var latlng = new window.google.maps.LatLng(latitude, longitude);
                            if (!bd.contains(latlng)) return
                        }

                        let class_type = ""
                        let status = ""
                        let course = ""
                        console.log(cluster)
                        if (cluster.image) {
                            class_type = cluster.image.class_type;
                            status = cluster.image.status;
                            course = cluster.image.course;
                        }

                        let _licenseplate = get(cluster, 'vehicle_name')
                        if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
                        if (_licenseplate == "") _licenseplate = get(cluster, 'vin_no')

                        // console.log(">> cluster.sleep_mode 2 : ", cluster)

                        let markerType = "Inactived"

                        if (_markerFocus !== "" && cluster.vid == _markerFocus) {
                            markerType = "Actived"
                            setFocusMarker()
                        }
                        return (
                            <MarkerMap
                                key={cluster.vid}
                                lat={latitude}
                                lng={longitude}
                                onClick={() => {
                                    // alert(1)
                                    dispatch(fetchDetailVehicle(cluster.vid, 'Marker'))
                                    _markerFocus = cluster.vid
                                }}
                                bottom={_tooltipButtom}
                                licensePlateEnabled={stateMapControl.licensePlateEnabled}
                                licenseplate={_licenseplate}
                                markerType={"Inactived"}
                                classType={class_type}
                                status={status}
                                iconSize={_iconSize}
                                course={course}
                                sleep_mode={cluster.sleep_mode}
                            />
                        );
                    })}
                {/* {listTruck && listTruck.map((i, index) =>  {
                    <MarkerMap
                    key={index}
                    lat={i.driveInfo?.x}
                    lng={i.driveInfo?.y}
                    // onClick={() => {
                    //   dispatch(getInformationMarker(cluster.vid, 'Marker'))
                    //   _markerFocus = cluster.vid
                    // }}
                    // bottom={_tooltipButtom}
                    // licensePlateEnabled={stateMapControl.licensePlateEnabled}
                    // licenseplate={_licenseplate}
                    // markerType={"Inactived"}
                    // classType={class_type}
                    // status={status}
                    // iconSize={_iconSize}
                    // course={course}
                    // sleep_mode={cluster.sleep_mode}
                    />
                })} */}
            </GoogleMapReact>
        </div>
    );
};

export default Map3;
