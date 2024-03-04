import decode from "jwt-decode";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { get, isEmpty } from 'lodash'

import { useEffect, useCallback } from 'react';
import fileDefault from '/images/file-blank-solid-240.png';
import fileCSS from '/images/file-css-solid-240.png';
import filePdf from '/images/file-pdf-solid-240.png';
import filePng from '/images/file-png-solid-240.png';
import fileExcel from '/images/file-excel-solid-240.jpg';
import moment from "moment";

export function useDebounce(effect, dependencies, delay) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}


export const formatMoney = (value) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export function groupBy(arr, prop) {
  const map = new Map(Array.from(arr, obj => [obj[prop], []]));
  arr.forEach(obj => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
}

export function getWeek(week = 0, date) {
  let currentDate = null;

  if (date) {
    currentDate = dayjs(date);
  } else {
    currentDate = dayjs();
  }

  const weekStart = currentDate.add(week, "weeks").startOf("week");

  var days = [];
  for (var i = 0; i <= 6; i++) {
    days.push(dayjs(weekStart).add(i, "days").toDate());
  }
  return days;
}

export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_token = JSON.parse(localStorage.getItem("token"));
  const token = (user && user_token) ? user_token : null;

  if (!token) {
    return false;
  }

  const decodedToken = decode(token);

  if (decodedToken.exp * 1000 < new Date().getTime()) {
    localStorage.clear();
    return false;
  }

  return true;
};

export function momentDate(striDate, format = 'DD/MM/YYYY HH:mm:ss', nameTimeZone = 'Asia/Bangkok', lang = 'en') {
  if (striDate === '' || striDate === null || striDate === '-') {
    return '-'
  }
  if (typeof striDate === 'number') {
    if (striDate.toString().length === 10 || striDate.toString().includes('.')) {
      striDate = striDate * 1000
    }
  }
  return moment.utc(striDate).tz(nameTimeZone).lang(lang).format(format)
  // return moment.utc(striDate).tz(nameTimeZone).format('DD/MM/YYYY HH:mm:ss ZZ')
}

export function mappingDataToArray(data, language) {
  // console.log(">> mappingDataToArray : ", data)
  let result = []
  data.forEach(item => {
      let { driver_cards, driver_info, fleet, gps, info } = item
      let { card_id, name, status_swipe_card } = driver_cards
      // let { driver_code, driver_name, phone } = driver_info
      let { driver_code, driver_name, phone } = get(item, 'driver_info', { driver_code: "", driver_name: "", phone: "" })
      let { fleet_id, fleet_name } = fleet
      let { gpsdate, lat, lng, location, sleep_mode, speed } = gps
      let { location_name, admin_level3_name, admin_level2_name, admin_level1_name,
          admin_level3_name_en, admin_level2_name_en, admin_level1_name_en } = location

      // let { location_name, admin_level3_name, admin_level2_name, admin_level1_name,
      //     admin_level3_name_en, admin_level2_name_en, admin_level1_name_en } = get(item, 'location', {
      //         location_name: "", admin_level3_name: "", admin_level2_name: "", admin_level1_name: "",
      //         admin_level3_name_en: "", admin_level2_name_en: "", admin_level1_name_en: ""
      //     })

      let { course, status } = gps.image
      let { cust_name, licenseplate, vehicle_name, vehicle_type_id, vid, vin_no } = info
      let status_name = getStatusVehicle(status)[`name${language.toUpperCase(language)}`]

      let gpsdateFormat = gpsdate === "1900-01-01 00:00:00" ? null : momentDate(gpsdate)
      if (isEmpty(gpsdateFormat)) gpsdateFormat = ""

      let vehicle_label = vehicle_name
      if (vehicle_label == "") vehicle_label = licenseplate
      if (vehicle_label == "") vehicle_label = vin_no

      result.push([
          vid,
          vehicle_name,
          vin_no,
          licenseplate,
          cust_name,
          lat,
          lng,
          speed,
          status,
          course,
          gpsdateFormat,
          driver_name,
          location_name,
          admin_level3_name,
          admin_level2_name,
          admin_level1_name,
          admin_level3_name_en,
          admin_level2_name_en,
          admin_level1_name_en,
          vehicle_type_id,
          sleep_mode,
          fleet_id,
          fleet_name,
          card_id,
          name,
          status_swipe_card,
          status_name,
          vehicle_label
      ])
  })

  return result
}

export const getStatusVehicle = (status = 'Ign. OFF', speed) => {
    // const arr = [
    //   { code: '#ADADB2', name: 'realtime_4' },
    //   { code: '#5DE648', name: 'realtime_1' },
    //   { code: '#ff3b30', name: 'realtime_2' },
    //   { code: '#FFE600', name: 'realtime_3' },
    //   { code: '#ADADB2', name: 'realtime_4' },
    //   { code: '#5856d6', name: 'realtime_5' }
    // ]
    const color = {
        'Ign. OFF': '#5856d6',
        'Idling': '#ADADB2',
        'Driving': speed < 20 ? '#FFE600' : (speed > 80 ? '#ff3b30' : '#5DE648'),
        'Over speed': '#ff3b30'
    }
    return color[status]
}


export const ImageConfig = {
    default: fileDefault,
    pdf: filePdf,
    png: filePng,
    css: fileCSS,
    xlsx: fileExcel
}