import { SALT_KEY } from "../Services/ServiceConstants";
import Geocode from "react-geocode";
import { GECODE_API_KEY } from "./Constant";
import {
  getLocalStorageData,
  removeCookieData,
  removeLocalStorageData,
} from "../Store/Storage";
import { handleLoginData } from "../Store/Redux/Reducer/AuthReducer";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { decode } from "html-entities";
import { useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";

// Auth

export const getAuthToken = (value) => {
  var sha1 = require("sha1");
  return sha1(SALT_KEY + value);
};

export const RemoveToken = (dispatch) => {
  dispatch(handleLoginData(null));
  removeCookieData("rawcaster_user_token");
  removeLocalStorageData("rawcaster_user_token");
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

export const ConvertAddresstoLatLng = (address) => {
  return new Promise((resolve, reject) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => resolve(latLng))
      .catch((error) => reject(error));
  });
};

// Common Utility

export const decodeHtml = (data) => {
  return decode(data);
};

export const JSONtoformdata = (object) => {
  const formData = new FormData();
  for (const key in object) {
    formData.append(key, object[key]);
  }
  return formData;
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

export const getValidImageUrl = (img) => {
  if (typeof img === "object") {
    return URL.createObjectURL(img);
  } else {
    return img;
  }
};

export const getDataValueById = (data, id) => {
  let findData = data.find((ele) => ele.id === parseInt(id));

  if (findData) {
    return findData.Value;
  } else {
    return "";
  }
};

export const getAuthenticated = () => {
  if (getLocalStorageData("rawcaster_user_token")) {
    return true;
  } else {
    return false;
  }
};

export function loadXHR(url) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.onerror = function () {
        reject("Network error.");
      };
      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject("Loading error:" + xhr.statusText);
        }
      };
      xhr.send();
    } catch (err) {
      reject(err.message);
    }
  });
}

export const getPartialHiddenEmail = (email) => {
  if (email) {
    let emailSplitedList = email?.toString().split("@");
    let emailNameText = "";
    emailSplitedList[0]
      .toString()
      .split("")
      .map((letter, index) => {
        if (index > 2) {
          emailNameText = emailNameText + "*";
        } else {
          emailNameText = emailNameText + letter;
        }
      });

    return emailNameText + "@" + emailSplitedList[1];
  } else {
    return "1234";
  }
};

export const getPartialHiddenMobileNumber = (number) => {
  if (number) {
    let splitedNumbersList = number?.toString().split("");
    let phoneNumber = "";
    splitedNumbersList.map((num, index) => {
      if (index < 2 || index > splitedNumbersList.length - 3) {
        phoneNumber = phoneNumber + num;
      } else {
        phoneNumber = phoneNumber + "*";
      }
    });
    return phoneNumber;
  } else {
    return "";
  }
};

export function millisecondsToMMSS(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export const isValidData = (data) => {
  if (data && data !== "" && data.trim() !== "") {
    return true;
  } else {
    return false;
  }
};

export const isAccountValid = () => {
  let userData = JSON.parse(getLocalStorageData("rawcaster_user_token"));
  if (userData.acc_verify_status === 1) {
    return true;
  } else {
    return false;
  }
};

export const ReadMore = ({ children, isReadMore = true }) => {
  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return (
      <a
        className="content_link"
        onClick={() => {
          window.open(href);
        }}
        {...props}
      >
        {decodeHtml(content)}
      </a>
    );
  };
  const [showFullText, setShowFullText] = useState(false);
  const [showpartialText, setshowpartialText] = useState(true);
  const [textHeight, setTextHeight] = useState(0);
  const textRef = useRef(null);
  const toggleShowFullText = () => setShowFullText(!showFullText);
  const toggleShowpartialText = () => setshowpartialText(!showpartialText);
  useEffect(() => {
    setTextHeight(textRef.current.offsetHeight);
  }, [textRef]);

  const isFullTxt = () => {
    if (isReadMore || showFullText) {
      return true;
    } else {
      return false;
    }
  };

  const getValidShowmoreTxt = () => {
    if (detectMob()) {
      return 25;
    } else {
      return 55;
    }
  };

  const getValidPartialShowmoreTxt = () => {
    if (detectMob()) {
      return 200;
    } else {
      return 300;
    }
  };
  const linkProps = {
    onClick: (event) => {
      alert("Are you sure you want to leave this page?");
    },
  };

  return (
    <Linkify options={{ render: renderLink, attributes: linkProps }}>
      <p
        ref={textRef}
        className={`readmore_text ${
          isFullTxt()
            ? showpartialText
              ? "partial_readmore"
              : "full_readmore"
            : ""
        }`}
      >
        {children}
      </p>
      {!isReadMore && textHeight > getValidShowmoreTxt() ? (
        <>
          <span
            onClick={toggleShowFullText}
            style={{ color: "#e26386", cursor: "pointer" }}
          >
            {showFullText ? "Read Less" : "Read More"}
          </span>
        </>
      ) : textHeight > getValidPartialShowmoreTxt() ? (
        <span
          onClick={toggleShowpartialText}
          style={{ color: "#e26386", cursor: "pointer" }}
        >
          {!showpartialText ? "Read Less" : "Read More"}
        </span>
      ) : null}
    </Linkify>
  );
};

export function detectMob() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}
