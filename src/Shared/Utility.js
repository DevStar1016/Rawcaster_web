import { SALT_KEY } from "../Services/ServiceConstants";
import Geocode from "react-geocode";
import { GECODE_API_KEY } from "./Constant";

export const getAuthToken = (value) => {
  var sha1 = require("sha1");
  return sha1(SALT_KEY + value);
};

export const JSONtoformdata = (object) => {
  const formData = new FormData();
  for (const key in object) {
    formData.append(key, object[key]);
  }
  return formData;
};

//GEO_CODE_CONFIGURE

export const getGeocodeData = () => {
  return new Promise((resolve, reject) => {
    try {
      Geocode.setApiKey(GECODE_API_KEY);
      navigator.geolocation.getCurrentPosition((position) => {
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            let locationArr = [
              "locality",
              "administrative_area_level_1",
              "country",
            ];
            const addressArr = response.results[0].address_components.filter(
              (data) => {
                if (Array.isArray(data.types) && data.types.length > 0) {
                  return locationArr.includes(data.types[0]);
                }
              }
            );
            let address = "";
            addressArr.forEach((ele, ind) => {
              address += ele.long_name;
              address += addressArr.length - 1 === ind ? "." : ", ";
            });
            resolve({
              address: address,
              location: response.results[0].geometry.location,
            });
          },
          (error) => {
            resolve({
              address: "",
              location: "",
            });
          }
        );
      });
    } catch (error) {
      resolve({
        address: "",
        location: "",
      });
    }
  });
};

export const getSelectData = (listData = []) => {
  return listData.map((value) => ({
    label: value,
    value: value,
  }));
};

export function filterValidObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
}
