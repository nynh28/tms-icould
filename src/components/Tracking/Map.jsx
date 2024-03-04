import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, MarkerF, InfoWindow, InfoWindowF, Polyline, Circle } from "@react-google-maps/api";
import CircularProgress from "@mui/material/CircularProgress";
import InforBox from "./InforBox";
import { useDispatch, useSelector } from "react-redux";
import { selectTruck } from "../../features/truck/truckSlice";

const Map = () => {
    const [lat, setLat] = useState(13.759056594460827);
    const [lng, setLng] = useState(100.49986200303755);
    const [iconSize, setIconSize] = useState(50);
    const [zoom, setZoom] = useState(7);
    const [position, setPosition] = useState([]);
    const [showingInfoWindow, setShowingInfoWindow] = useState(false);
    const [map, setMap] = useState(null)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEYS,
        libraries: ["places"],
    });

    const dispatch = useDispatch();
    const truckSelector = useSelector(state => state.truck.selected);
    const truckPosition = useSelector(state => state.truck.position);
    const listTruck = useSelector(state => state.truck.listTruck)

    

    useEffect(() => {
        if (truckSelector && truckSelector.driveInfo && truckSelector.driveInfo.y) {
            setZoom(18)
            const { x, y } = truckSelector.driveInfo
            if(x && y){}
            setLat(Number(x))
            setLng(Number(y))
            setShowingInfoWindow(true)
            // console.log(selected)
            const _lat = Number(x)
            const _lng = Number(y)
            const label = 'position' + position.length
            setPosition(oldArray => [{ lat: _lat, lng: _lng, label }, ...oldArray])
            console.log(position, selected)
        } else {
            setZoom(10)
        }
    }, [truckSelector])

    useEffect(() => {
        console.log(truckPosition)
    }, [truckPosition])

    useEffect(() => {

    })

    useEffect(() => {
        // console.log(listTruck)
    },[listTruck])

    const onClickTruck = (truck) => {
        // console.log('click', truck)
        // dispatch(selectTruck(truck)) 
        // console.log(truck)
        // setShowingInfoWindow(!showingInfoWindow)
        // setZoom(20)
        // setLat(+truck?.driveInfo?.x)
        // setLng(+truck?.driveInfo?.y)

    }

    useEffect(() => {
        // console.log(zoom)
        if (zoom) {
            if (zoom >= 10) {
                setIconSize(100)
            } else {
                setIconSize(50)
            }
        }
    }, [zoom])

    const optionsPolyline = {
        geodesic: true,
        strokeColor: '#4CD964',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillOpacity: 0.35,
        draggable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    };

    if (!isLoaded) {
        return (
            <div className="flex min-h-full items-center justify-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <GoogleMap
            center={{
                lat: lat,
                lng: lng,
            }}
            onLoad={map => {
                setMap(map)
            }}
            onZoomChanged={() => {
                if(map)
                setZoom(map.getZoom())
            }}
            zoom={zoom}
            mapContainerStyle={{ width: "100%", height: "100%", minHeight: "calc(100vh - 140px)" }}
            options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
        >

            {
                listTruck.length > 0 && listTruck.map((truck, index) => {
                    let lat = Number(truck?.driveInfo?.x);
                    let lng = Number(truck?.driveInfo?.y);
                    // console.log(lat, lng)
                    // listTruck[0]?.driveInfo?.x && 
                    return (
                        <MarkerF
                        animation={2}
                        key={index}
                        position={new window.google.maps.LatLng({ lat, lng })}
                        icon={{
                            url: '/public/images/truck-icon.png',
                            scaledSize: { width: iconSize, height: iconSize }
                        }}
                        clickable
                        onClick={() => onClickTruck(truck)}
                    >
                        {showingInfoWindow && <InforBox selected={truckSelector} />}
                    </MarkerF>
                    )
                })
            }

            
            {/* {selected && <MarkerF animation={2} position={{ lat: lat, lng: lng }}
                icon={{
                    url: '/public/images/truck-icon.png',
                    scaledSize: { width: 40, height: 40 }
                }}
                clickable
                onClick={() => setShowingInfoWindow(!showingInfoWindow)}
            >
                {showingInfoWindow && <InforBox selected={selected} />}
            </MarkerF>} */}
            <Polyline
                path={truckPosition}
                options={optionsPolyline}
            />
        </GoogleMap>
    );
};

export default Map;
