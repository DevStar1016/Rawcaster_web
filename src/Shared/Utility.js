/**
 * This file contains various utility functions used throughout the application.
 */
import Geocode from "react-geocode";
import {
  ENCRIPTION_STRING,
  GECODE_API_KEY,
  GOOGLE_CLIENT_ID,
} from "./Constant";
import {
  getCookieData,
  removeCookieData,
  removeLocalStorageData,
} from "../Store/Storage";
import { handleAuthReset } from "../Store/Redux/Reducer/AuthReducer";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import Linkify from "linkify-react";
import LinkOpenModal from "../Modal/Verification/LinkOpenModal";
import moment from "moment";
import { getTimezone } from "countries-and-timezones";
import moment1 from "moment-timezone";
import {
  handleNuggetFormData,
  handleResetNuggets,
} from "../Store/Redux/Reducer/NuggetsReducer";
import { Popover, message } from "antd";
import { Typography } from "antd";
import axios, { isCancel } from "axios";
import { toast } from "react-hot-toast";
import classes from "../Sharedcomponents/Nuggets/Nuggets.module.css";
import { SALT_KEY } from "../Services/APIkeyID";

// Auth

/**
 * Retrieves the rawcaster user token from the cookie data.
 * @returns {object | null} The rawcaster user token if it exists, otherwise null.
 */
export const getRawcaserToken = () => {
  if (getCookieData("rawcaster_user_token")) {
    try {
      return JSON.parse(getCookieData("rawcaster_user_token"));
    } catch (error) {
      return null;
    }
  }
  return null;
};

/**
 * Generates an authentication token by hashing the given value with a salt key.
 * @param {string} value - The value to be hashed.
 * @returns {string} The authentication token.
 */
export const getAuthToken = (value) => {
  var sha1 = require("sha1");
  return sha1(SALT_KEY + value);
};

/**
 * Encrypts a given string by encoding it using base64 and appending an encryption string.
 * @param {string} str - The string to be encrypted.
 * @returns {string} The encrypted string.
 */
export const EncryptionString = (str) => {
  return window.btoa(str + ENCRIPTION_STRING);
};

/**
 * Decrypts a given string using the window.atob() function.
 * @param {string} str - The string to be decrypted.
 * @returns The decrypted string, with the encryption string removed, or 0 if an error occurs.
 */
export const DecryptionString = (str) => {
  try {
    let data = window.atob(str);
    return data.substr(0, data.length - ENCRIPTION_STRING.length);
  } catch (error) {
    return 0;
  }
};

/**
 * Removes the user token by dispatching actions to update the login data, token, and user settings to null.
 * Also removes the user token from the cookie data.
 * @param {function} dispatch - The dispatch function from the Redux store.
 * @returns None
 */
export const RemoveToken = (dispatch) => {
  dispatch(handleAuthReset(null));
  removeLocalStorageData("persist:root");
  removeCookieData("rawcaster_user_token");
};

//GEO_CODE_CONFIGURE

/**
 * Retrieves geocode data based on the user's current location.
 * @returns {Promise} A promise that resolves to an object containing the address and location data.
 *                    If an error occurs, the promise resolves to an object with empty values.
 */
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

/**
 * Converts an address to latitude and longitude coordinates using the Google Maps Geocoding API.
 * @param {string} address - The address to convert.
 * @returns {Promise} A promise that resolves to the latitude and longitude coordinates of the address.
 *                    If the conversion fails, the promise is rejected with an error.
 */
export const ConvertAddresstoLatLng = (address) => {
  return new Promise((resolve, reject) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => resolve(latLng))
      .catch((error) => reject(error));
  });
};

// Common Utility

/**
 * Decodes HTML entities in a given string.
 * @param {string} data - The string to decode.
 * @returns {string} The decoded string.
 */
export const decodeHtml = (data) => {
  return decode(data);
};

/**
 * Converts a JSON object to FormData.
 * @param {object} object - The JSON object to convert.
 * @returns {FormData} - The converted FormData object.
 */
export const JSONtoformdata = (object) => {
  const formData = new FormData();
  for (const key in object) {
    formData.append(key, object[key]);
  }
  return formData;
};

/**
 * Converts an array of values into an array of objects with 'label' and 'value' properties.
 * @param {Array} listData - The array of values to convert.
 * @returns {Array} An array of objects with 'label' and 'value' properties.
 */
export const getSelectData = (listData = []) => {
  return listData.map((value) => ({
    label: value,
    value: value,
  }));
};

/**
 * Filters out properties with undefined, null, or empty string values from an object.
 * @param {object} obj - The object to filter.
 * @returns {object} - A new object with only the properties that have non-empty values.
 */
export function filterValidObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * Returns a valid image URL based on the input.
 * @param {string | object} img - The image URL or object.
 * @returns {string} - The valid image URL.
 */
export const getValidImageUrl = (img) => {
  if (typeof img === "object") {
    return URL.createObjectURL(img);
  } else {
    return img;
  }
};

/**
 * Retrieves the value associated with a given ID from an array of data objects.
 * @param {Array} data - The array of data objects.
 * @param {number} id - The ID to search for.
 * @returns The value associated with the given ID, or an empty string if no match is found.
 */
export const getDataValueById = (data, id) => {
  let findData = data.find((ele) => ele.id === parseInt(id));

  if (findData) {
    return findData.Value;
  } else {
    return "";
  }
};

/**
 * Checks if the user is authenticated by verifying the presence of a rawcaser token.
 * @returns {boolean} - true if the user is authenticated, false otherwise.
 */
export const getAuthenticated = () => {
  if (getRawcaserToken()) {
    return true;
  } else {
    return false;
  }
};
console.log(getAuthenticated());
/**
 * Loads a resource from the specified URL using XMLHttpRequest.
 * @param {string} url - The URL of the resource to load.
 * @returns {Promise<Blob>} - A promise that resolves with the loaded resource as a Blob.
 * If the loading fails, the promise is rejected with an error message.
 */
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

/**
 * Returns a partially hidden email address by replacing all characters after the first
 * three characters of the email name with asterisks.
 * @param {string} email - The email address to partially hide.
 * @returns {string} - The partially hidden email address.
 */
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

/**
 * Returns a partially hidden mobile number by replacing the middle digits with asterisks.
 * @param {number} number - The mobile number to be partially hidden.
 * @returns {string} The partially hidden mobile number.
 */
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

/**
 * Converts milliseconds to a string formatted as MM:SS.
 * @param {number} milliseconds - The number of milliseconds to convert.
 * @returns {string} The formatted time string in the format MM:SS.
 */
export function millisecondsToMMSS(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Checks if the given data is valid.
 * @param {any} data - The data to be checked.
 * @returns {boolean} - True if the data is valid, false otherwise.
 */
export const isValidData = (data) => {
  if (data && data !== "" && data.trim() !== "") {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if the user account is valid based on the provided user data.
 * @param {object} userData - The user data object.
 * @returns {boolean} - True if the account is valid, false otherwise.
 */
export const isAccountValid = (userData) => {
  if (userData && userData?.acc_verify_status === 1) {
    return true;
  } else {
    return false;
  }
};

/**
 * Detects if the current device is a mobile device by checking the user agent string
 * against a list of known mobile device patterns.
 * @returns {boolean} - true if the device is a mobile device, false otherwise.
 */
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

/**
 * A custom React hook that returns the current width of the window.
 * @returns {number} The current width of the window.
 */
export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
}

/**
 * Calculates the aspect ratio of a rectangle given its height and width.
 * @param {number} height - The height of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @returns {number} The aspect ratio of the rectangle.
 */
export function getAspectRatio(height, width) {
  const gcd = (a, b) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };
  const divisor = gcd(height, width);
  const numerator = height / divisor;
  const denominator = width / divisor;
  return numerator / denominator;
}

/**
 * Checks if a given file is a valid image file.
 * @param {File} file - The file to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file is a valid image, and false otherwise.
 */
export function isValidImageFile(file) {
  if (!file.type.startsWith("image/")) {
    return false;
  }

  const reader = new FileReader();

  reader?.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        resolve(true);
      };

      img.onerror = () => {
        reject(false);
      };
    };
  });
}

// Timezone

/**
 * Extracts the timezone name from a string.
 * @param {string} str - The string containing the timezone information.
 * @returns {string} The extracted timezone name.
 */
export const getTimezoneName = (str) => {
  let index;
  try {
    index = str.indexOf("(");
  } catch (error) {}
  if (index > -1) return str.substr(0, index - 1).trim();
  else return str;
};

/**
 * Get the UTC offset of the current timezone.
 * @param {string} timezone - The timezone to get the offset for.
 * @returns The UTC offset of the given timezone, or null if the offset cannot be determined.
 */
export const utcoffset = getTimezone(moment.tz?.guess()) ?? null;

/**
 * Converts a UTC time to the user's timezone.
 * @param {string} time - The UTC time to convert in the format "YYYY-MM-DD HH:mm:ss".
 * @param {string} [zonename=null] - The name of the timezone to convert to. If not provided, the user's default timezone will be used.
 * @returns {moment.Moment} - The converted time in the user's timezone.
 */
export const utctoUserTimezone = (time, zonename = null) => {
  let utcCutoff = moment.utc(time, "YYYY-MM-DD HH:mm:ss");
  if (zonename) {
    let displayCutoff = moment1(utcCutoff)
      .tz(getTimezoneName(zonename))
      .format("YYYY-MM-DD HH:mm:ss");

    return moment(displayCutoff);
  } else {
    return moment(utcCutoff);
  }
};

/**
 * Converts a given time from the user's timezone to UTC.
 * @param {string} time - The time to convert in the format "YYYY-MM-DD HH:mm:ss".
 * @param {string} zonename - The name of the user's timezone.
 * @returns The converted time in UTC format.
 */
export const userTimezonetoUtc = (time, zonename) => {
  let userTimeZone = moment1(time, "YYYY-MM-DD HH:mm:ss").tz(
    getTimezoneName(zonename)
  );
  return moment(userTimeZone).utc();
};

/**
 * Converts a UTC time to the user's timezone with the timezone abbreviation.
 * @param {string} time - The UTC time to convert in the format "YYYY-MM-DD HH:mm:ss".
 * @param {string} zonename - The name of the user's timezone.
 * @returns {string} - The timezone abbreviation for the converted time.
 */
export const utctoUserTimezonewithAbbr = (time, zonename) => {
  let utcCutoff = moment.utc(time, "YYYY-MM-DD HH:mm:ss");
  let displayCutoff = moment1(utcCutoff)?.tz(getTimezoneName(zonename));
  let timezoneabbrs = displayCutoff?.tz(getTimezoneName(zonename)).format("z");
  return timezoneabbrs;
};

/**
 * Converts a given time string to a formatted display event time.
 * @param {string} time - The time string to convert.
 * @returns {string} The formatted display event time in "hh:mm A" format.
 */
export const getDisplayEventTime = (time) => {
  if (time) {
    return moment(time, "YYYY-MM-DD hh:mm:ss").format("hh:mm A");
  }
  return "";
};

/**
 * Returns the formatted display event date based on the received date and the specified date format.
 * @param {Date} receivedDate - The received date of the event.
 * @param {string} [dateFormat="MM/DD/YYYY"] - The format in which the date should be displayed.
 * @returns {string} The formatted display event date.
 */
export const getDisplayEventDate = (
  receivedDate,
  dateFormat = "MM/DD/YYYY"
) => {
  if (receivedDate) {
    let todaysDate;
    if (utcoffset?.utcOffsetStr) {
      todaysDate = utctoUserTimezone(
        receivedDate,
        moment.tz.guess() + " (+" + utcoffset?.utcOffsetStr + ")"
      ).format(dateFormat);
    }
    return utcoffset?.utcOffsetStr ? todaysDate : "";
  }
  return "";
};

/**
 * Formats a given date and time using the moment.js library.
 * @param {Date} t - The date and time to format.
 * @returns {string} - The formatted date and time in the format "D MMM YYYY hh:mm A".
 */
export const shareEventDate = (t) => {
  return moment(t).format("D MMM YYYY hh:mm A ");
};

/**
 * Converts a given date and time to a short date format relative to the current time zone.
 * @param {string} time - The date and time to convert.
 * @param {string} time_zone - The time zone to use for the conversion.
 * @returns {string} - The short date format relative to the current time zone.
 */
export const dateToShortDate = (time, time_zone) => {
  const momenttimezone = require("moment-timezone");
  const currentTime = momenttimezone.utc().format("YYYY-MM-DD HH:mm:ss");
  return moment(time).from(moment(currentTime, "YYYY-MM-DD HH:mm:ss"));
};

/**
 * Converts a given date to a formatted string using the moment.js library.
 * @param {Date} t - The date to convert.
 * @returns {string} - The formatted date string.
 */
export const datetoString = (t) => {
  return moment(t).format("D MMM YYYY [ • ] h:mm A ");
};

/**
 * Handles the navigation to a user's profile page.
 * @param {Object} userData - The user data object containing necessary information.
 * @param {Function} userData.navigate - The function to navigate to a new page.
 * @param {Function} userData.dispatch - The function to dispatch actions.
 * @param {Object} userData.nuggetFormData - The form data for nuggets.
 * @param {string} userData.user_id - The ID of the current user.
 * @returns None
 */
export const handleProfileNavigate = (userData) => {
  const Encrypted_id = window.location.pathname.replace("/viewprofile/", "");
  const display_user_id = DecryptionString(Encrypted_id);
  const { navigate, dispatch, nuggetFormData, user_id } = userData;
  if (parseInt(display_user_id) !== parseInt(user_id)) {
    let filterData = { ...nuggetFormData };
    filterData.formData = {
      ...filterData.formData,
      search_key: null,
      user_id: user_id,
      page_number: 1,
    };
    filterData.formData = filterValidObject(filterData.formData);
    dispatch(handleResetNuggets());
    dispatch(handleNuggetFormData(filterValidObject(filterData)));
    // dispatch(fetchNuggetsbyId(filterValidObject(filterData)));
    navigate(`/viewprofile/${EncryptionString(user_id)}`);
  }
};

/**
 * Handles error responses from API requests and returns a promise that resolves or rejects based on the error.
 * @param {Error} error - The error object received from the API request.
 * @returns {Promise} - A promise that resolves or rejects based on the error.
 */
export const ErrorHandling = (error) => {
  return new Promise((resolve, reject) => {
    if ((axios, isCancel(error))) {
    } else if (error.response) {
      if (error.response.status === 404) {
        handleErrorMsg(
          "The requested resource does not exist or has been deleted",
          resolve
        );
      } else if (error.response.status === 401) {
        handleErrorMsg("Please login to access this resource!", resolve);
      } else if (error.response.status === 500) {
        handleErrorMsg("Internal Server Error !", resolve);
      } else {
        handleErrorMsg("An error occurred");
      }
    } else if (error.request) {
      handleErrorMsg("Unable to connect to the server !", resolve);
    } else {
      handleErrorMsg("Something went Wrong!", resolve);
    }
  });
};
/**
 * Displays an error message using the message.error() function and resolves the given promise.
 * @param {string} msg - The error message to display.
 * @param {function} resolve - The resolve function of a promise to be resolved after displaying the error message.
 * @returns None
 */
const handleErrorMsg = (msg, resolve) => {
  message.error(msg).then(() => {
    resolve();
  });
};

/**
 * Determines whether a user can be added as a friend based on their status.
 * @param {number} status - The status of the user.
 * @returns {boolean} - True if the user can be added as a friend, false otherwise.
 */
export const getisAddFriend = (status) => {
  switch (status) {
    case 0:
      return false;
    case 1:
      return false;
    case 3:
      return false;
    default:
      return true;
  }
};

/**
 * Converts a time duration in the format "hh:mm" to a human-readable format.
 * @param {string} time - The time duration in the format "hh:mm".
 * @returns {string} - The time duration in the format "x hrs y mins".
 */
export const eventDisplayDuration = (time) => {
  let dur = time.split(":");
  let hr = parseInt(dur[0]) > 0 ? `${dur[0]} hrs ` : "";
  return `${hr}  ${dur[1]}  mins`;
};

// Google Contacts

/**
 * Fetches the user's Google contacts using the Google People API.
 * @returns {Promise<Array>} A promise that resolves to an array of the user's contacts.
 * @throws {Error} If there is an error fetching the contacts.
 */
export const fetchGoogleContacts = async () => {
  let maxResults = 1000;
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Load the Google API client library
      await new Promise((resolve, reject) => {
        window.gapi.load("client", resolve);
      });

      // Step 2: Initialize the client library
      await window.gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
        ],
        scope: "https://www.googleapis.com/auth/contacts.other.readonly",
      });

      // Step 3: Authenticate and fetch contacts
      await window.gapi.auth2.getAuthInstance().signIn();
      const response = await window.gapi.client.people.otherContacts.list({
        pageSize: maxResults,
        readMask: "names,emailAddresses,photos",
      });
      resolve(response.result.otherContacts);
    } catch (error) {
      console.log(error);
      // reject(error);
    }
  });
};

/**
 * A component that displays a "Read More" functionality for long text content.
 * @param {number} [partialShowLines=3] - The number of lines to show before truncating the text.
 * @param {ReactNode} children - The content to display.
 * @param {boolean} [isReadMore=true] - Whether to show the "Read More" functionality.
 * @param {boolean} isLinkopenModal - Whether to open a modal when a link is clicked.
 * @param {function} setisLinkopenModal - A function to set the state of isLinkopenModal.
 * @param {boolean} isReadMoreValid - A function to check if the "Read More" functionality is valid
 *  @param {boolean} isMetaDataAvailable - A function to check if the "Meta Data Available" functionality is valid
 * @param {function} MetaDataContent - A function to Display Meta Data
 */
export const ReadMore = ({
  Influencer,
  partialShowLines = 3,
  children,
  isReadMore = true,
  isLinkopenModal,
  setisLinkopenModal,
  isReadMoreValid,
  onExpand,
  partialHeight,
  isMetaDataAvailable = false,
  MetaDataContent,
}) => {
  const { Paragraph } = Typography;
  const [OnEllipsis, setOnEllipsis] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [readMore, setReadmore] = useState(false);
  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes;
    return (
      <>
        <a
          className="content_link"
          onClick={() => {
            if (href.includes("rawcaster")) {
              window.open(href);
            } else {
              setisLinkopenModal(true);
            }
          }}
          {...props}
        >
          {isMetaDataAvailable ? (
            <Popover
              content={() => MetaDataContent(href)}
              overlayInnerStyle={{
                padding: 0,
                width: "100%",
              }}
              onClick={() => {
                setisLinkopenModal(true);
              }}
            >
              {decodeHtml(content)}
            </Popover>
          ) : (
            decodeHtml(content)
          )}
        </a>

        <LinkOpenModal
          open={isLinkopenModal}
          url={href}
          close={() => {
            setisLinkopenModal(false);
          }}
        />
      </>
    );
  };
  return (
    <Linkify options={{ render: renderLink }}>
      {expanded || isReadMore ? (
        <>
          <Paragraph
            className="ReadMoreText"
            n
            style={{
              cursor: "pointer",
              width: Influencer && !readMore ? "calc(100% - 80px)" : "100%",
              wordBreak: "break-all",
            }}
          >
            {children}
          </Paragraph>
          {OnEllipsis && (
            <span
              style={{ color: "#e26386", cursor: "pointer" }}
              onClick={() => {
                if (onExpand) {
                  onExpand(false);
                }
                setExpanded(false);
              }}
            >
              Read Less
            </span>
          )}
        </>
      ) : children?.split("\n")?.length > partialHeight ? (
        <>
          <Paragraph
            className="ReadMoreText"
            style={{
              cursor: "pointer",
              width: Influencer && !readMore ? "calc(100% - 80px)" : "100%",
              wordBreak: "break-all",
            }}
            onClick={() => {}}
          >
            {readMore
              ? children
              : children
                  ?.split("\n")
                  ?.filter((ele, index) => index < partialHeight)
                  .join("\n")
                  .concat("...")}
          </Paragraph>
          {children?.split("\n")?.length > partialHeight && (
            <>
              {!readMore ? (
                <span
                  style={{ color: "#e26386", cursor: "pointer" }}
                  onClick={() => {
                    setReadmore(true);
                  }}
                >
                  Read More
                </span>
              ) : (
                <span
                  style={{ color: "#e26386", cursor: "pointer" }}
                  onClick={() => {
                    setReadmore(false);
                  }}
                >
                  Read Less
                </span>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Paragraph
            className="ReadMoreText"
            ellipsis={{
              rows: parseInt(partialShowLines),
              onExpand: onExpand,
              onEllipsis: (status) => {
                isReadMoreValid();
                setOnEllipsis(status);
              },
              expandable: true,
            }}
            style={{
              cursor: "pointer",
              width: Influencer && !readMore ? "calc(100% - 80px)" : "100%",
              wordBreak: "break-all",
            }}
          >
            {children}
          </Paragraph>
          {OnEllipsis && (
            <span
              style={{ color: "#e26386", cursor: "pointer" }}
              onClick={() => {
                if (onExpand) {
                  onExpand(true);
                }
                setExpanded(true);
              }}
            >
              Read More
            </span>
          )}
        </>
      )}
    </Linkify>
  );
};

/**
 * Timer class that allows pausing and resuming of a callback function with a specified delay.
 * @param {function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The delay in milliseconds before executing the callback function.
 * @returns None
 */
export const Timer = function (callback, delay) {
  var timerId,
    start,
    remaining = delay;

  this.pause = function () {
    window.clearTimeout(timerId);
    timerId = null;
    remaining -= Date.now() - start;
  };

  this.resume = function () {
    if (timerId) {
      return;
    }

    start = Date.now();
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
};

/**
 * Formats the given number of bytes into a human-readable string representation.
 * @param {number} bytes - The number of bytes to format.
 * @returns {string} The formatted string representation of the bytes.
 */
export function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${formattedSize} ${sizes[i]}`;
}

/**
 * Handles copying a given URL to the clipboard.
 * @param {string} url - The URL to be copied.
 * @returns {Promise} - A promise that resolves when the text is successfully copied to the clipboard.
 *                     Rejects with an error if there was an issue copying the text.
 */
export const handleCopyText = (url, successMsg = null) => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        resolve();
        toast.remove("rawcaster");
        toast.success(successMsg ? successMsg : "Link copied to clipboard", {
          id: "rawcaster",
        });
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  });
};

/**
 * Converts a Blob URL to a File object.
 * @param {string} blobUrl - The Blob URL to convert.
 * @param {string} [fileName="blobtofile"] - The name of the resulting File object.
 * @returns {Promise<File>} A Promise that resolves with the converted File object.
 * @throws {string} If there is an error converting the Blob URL to a File.
 */
export const BlobUrlToFile = async (blobUrl, fileName = "blobtofile") => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(blobUrl, {
        responseType: "blob",
      });
      const getFileType = (url = blobUrl) => {
        const extension = url.substring(url.lastIndexOf(".") + 1);
        const imageExtensions = ["jpg", "jpeg", "png", "gif"];
        const videoExtensions = ["mp4", "avi", "mov"];
        const audioExtensions = ["mp3", "wav", "ogg"];

        if (imageExtensions.includes(extension)) {
          return `image/${extension}`;
        } else if (videoExtensions.includes(extension)) {
          return `video/${extension}`;
        } else if (audioExtensions.includes(extension)) {
          return `audio/${extension}`;
        } else {
          return response.data.type;
        }
      };
      const file = new File([response.data], fileName, {
        type: getFileType(),
      });
      resolve(file);
    } catch (error) {
      reject("Error converting Blob URL to File:", error);
    }
  });
};

/**
 * Downloads a file from the given URL.
 * @param {string} url - The URL of the file to download.
 * @returns None
 */
export const downloadurl = (url) => {
  var file_path = url;
  var a = document.createElement("A");
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf("/") + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Converts a UTC date and time to the system's local date and time.
 * @param {string} dateTime - The UTC date and time in the format "YYYY-MM-DD HH:mm:ss".
 * @returns {moment.Moment} - The converted local date and time.
 */
export const getUtcToSystemTime = (dateTime) => {
  return moment(dateTime, "YYYY-MM-DD HH:mm:ss").subtract(
    -moment().utcOffset(),
    "minutes"
  );
};
