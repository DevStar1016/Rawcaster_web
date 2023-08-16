import Geocode from "react-geocode";
import {
  AES_KEY,
  ENCRIPTION_STRING,
  GECODE_API_KEY,
  GOOGLE_CLIENT_ID,
} from "./Constant";
import { getCookieData, removeCookieData } from "../Store/Storage";
import {
  handleLoginData,
  handleToken,
  handleuserSettings,
} from "../Store/Redux/Reducer/AuthReducer";
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
import { message } from "antd";
import { Typography } from "antd";
import axios, { isCancel } from "axios";
import { toast } from "react-hot-toast";
import { AES, enc } from "crypto-js";
import classes from "../Sharedcomponents/Nuggets/Nuggets.module.css";
import { SALT_KEY } from "../Services/APIkeyID";

// Auth

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

export const getAuthToken = (value) => {
  var sha1 = require("sha1");
  return sha1(SALT_KEY + value);
};

export const EncryptionString = (str) => {
  return window.btoa(str + ENCRIPTION_STRING);
};

export const DecryptionString = (str) => {
  try {
    let data = window.atob(str);
    return data.substr(0, data.length - ENCRIPTION_STRING.length);
  } catch (error) {
    return 0;
  }
};

export const RemoveToken = (dispatch) => {
  dispatch(handleLoginData(null));
  dispatch(handleToken(null));
  dispatch(handleuserSettings(null));
  removeCookieData("rawcaster_user_token");
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
  if (getRawcaserToken()) {
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

export const isAccountValid = (userData) => {
  if (userData && userData?.acc_verify_status === 1) {
    return true;
  } else {
    return false;
  }
};

// export const ReadMore = ({
//   partialShowLines = 3,
//   children,
//   isReadMore = true,
//   isLinkopenModal,
//   setisLinkopenModal,
//   isReadMoreValid,
// }) => {
//   const renderLink = ({ attributes, content }) => {
//     const { href, ...props } = attributes;
//     return (
//       <>
//         <a
//           className="content_link"
//           onClick={() => {
//             setisLinkopenModal(true);
//           }}
//           {...props}
//         >
//           {decodeHtml(content)}
//         </a>

//         <LinkOpenModal
//           open={isLinkopenModal}
//           url={href}
//           close={() => {
//             setisLinkopenModal(false);
//           }}
//         />
//       </>
//     );
//   };

//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const [showLink, setShowLink] = useState(false);

//   useLayoutEffect(() => {
//     if (
//       ref.current &&
//       ref.current.clientHeight < ref.current.scrollHeight &&
//       !isReadMore
//     ) {
//       isReadMoreValid();
//       setShowLink(true);
//     } else if (isReadMore) {
//       if (ref.current && ref.current.clientHeight < ref.current.scrollHeight) {
//         isReadMoreValid();
//         setOpen(true);
//       }
//     }
//   }, [ref]);

//   let textClass = `text${partialShowLines}lines`;
//   if (open) {
//     textClass += " open";
//   }

//   return (
//     <Linkify options={{ render: renderLink }}>
//       <div>
//         <span className={textClass} ref={ref}>
//           {children}
//         </span>
//         {showLink && (
//           <>
//             <span
//               onClick={() => setOpen(!open)}
//               style={{ color: "#e26386", cursor: "pointer" }}
//             >
//               {open ? "Read Less" : "Read More"}
//             </span>
//           </>
//         )}
//       </div>
//     </Linkify>
//   );
// };

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

export const getTimezoneName = (str) => {
  let index;
  try {
    index = str.indexOf("(");
  } catch (error) {}
  if (index > -1) return str.substr(0, index - 1).trim();
  else return str;
};

export const utcoffset = getTimezone(moment.tz?.guess()) ?? null;

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

export const userTimezonetoUtc = (time, zonename) => {
  let userTimeZone = moment1(time, "YYYY-MM-DD HH:mm:ss").tz(
    getTimezoneName(zonename)
  );
  return moment(userTimeZone).utc();
};

export const utctoUserTimezonewithAbbr = (time, zonename) => {
  let utcCutoff = moment.utc(time, "YYYY-MM-DD HH:mm:ss");
  let displayCutoff = moment1(utcCutoff)?.tz(getTimezoneName(zonename));
  let timezoneabbrs = displayCutoff?.tz(getTimezoneName(zonename)).format("z");
  return timezoneabbrs;
};

export const getDisplayEventTime = (time) => {
  if (time) {
    return moment(time, "YYYY-MM-DD hh:mm:ss").format("hh:mm A");
  }
  return "";
};

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

export const shareEventDate = (t) => {
  return moment(t).format("D MMM YYYY hh:mm A ");
};

export const dateToShortDate = (time, time_zone) => {
  const momenttimezone = require("moment-timezone");
  const currentTime = momenttimezone.utc().format("YYYY-MM-DD HH:mm:ss");
  return moment(time).from(moment(currentTime, "YYYY-MM-DD HH:mm:ss"));
};

export const datetoString = (t) => {
  return moment(t).format("D MMM YYYY [ • ] h:mm A ");
};

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

export const ErrorHandling = (error) => {
  return new Promise((resolve, reject) => {
    if ((axios, isCancel(error))) {
      console.log(error.message);
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
      console.log("something went wrong");
      handleErrorMsg("Something went Wrong!", resolve);
    }
  });
};
const handleErrorMsg = (msg, resolve) => {
  message.error(msg).then(() => {
    resolve();
  });
};

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

export const eventDisplayDuration = (time) => {
  let dur = time.split(":");
  let hr = parseInt(dur[0]) > 0 ? `${dur[0]} hrs ` : "";
  return `${hr}  ${dur[1]}  mins`;
};

// Google Contacts

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
      reject(error);
    }
  });
};

export const ReadMore = ({
  partialShowLines = 3,
  children,
  isReadMore = true,
  isLinkopenModal,
  setisLinkopenModal,
  isReadMoreValid,
  onExpand,
  partialHeight,
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
            setisLinkopenModal(true);
          }}
          {...props}
        >
          {decodeHtml(content)}
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

            // style={{ cursor: "pointer", wordBreak: "break-all" }}
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
            // ellipsis={true}
            style={{ cursor: "pointer" }}
            onClick={() => {
              console.log(
                children
                  ?.split("\n")
                  ?.filter((ele, index) => index < partialHeight)
                  .join("\n"),
                "childrenchildren"
              );
            }}
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
            className={`ReadMoreText ${classes.dNoneExpand}`}
            ellipsis={{
              rows: parseInt(partialShowLines),
              onExpand: onExpand,
              onEllipsis: (status) => {
                isReadMoreValid();
                setOnEllipsis(status);
              },
              expandable: true,
            }}
            // ellipsis={true}
            style={{ cursor: "pointer" }}
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

export function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${formattedSize} ${sizes[i]}`;
}

export const handleCopyText = (url) => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        resolve();

        toast.success("Text copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  });
};

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

export const downloadurl = (url) => {
  var file_path = url;
  var a = document.createElement("A");
  a.href = file_path;
  a.download = file_path.substr(file_path.lastIndexOf("/") + 1);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const getUtcToSystemTime = (dateTime) => {
  return moment(dateTime, "YYYY-MM-DD HH:mm:ss").subtract(
    -moment().utcOffset(),
    "minutes"
  );
};

// OBJECT TO STRING

export const EncryptObjectToString = (objectToEncrypt, secretKey = AES_KEY) => {
  const stringToEncrypt = JSON.stringify(objectToEncrypt);
  const encrypted = AES.encrypt(stringToEncrypt, secretKey).toString();
  return encrypted;
};

export const DecryptStringToObject = (encryptedString, secretKey = AES_KEY) => {
  const decryptedBytes = AES.decrypt(encryptedString, secretKey);
  const decryptedString = decryptedBytes.toString(enc.Utf8);
  const decryptedObject = JSON.parse(decryptedString);
  return decryptedObject;
};

// Testing
export const getusetId = (user_id) => {
  switch (user_id) {
    // case 88:
    //   return 11;
    // case 67:
    //   return 22;
    // case 21:
    //   return 33;
    // case 728:
    //   return 44;
    // case 164:
    //   return 55;
    // case 684:
    //   return 66;
    // case 682:
    //   return 77;
    default:
      return user_id;
  }
};
