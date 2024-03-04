// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import RealtimeNewActions from '../../Redux/RealtimeNewRedux'
// import GoogleMapReact from "google-map-react";
// import useSupercluster from "use-supercluster";
// import "./Styles/custom.css";
// import "./Styles/popover.css";
// import $ from 'jquery'
// import MapControl from '../../Components/GoogleMap/MapControl'
// import MapControlsCustomNew from '../../Components/GoogleMap/MapControlsCustomNew'

// // # Import object on map
// import FooterInfo from './FooterInfo'
// import ModalVideo from './ModalVideo'
// import OverlayPanelNew from './OverlayPanelNew';
// import Tail from './Objects/Tail'
// import Legend from './Legend'
// import Loading from './Loading'
// import VehicleInfo from './VehicleInfo'
// import { isEmpty } from "lodash";
// import { ENDPOINT_SCGL2, GOOGLE_MAP_API_KEY, setBusinessPOI } from '../../Config/app-config';
// import { Pagination } from 'antd'
// import { setOverlayImageMaps, getInfo } from '../../Components/GoogleMap/GeoServer'
// import { mappingDataToArray } from './helpers'
// import TooltipMarker from "./TooltipMarker";

// const { get } = require('lodash')
// const Marker = ({ children }) => children;

// const LT_UNKNOW = [0, 1, 4, 16, 17, 18, 19, 20, 21, 23, 24, 26, 27]

// //#region Initial value
// let eventMapActive = false
// let dataInitail = []
// let _iconSize = 50
// let _tooltipButtom = 5
// let _timeLast = ""
// let _informationTemp = {}
// let _firstLoad = false
// let _isZoomPan = false
// let _isFocus = false
// let timeoutTask = null
// let _markerFocus = ""
// let _isZoomOfFocus = false
// let _stateMapControl = {
//   legendEnabled: true,
//   clusterEnabled: true,
//   objectEnabled: false,
//   fitObjectEnabled: false,
//   mapType: "roadmap",
//   geofencesEnabled: [],
//   dashboardEnabled: false,
//   licensePlateEnabled: false,
//   tableInfoEnabled: false
// }
// let isOnDragEnd = false
// let displayDB = false
// let displayTable = false
// let listGeof = []
// //#endregion

// const MarkerMap = (arg) => {
//   const [tooltipShow, setTooltipShow] = useState(true);
//   const dispatch = useDispatch();
//   const { getInformationMarker } = RealtimeNewActions;

//   // if (arg.markerType == "Actived") console.log('name', ('/icons/Marker/' + arg.classType + '-' + arg.status + '-' + arg.markerType + '.png'))
//   let ic_status = arg.status;
//   if (ic_status === 2) ic_status = 5;
//   else if (ic_status === 5) ic_status = 2;

//   let cla_t = LT_UNKNOW.includes(arg.classType) ? "unknow" : arg.classType;
//   return (
//     <Marker key={arg.key} lat={arg.lat} lng={arg.lng}>
//       <div className="div-marker" style={{ cursor: "pointer" }}>
//         <span
//           className="tooltipMarker"
//           style={{
//             bottom: arg.bottom,
//             fontSize: 12,
//             zIndex: 100,
//             visibility:
//               arg.licensePlateEnabled || arg.markerType == "Actived"
//                 ? "visible"
//                 : "hidden",
//             display:
//               tooltipShow && arg.markerType === "Actived" ? "block" : "none",
//           }}
//         >
//           <span
//             className="tooltipMarker__close"
//             onClick={() => {
//               setTooltipShow(!tooltipShow);
//             }}
//           >
//             <i className="fa fa-times" aria-hidden="true"></i>
//           </span>
//           {/* <TooltipMarker /> */}
//         </span>
//         <div
//           onClick={() => {
//             dispatch(getInformationMarker(arg.$dimensionKey, "Marker"));
//             setTooltipShow(!tooltipShow);
//           }}
//         >
//           {/* <p className="plate-license">{arg.licenseplate}</p> */}
//           <img
//             className="marker-icon"
//             src={
//               "/public/Marker/25-1-Actived.png"
//             }
//             // src={
//             //   "/public/Marker/" +
//             //   cla_t +
//             //   "-" +
//             //   ic_status +
//             //   "-" +
//             //   arg.markerType +
//             //   ".png"
//             // }
//             style={{
//               width: arg.iconSize,
//               transform: "translate(-50%, -50%)  rotate(" + arg.course + "deg)",
//             }}
//             onClick={() => { }}
//           />
//         </div>
//       </div>
//     </Marker>
//   )
// }

// const MarkerGeof = (arg) => {
//   return <Marker
//     key={arg.key}
//     lat={arg.lat}
//     lng={arg.lng}
//   >
//     <div className="div-marker" style={{ cursor: 'pointer' }}>
//       <span className="tooltip-geof"
//         style={{ bottom: 30 }}>{arg.geofenceName}</span>
//     </div>
//   </Marker>
// }

// let controllerSignal = [], onClickMarker = false, geofenceListsOnMapLoad = []
// let onClickWindowInfo = false

// const Map = () => {

//   // Connect Redux
//   const dispatch = useDispatch();
//   const {
//     setTempMapControl,
//     getInformationMarker,
//     setInitialVehicles,
//     setFitBounds,
//     setZoomPan,
//     setFocus,
//     setStateReduxRealtime,
//     setTimeLast
//   } = RealtimeNewActions
//   const language = useSelector(state => state.versatile.language);
//   const dataLogin = useSelector(state => state.signin.dataLogin);
//   const stateMapControl = useSelector(state => state.realtimeNew.stateMapControl);
//   const displayVehicle = useSelector(state => state.realtimeNew.displayVehicle);
//   const information = useSelector(state => state.realtimeNew.information);
//   // const defaultZoom = useSelector(state => state.realtimeNew.defaultZoom);
//   const isFitBounds = useSelector(state => state.realtimeNew.isFitBounds);
//   const isZoomPan = useSelector(state => state.realtimeNew.isZoomPan);
//   const isFocus = useSelector(state => state.realtimeNew.isFocus);
//   // const defaultCenter = useSelector(state => state.realtimeNew.defaultCenter);
//   const initialVehiclesData = useSelector(state => state.realtimeNew.initialVehiclesData);
//   const timeLast = useSelector(state => state.realtimeNew.timeLast);
//   const geofenceByTypes = useSelector(state => state.realtimeNew.geofenceByTypes);
//   const merkerFocusLocation = useSelector(state => state.realtimeNew.merkerFocusLocation);
//   const infoLoading = useSelector(state => state.realtimeNew.infoLoading);

//   // State
//   const mapRef = useRef();
//   const [bounds, setBounds] = useState(null);
//   const [zoom, setZoom] = useState(10);
//   const [pointData, setPointData] = useState([]);
//   const [map, setMap] = useState(null);
//   const [requestWorking, setRequestWorking] = useState(false);
//   const [infoGeofences, setInfoGeofences] = useState({
//     visible: false,
//     currentPage: 1,
//     lat: 0,
//     lng: 0,
//     infoList: []
//   });
//   //#region  useEffect

//   useEffect(() => {
//     displayDB = stateMapControl.dashboardEnabled
//     displayTable = stateMapControl.tableInfoEnabled
//   }, [])

//   useEffect(() => {
//     if (!get(information, 'info.vid')) {
//       setStateMapControlChange(["fitObjectEnabled"], false)
//     }

//     isOnDragEnd = false
//     _isZoomOfFocus = false
//     information.info && updateDataInitial(JSON.parse(JSON.stringify(information)))
//   }, [information])

//   useEffect(() => {
//     // _isFocus = isFocus
//   }, [isFocus])

//   useEffect(() => {
//   }, [isFitBounds])

//   useEffect(() => {
//     if (get(merkerFocusLocation, 'lat')) {
//       let { lat, lng } = merkerFocusLocation
//       panToMarker(lat, lng)
//     }
//   }, [merkerFocusLocation])

//   useEffect(() => {
//     _isZoomPan = isZoomPan
//     if (_isZoomPan) setZoomPanMarker()
//   }, [isZoomPan])

//   useEffect(() => {
//     _stateMapControl = stateMapControl
//   }, [stateMapControl])

//   useEffect(() => {
//     displayTable = stateMapControl.tableInfoEnabled
//   }, [stateMapControl.tableInfoEnabled])

//   useEffect(() => {
//     _timeLast = timeLast
//   }, [timeLast])

//   useEffect(() => {
//     // console.log("> initialVehiclesData : ", initialVehiclesData)
//     if (!_firstLoad) {
//       if (initialVehiclesData.length > 0) {
//         let data = JSON.parse(JSON.stringify(initialVehiclesData))
//         dataInitail = [...data]
//         setPointData([...data])
//         countdownUpdate()
//       }
//       else {
//         loadRealtimeInitial()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     return () => {
//       // componentWillUnmount
//       cancleFetchApi()
//       timeoutTask !== null && clearTimeout(timeoutTask)
//       dispatch(setStateReduxRealtime({
//         tailMarker: [],
//         isFilterInteractiveDashboard: false
//       }))
//       setStateMapControlChange(["legendEnabled"], true)
//       _firstLoad = false
//     }
//   }, [])

//   const setLayerMarker = (geoTypeList) => {
//     if (mapRef.current) {
//       if (geoTypeList.length > 0) {
//         mapRef.current = setOverlayImageMaps(mapRef.current, geoTypeList, language, false)
//         window.google.maps.event.addListener(mapRef.current, 'click', async function (e) {
//           setTimeout(async () => {
//             if (!onClickWindowInfo) {
//               let loc = e.latLng
//               let info = await getInfo(e.latLng, geoTypeList, false);

//               if (info.length > 0) {
//                 setInfoGeofences({
//                   ...infoGeofences,
//                   visible: true,
//                   currentPage: 1,
//                   lat: loc.lat(),
//                   lng: loc.lng(),
//                   infoList: info
//                 })
//               }
//             }
//             onClickWindowInfo = false
//           }, 50);
//         });
//       }
//       else {
//         setOverlayImageMaps(mapRef.current, [], language, false)
//         closeWindowInfo()
//       }
//     }
//   }

//   const setWindowInfo = () => {
//     let cardInfo = ""

//     if (infoGeofences.infoList.length === 1) {
//       infoGeofences.infoList.forEach(info => {
//         cardInfo = setInfoTable(info, language)
//       })
//     }
//     else if (infoGeofences.infoList.length > 1) {
//       cardInfo = setInfoTable((infoGeofences.infoList[infoGeofences.currentPage - 1]), language)
//     }
//     return cardInfo
//   }

//   const closeWindowInfo = () => setInfoGeofences({
//     ...infoGeofences,
//     visible: false,
//     currentPage: 1,
//     lat: 0,
//     lng: 0,
//     infoList: []
//   })

//   const cancleFetchApi = () => {
//     controllerSignal.forEach(controller => {
//       if (!controller.signal.aborted) controller.abort()
//     });
//   }

//   //#endregion

//   const countdownUpdate = () => timeoutTask = setTimeout(loadRealtimeLast, 30000)
//   // const countdownUpdate = () => timeoutTask = setTimeout(loadRealtimeLast, 15000)

//   const loadRealtimeInitial = async () => {
//     setStateMapControlChange(["fitObjectEnabled"], false)
//     cancleFetchApi()
//     setRequestWorking(true)
//     // Load data initial
//     if (!eventMapActive) {
//       _firstLoad = true
//       try {
//         dispatch(setStateReduxRealtime({ vehiclesLoading: true }))
//         const controller = new AbortController();
//         let signal = controller.signal;
//         controllerSignal.push(controller)
//         // var response = await fetch("https://hino-api.onelink-iot.com/prod/fleet/V2/Realtime?user_id=36&gzip_status=True", {
//         var response = await fetch(ENDPOINT_SCGL2 + "fleet/V2/scg/RealtimeExtend?user_id=" + dataLogin.userId + "&gzip_status=True", {
//           method: 'GET',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           signal
//         });

//         if (get(document, 'location.hash') !== "#/realtime") return

//         _timeLast = new Date().toISOString().split('.')[0]
//         dispatch(setTimeLast(_timeLast))

//         var data = await response.json();

//         if (!isEmpty(data)) {
//           let result = mappingDataToArray(data, "en")

//           dataInitail = [...result]
//           setPointData([...result])
//           dispatch(setInitialVehicles([...result])) // SET TO REDUX
//           countdownUpdate()
//         }
//         else {
//           dispatch(setInitialVehicles([]))
//         }
//         setRequestWorking(false)
//         dispatch(setStateReduxRealtime({ intitialLoadTable: false, hideOverlayPanel: false }))
//       } catch (error) {
//         console.log("ERR => loadRealtimeInitial : ", error)
//         dispatch(setInitialVehicles([]))
//         setRequestWorking(true)
//         dispatch(setStateReduxRealtime({ intitialLoadTable: false, hideOverlayPanel: false }))
//       }
//     }
//   }

//   const loadRealtimeLast = async () => {
//     // return
//     if (!eventMapActive && !requestWorking) {
//       const controller = new AbortController();
//       let signal = controller.signal;
//       controllerSignal.push(controller)

//       try {
//         // var response = await fetch("https://hino-api.onelink-iot.com/prod/fleet/V2/Realtime?user_id=36&last_call=" + _timeLast + "&gzip_status=True", {
//         var response = await fetch(ENDPOINT_SCGL2 + "fleet/V2/scg/RealtimeExtend?user_id=" + dataLogin.userId + "&last_call=" + _timeLast + "&gzip_status=True", {
//           method: 'GET',
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//           },
//           signal
//         });
//         var data = await response.json();

//         _timeLast = new Date().toISOString().split('.')[0]
//         dispatch(setTimeLast(_timeLast))

//         if (!isEmpty(data)) {
//           let _newDataInitail = [...dataInitail]
//           let dataUpdate = mappingDataToArray(data, "en")

//           //#region อัพเดท Data initail
//           for (let index in dataUpdate) {
//             let vid = dataUpdate[index][0]
//             // update data initial
//             let idx = _newDataInitail.findIndex(x => x[0] === vid);
//             if (idx >= 0) {
//               _newDataInitail[idx] = dataUpdate[index]

//               //#region ถ้ารถ focus อยู่ และมีข้อมูลอัพเดทของคันที่ focus ให้ดึง api information แล้วอัพเดทข้อมูล initial ด้วย
//               if (_informationTemp.info && _informationTemp.info.vid == vid) {
//                 dispatch(getInformationMarker(vid, 'Mqtt', '', false))
//               }
//               //#endregion
//             }
//             else { // ADD NEW VEHICLE  
//               _newDataInitail.push(dataUpdate[index])
//             }
//           }
//           //#endregion

//           dataInitail = [..._newDataInitail]
//           setPointData([..._newDataInitail])
//           dispatch(setInitialVehicles([..._newDataInitail])) // SET TO REDUX
//           dispatch(setStateReduxRealtime({ dataRealtimeUpldate: dataUpdate }))
//         }

//       } catch (error) { }
//     }
//     countdownUpdate()
//   }

//   const updateDataInitial = (data) => {
//     // console.log(">>> updateDataInitial <<<")
//     // console.log("_newDataInitail : ", dataInitail)
//     // console.log("data : ", data)
//     let _newDataInitail = [...dataInitail]
//     let idx = _newDataInitail.findIndex(x => x[0] === data.info.vid);

//     if (_newDataInitail.length > 0) {
//       _newDataInitail[idx][7] = data.gps.speed
//       _newDataInitail[idx][5] = data.gps.lat
//       _newDataInitail[idx][6] = data.gps.lng
//       _newDataInitail[idx][9] = data.gps.image.course
//       // _newDataInitail[idx].gps.image.class_type = data.gps.image.class_type
//       _newDataInitail[idx][19] = data.info.vehicle_type_id
//       _newDataInitail[idx][8] = data.gps.image.status
//       _newDataInitail[idx][1] = data.info.vehicle_name
//       // _newDataInitail[idx].rpm = data.sensor.canbus.rpm

//       dataInitail = [..._newDataInitail]
//       setPointData([..._newDataInitail])
//       dispatch(setInitialVehicles([..._newDataInitail]))
//     }
//   }

//   //#region Check condition point
//   _informationTemp = information
//   let data = []

//   for (let index in pointData) {
//     let vid = pointData[index][0]
//     let found = true
//     displayVehicle !== null && (found = displayVehicle.includes(vid))

//     //#region ทำลบที่ตรงกับ info
//     if (!isEmpty(information) && vid == information.info.vid) found = false
//     //#endregion

//     // FILTER DATA IN BOUNDS
//     let insideBounds = false
//     if (mapRef.current) {
//       const bd = mapRef.current.getBounds();
//       var latlng = new window.google.maps.LatLng(pointData[index][5], pointData[index][6]);
//       if (bd.contains(latlng)) insideBounds = true
//     }

//     found && insideBounds && data.push({
//       "category": "anti-social-behaviour",
//       "location_type": "Force",
//       "location": {
//         "latitude": pointData[index][5],
//         "longitude": pointData[index][6]
//       },
//       "context": "",
//       "outcome_status": null,
//       "persistent_id": "",
//       "id": vid,
//       "location_subtype": "",
//       "month": "2019-10",
//       "image": {
//         "class_type": pointData[index][19],
//         "status": pointData[index][8],
//         "course": pointData[index][9]
//       },
//       "vid": vid,
//       "licenseplate": pointData[index][3],
//       "vehicle_name": pointData[index][1],
//       "vin_no": pointData[index][2],
//       "sleep_mode": pointData[index][20]
//     })
//   }
//   //#endregion

//   //#region Set Data Point
//   const points = data.map(dt => ({
//     type: "Feature",
//     properties: { cluster: false, markId: dt.id },
//     geometry: {
//       type: "Point",
//       coordinates: [
//         parseFloat(dt.location.longitude),
//         parseFloat(dt.location.latitude)
//       ]
//     },
//     image: {
//       class_type: dt.image.class_type,
//       status: dt.image.status,
//       course: dt.image.course
//     },
//     vid: dt.vid,
//     licenseplate: dt.licenseplate,
//     vehicle_name: dt.vehicle_name,
//     vin_no: dt.vin_no,
//     sleep_mode: dt.sleep_mode
//   }));

//   const { clusters, supercluster } = useSupercluster({
//     points,
//     bounds,
//     zoom,
//     options: {
//       minPoints: 2,
//       minZoom: 0,
//       maxZoom: 22,
//       radius: 120,
//       nodeSize: 128,
//     }
//   });

//   //#endregion

//   //#region  Set icon size
//   if (mapRef.current) {
//     let zoom = mapRef.current.getZoom()
//     if (zoom < 15) {
//       _iconSize = 50
//       _tooltipButtom = 5
//     }
//     else if (zoom >= 15 && zoom <= 17) {
//       _iconSize = 100
//       _tooltipButtom = 15
//     }
//     else {
//       _iconSize = 150
//       _tooltipButtom = 25
//     }
//   }
//   //#endregion

//   //#region  Fit Bounds
//   const fitBounds = () => {
//     if (mapRef.current && isFitBounds) {
//       let bounds = new window.google.maps.LatLngBounds();
//       for (let index in data) {
//         bounds.extend({ lat: data[index].location.latitude, lng: data[index].location.longitude })
//       }
//       bounds.length > 0 && mapRef.current.fitBounds(bounds)
//       dispatch(setFitBounds(false))
//     }
//   }
//   fitBounds()
//   //#endregion

//   //#region Set Zoom Pan
//   const setZoomPanMarker = () => {
//     if (mapRef.current && _informationTemp.info) {
//       eventMapActive = true
//       // mapRef.current.panTo({ lat: information.gps.lat, lng: information.gps.lng });
//       // mapRef.current.setZoom(17)

//       dispatch(setZoomPan(false))
//       _markerFocus = information.info.vid
//       eventMapActive = false
//     }
//     else {
//       dispatch(setZoomPan(false))
//     }
//   }

//   const setSmoothZoom = (map, level, cnt) => {
//     if (cnt > level) {
//       cnt -= 1
//       setTimeout(() => {
//         map.setZoom(cnt)
//         setSmoothZoom(map, level, cnt);
//       }, 80);
//     }
//     else if (cnt < level) {
//       cnt += 1
//       setTimeout(() => {
//         map.setZoom(cnt)
//         setSmoothZoom(map, level, cnt);
//       }, 80);
//     } else {
//       return;
//     }
//   }

//   const panToMarker = (lat, lng) => {
//     if (mapRef.current) {
//       mapRef.current.panTo({ lat, lng });

//       if (!onClickMarker) mapRef.current.setZoom(15)

//       onClickMarker = false
//     }
//   }
//   //#endregion

//   //#region Set PanTo เมื่อ focus อยู่
//   const setFocusMarker = () => {
//     if (mapRef.current && isFocus && _informationTemp.info) {
//       setTimeout(() => {
//         try {
//           !isOnDragEnd && !_isZoomOfFocus && mapRef.current.panTo({ lat: _informationTemp.gps.lat, lng: _informationTemp.gps.lng });
//         } catch {
//           // console.log("ERRER => _informationTemp : ", _informationTemp)
//         }
//       }, 200);
//     }
//   }
//   //#endregion

//   const _onCollapseTableInfo = (value) => {
//     let myibox2 = $(`#content-colaps-table-info`)
//     if (document.documentElement.scrollTop === 0) {
//       myibox2.slideToggle(600);
//     }
//     else {
//       myibox2.slideToggle(1);
//     }
//   }

//   const setStateMapControlChange = (stateNameList, value) => {
//     let stateMapControl = JSON.parse(JSON.stringify(_stateMapControl))
//     for (let index in stateNameList) stateMapControl[stateNameList[index]] = value
//     dispatch(setTempMapControl(stateMapControl))
//   }

//   const setActiceMarker = (information) => {
//     if (infoLoading) return
//     if (_markerFocus !== "" && get(information, 'info.vid') == _markerFocus) setFocusMarker()

//     return (
//       <MarkerMap
//         key={get(information, 'info.vid')}
//         lat={get(information, 'gps.lat')}
//         lng={get(information, 'gps.lng')}
//         bottom={_tooltipButtom}
//         licensePlateEnabled={_stateMapControl.licensePlateEnabled}
//         licenseplate={(get(information, 'info.vehicle_name', "") !== "") ? get(information, 'info.vehicle_name') :
//           (get(information, 'info.licenseplate', "") !== "") ? get(information, 'info.licenseplate') : get(information, 'info.vin_no')
//         }
//         markerType={"Actived"}
//         classType={get(information, 'info.vehicle_type_id')}
//         status={get(information, 'gps.image.status')}
//         iconSize={_iconSize}
//         course={get(information, 'gps.image.course')}
//         sleep_mode={get(information, 'gps.sleep_mode', "0")}
//       />
//     )
//   }

//   const checkLocationInBound = () => {
//     for (let i in listGeof) {
//       if (mapRef.current) {
//         let { position, point, polyline, polygon } = listGeof[i]
//         const bd = mapRef.current.getBounds()
//         let latlng = new window.google.maps.LatLng(position.lat, position.lng)
//         let visible = false
//         if (bd.contains(latlng)) visible = true
//         if (point) point.setVisible(visible)
//         if (polyline) polyline.setVisible(visible)
//         if (polygon) polygon.setVisible(visible)
//       }
//     }
//   }

//   let clusterDisable = (data.length > 150) ? true : false

//   let disableButtons = []
//   if (clusterDisable) disableButtons.push('cluster')
//   if (mapRef.current && mapRef.current.zoom <= 11) disableButtons.push('nameGeof')

//   // console.log(">> RENDER MAP <<")
//   return (
//     <div>
//       <Loading />
//       <div id={"content-colaps-table-info"} style={{ backgroundColor: "#bac2c4", marginBottom: 8, display: 'none' }}>
//         <VehicleInfo />
//       </div>

//       <div style={{ height: "calc(100vh - 72px)", width: "100%", marginTop: displayDB ? 0 : 7 }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY + "&v=3.exp&libraries=drawing,geometry,places&language=en&region=" + language }}
//           defaultCenter={{ lat: 13.786377, lng: 100.608755 }}
//           defaultZoom={5}
//           yesIWantToUseGoogleMapApiInternals
//           onGoogleApiLoaded={({ map }) => {
//             map.minZoom = 0
//             mapRef.current = map;
//             setMap(map)
//             setBusinessPOI(map)
//             setLayerMarker(geofenceListsOnMapLoad)  // GEOSERVER GEOFENCES
//           }}
//           onChange={({ zoom, bounds }) => {
//             setZoom(zoom);
//             setBounds([
//               bounds.nw.lng,
//               bounds.se.lat,
//               bounds.se.lng,
//               bounds.nw.lat
//             ]);
//           }}
//           onDrag={() => {
//             isOnDragEnd = true
//             eventMapActive = true
//           }}
//           onDragEnd={() => {
//             eventMapActive = false
//             checkLocationInBound()
//             setStateMapControlChange(["fitObjectEnabled"], false)
//             dispatch(setFocus(false))
//           }}
//           onZoomAnimationStart={() => {
//             eventMapActive = true
//             _isZoomOfFocus = true
//           }}
//           onZoomAnimationEnd={() => {
//             eventMapActive = false
//             checkLocationInBound()
//           }}
//           options={{
//             gestureHandling: 'greedy',
//             zoomControl: true,
//             zoomControlOptions: {
//               position: 5,
//             },
//             mapTypeControl: false,
//             streetViewControl: true,
//             streetViewControlOptions: {
//               position: 5,
//             },
//             rotateControl: false,
//             fullscreenControl: false
//           }}
//         >
//           {
//             map !== null && <>
//               {/* MAP CONTROL OPTIONS */}
//               <MapControlsCustomNew
//                 map={map}
//                 beforeCusBtn={[
//                   { id: "cluster", title: "Cluster", icon: "icon-layer-group" },
//                   { id: "fitObjects", title: "Fit Objects", icon: "icon-expand" }
//                 ]}
//                 afterCusBtn={[
//                   { id: "tableInfo", title: "รายละเอียดการเดินทาง", icon: "fa fa-list-alt" },
//                   { id: "info", title: "Info", icon: "fa fa-info-circle" }
//                 ]}
//                 defaultActiveButtons={{ info: true }}
//                 activeButtons={{
//                   dashboard: stateMapControl.dashboardEnabled,
//                   geofences: stateMapControl.geofencesEnabled,
//                   cluster: stateMapControl.clusterEnabled,
//                   nameGeof: stateMapControl.nameGeofEnabled,
//                   licensePlate: stateMapControl.licensePlateEnabled,
//                   fitObjects: stateMapControl.fitObjectEnabled,
//                   mapType: stateMapControl.mapType,
//                   traffic: stateMapControl.traffic,
//                   tableInfo: stateMapControl.tableInfoEnabled
//                 }}
//                 onGeofenceTypeChange={(value) => {
//                   geofenceListsOnMapLoad = [...value]
//                   setLayerMarker([...value])
//                 }}
//                 hiddenButtons={["nameGeof"]}
//                 disableButtons={disableButtons}
//                 onToggleActive={(id, value) => {
//                   if (id === 'cluster') setStateMapControlChange(["clusterEnabled"], value)
//                   else if (id === 'geofences') {
//                     setStateMapControlChange(["geofencesEnabled"], value)
//                   }
//                   else if (id === 'nameGeof') setStateMapControlChange(["nameGeofEnabled"], value)
//                   else if (id === 'licensePlate') setStateMapControlChange(["licensePlateEnabled"], value)
//                   else if (id === 'tableInfo') {
//                     setStateMapControlChange(["tableInfoEnabled"], value)
//                     _onCollapseTableInfo(value)
//                     window.scroll({ top: 0, behavior: 'smooth' })
//                   }
//                   else if (id === 'info') setStateMapControlChange(["legendEnabled"], value)
//                   else if (id === 'mapType') setStateMapControlChange(["mapType"], value)
//                   else if (id === 'fitObjects') {
//                     if (value) {
//                       isOnDragEnd = false
//                       dispatch(setZoomPan(true))
//                     }
//                     setStateMapControlChange(["fitObjectEnabled"], value)
//                     dispatch(setFocus(value))
//                   }
//                   else if (id === 'traffic') setStateMapControlChange(["traffic"], value)
//                 }}
//               />

//               {/* VEHICLES LIST PANEL */}
//               <MapControl position={1} map={map} id={'Info'} width="auto">
//                 <Legend />
//               </MapControl>

//               {/* VEHICLES LIST PANEL */}
//               <MapControl position={7} map={map} id={'overlay-panel'} width="auto">
//                 <OverlayPanelNew />
//               </MapControl>

//               {/* FOOTER INFORMATION */}
//               <MapControl position={9} map={map} id={'footer-info'}>
//                 <FooterInfo />
//               </MapControl>

//               {/* MODAL VIDEO TEST*/}
//               {
//                 <MapControl position={5} map={map} id={'layout-modal-video'} width='auto'>
//                   <ModalVideo />
//                 </MapControl>
//               }

//               {/* POLY LINE > แสดงเมื่อ focus marker */}
//               <Tail map={mapRef.current} />
//             </>
//           }

//           {infoGeofences.visible &&
//             <Marker
//               lat={infoGeofences.lat}
//               lng={infoGeofences.lng}
//             >
//               <div
//                 className="ant-popover ant-popover-placement-top"
//                 style={{
//                   transform: 'translate(-48%, -100%)',
//                   zIndex: 500
//                 }}
//                 onClick={() => onClickWindowInfo = true}
//               >
//                 <div className="ant-popover-content">
//                   <div className="ant-popover-arrow">
//                     <span className="ant-popover-arrow-content"></span>
//                   </div>
//                   <div className="ant-popover-inner popover-info" role="tooltip">
//                     <div className="ant-popover-title-custom">
//                       <button
//                         type="button"
//                         aria-label="Close"
//                         className="ant-modal-close"
//                         onClick={() => closeWindowInfo()}
//                       >
//                         <span className="ant-modal-close-x-custom">
//                           <span role="img"
//                             aria-label="close"
//                             className="anticon anticon-close ant-modal-close-icon">
//                             <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
//                           </span>
//                         </span>
//                       </button>
//                     </div>
//                     <div className="ant-popover-inner-content-custom">
//                       {setWindowInfo()}
//                     </div>

//                     {
//                       infoGeofences.infoList.length > 1 && <div className="ant-popover-inner-footer-custom">
//                         <Pagination
//                           size="small"
//                           current={infoGeofences.currentPage}
//                           total={infoGeofences.infoList.length}
//                           defaultPageSize={1}
//                           onChange={(page) => setInfoGeofences({ ...infoGeofences, currentPage: page })}
//                         />
//                       </div>
//                     }

//                   </div>
//                 </div>
//               </div>
//             </Marker>}

//           {/* GEOFENCES */}
//           {!isEmpty(geofenceByTypes) &&
//             mapRef.current && mapRef.current.zoom > 11 &&
//             stateMapControl.nameGeofEnabled &&
//             geofenceByTypes.map((data) => {
//               let { id, iconPoint, geofenceName, iconUrl } = data
//               const bd = mapRef.current.getBounds();
//               let latlng = new window.google.maps.LatLng(iconPoint.lat, iconPoint.lng);

//               if (bd.contains(latlng)) {
//                 // อยู่ในพื้นที่
//                 return <MarkerGeof
//                   key={`geof-name-${id}`}
//                   lat={iconPoint.lat}
//                   lng={iconPoint.lng}
//                   geofenceName={geofenceName}
//                   iconUrl={iconUrl}
//                 />
//               }
//             })}

//           {/* Marker Actice */}
//           {!isEmpty(information) && setActiceMarker(information)}

//           {/* MARKER CLUSTER */}
//           {clusterDisable || stateMapControl.clusterEnabled ? clusters.map((cluster) => {
//             let class_type = ""
//             let status = ""
//             let course = ""

//             if (cluster.image) {
//               class_type = cluster.image.class_type;
//               status = cluster.image.status;
//               course = cluster.image.course;
//             }

//             let _licenseplate = get(cluster, 'vehicle_name')
//             if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
//             if (_licenseplate == "") _licenseplate = get(cluster, 'vin_no')

//             const [longitude, latitude] = cluster.geometry.coordinates;
//             const {
//               cluster: isCluster,
//               point_count: pointCount
//             } = cluster.properties;

//             if (isCluster) {
//               let clusterSize = `${40 + (pointCount / points.length) * 40}px`
//               return (
//                 <Marker
//                   key={`cluster-${cluster.id}`}
//                   lat={latitude}
//                   lng={longitude}
//                 >
//                   <div
//                     className="cluster-marker"
//                     style={{
//                       width: clusterSize,
//                       height: clusterSize,
//                       transform: 'translate(-50%, -50%)',
//                       cursor: 'pointer'
//                     }}

//                     onClick={() => {
//                       const expansionZoom = Math.min(
//                         supercluster.getClusterExpansionZoom(cluster.id), 22
//                       );

//                       mapRef.current.setZoom(expansionZoom + 2);
//                       mapRef.current.panTo({ lat: latitude, lng: longitude });
//                     }}
//                   >
//                     {pointCount}
//                   </div>
//                 </Marker>
//               );
//             }

//             return (
//               <MarkerMap
//                 key={cluster.vid}
//                 lat={latitude}
//                 lng={longitude}
//                 onClick={() => {
//                   let [lng, lat] = cluster.geometry.coordinates
//                   onClickMarker = true
//                   dispatch(getInformationMarker(cluster.vid, 'Marker', { lat, lng }))
//                   _markerFocus = cluster.vid
//                 }}
//                 bottom={_tooltipButtom}
//                 licensePlateEnabled={stateMapControl.licensePlateEnabled}
//                 licenseplate={_licenseplate}
//                 markerType={"Inactived"}
//                 classType={class_type}
//                 status={status}
//                 iconSize={_iconSize}
//                 course={course}
//                 sleep_mode={cluster.sleep_mode}
//               />
//             );
//           })
//             : points.map((cluster, index) => {
//               const [longitude, latitude] = cluster.geometry.coordinates;
//               if (mapRef.current) {
//                 const bd = mapRef.current.getBounds();
//                 var latlng = new window.google.maps.LatLng(latitude, longitude);
//                 if (!bd.contains(latlng)) return
//               }

//               let class_type = ""
//               let status = ""
//               let course = ""

//               if (cluster.image) {
//                 class_type = cluster.image.class_type;
//                 status = cluster.image.status;
//                 course = cluster.image.course;
//               }

//               let _licenseplate = get(cluster, 'vehicle_name')
//               if (_licenseplate == "") _licenseplate = get(cluster, 'licenseplate')
//               if (_licenseplate == "") _licenseplate = get(cluster, 'vin_no')

//               // console.log(">> cluster.sleep_mode 2 : ", cluster)

//               let markerType = "Inactived"

//               if (_markerFocus !== "" && cluster.vid == _markerFocus) {
//                 markerType = "Actived"
//                 setFocusMarker()
//               }

//               return (
//                 <MarkerMap
//                   key={cluster.vid}
//                   lat={latitude}
//                   lng={longitude}
//                   onClick={() => {
//                     dispatch(getInformationMarker(cluster.vid, 'Marker'))
//                     _markerFocus = cluster.vid
//                   }}
//                   bottom={_tooltipButtom}
//                   licensePlateEnabled={stateMapControl.licensePlateEnabled}
//                   licenseplate={_licenseplate}
//                   markerType={"Inactived"}
//                   classType={class_type}
//                   status={status}
//                   iconSize={_iconSize}
//                   course={course}
//                   sleep_mode={cluster.sleep_mode}
//                 />
//               );
//             })}

//         </GoogleMapReact>
//       </div>
//     </div >
//   );
// }

// export default Map

// const setInfoTable = (info, language) => {
//   const tdStyle1 = { border: 'none', width: 180, verticalAlign: 'top' }
//   const tdStyle2 = { border: 'none', width: 150, verticalAlign: 'top' }

//   let geometry = info.geometry
//   let {
//     geofence_type_name,
//     geofence_name_en,
//     geofence_name_jp,
//     geofence_name,
//     geofence_description_en,
//     geofence_description_jp,
//     geofence_description,
//     province,
//     district,
//     subdistrict,
//     is_hazard,
//     is_share
//   } = info.properties

//   let geofenceName = "", geofenceDescription = ""

//   if (language === 'en' && geofence_name_en !== "")
//     geofenceName = isEmpty(geofence_name_en) ? geofence_name : geofence_name_en
//   else if (language === 'ja' && geofence_name_jp !== "")
//     geofenceName = isEmpty(geofence_name_jp) ? geofence_name : geofence_name_jp
//   else
//     geofenceName = geofence_name


//   if (language === 'en' && geofence_description_en !== "")
//     geofenceDescription = isEmpty(geofence_description_en) ? geofence_description : geofence_description_en
//   else if (language === 'ja' && geofence_description_jp !== "")
//     geofenceDescription = isEmpty(geofence_description_jp) ? geofence_description : geofence_description_jp
//   else
//     geofenceDescription = geofence_description


//   const keyEN = ["Geofence Type", "Geofence Name", "Geofence Description", "Subdistrict", "District", "Province", "Hazard", "Share", "Geometry Type"]
//   const keyTH = ["ชนิดจีโอเฟนซ์", "ชื่อจีโอเฟนซ์", "รายละเอียดจีโอเฟนซ์", "ตำบล/แขวง", "อำเภอ", "จังหวัด", "เขตอันตราย", "ใช้ร่วมกับผู้อื่น", "รูปแบบพื้นที่"]
//   const keyJA = ["ジオフェンスタイプ", "ジオフェンス名", "ジオフェンスの説明", "区、町", "市、行政区", "県", "危険地帯", "シェア", "形状"]

//   let dt = []
//   language == "en" ? dt = keyEN : language == "th" ? dt = keyTH : dt = keyJA
//   let lb_realtime_93 = dt[0]
//   let lb_realtime_94 = dt[1]
//   let lb_realtime_95 = dt[2]
//   let lb_realtime_96 = dt[3]
//   let lb_realtime_97 = dt[4]
//   let lb_realtime_98 = dt[5]
//   let lb_realtime_99 = dt[6]
//   let lb_realtime_100 = dt[7]
//   let lb_realtime_101 = dt[8]

//   return <div>
//     <table className="table-info-window">
//       <tbody>
//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_93">{lb_realtime_93}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_geofenceType">{geofence_type_name}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_94">{lb_realtime_94}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_geofenceName">{geofenceName}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_95">{lb_realtime_95}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_geofenceDescription">{geofenceDescription}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_98">{lb_realtime_98}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_province">{province}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_97">{lb_realtime_97}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_district">{district}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_96">{lb_realtime_96}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_subdistrict">{subdistrict}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_99">{lb_realtime_99}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_hazard">{is_hazard ? "Yes" : "No"}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_100">{lb_realtime_100}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_share">{is_share ? "Yes" : "No"}</small>
//           </td>
//         </tr>

//         <tr>
//           <td style={tdStyle1}>
//             <small id="lb_realtime_101">{lb_realtime_101}</small>
//           </td>
//           <td style={tdStyle2}>
//             <small id="lb_geometryType">{geometry.type}</small>
//           </td>
//         </tr>

//       </tbody>
//     </table>
//   </div>
// }
