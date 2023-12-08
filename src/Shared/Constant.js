// BASE URL
const DEV_BASE_URL = "https://devapi.rawcaster.com/rawcaster/";
const PRODUCTION_BASE_URL = "https://api.rawcaster.com/rawcaster/";
export const BASE_URL =
  process.env.NODE_ENV === "production" ? PRODUCTION_BASE_URL : DEV_BASE_URL;

// PRIMARY CONSTANTS
// export const DEFAULT_VIDEO =
//   "https://rawcaster.com/rawadmin/uploads/default/myluckyzone.mp4#t=0.001";
export const DEFAULT_VIDEO =
  "https://rawcaster.s3.us-west-2.amazonaws.com/nuggets/video_83461699330855.mp4#t=0.001";
export const DEFAULT_VIDEO_RAWCASTER =
  "https://rawcaster.s3.us-west-2.amazonaws.com/nuggets/video_47841690153307.mp4#t=0.001";
export const SHARE_URL = "https://dev.rawcaster.com/join/";
export const NUGGET_SHARE_URL = "https://devshare.rawcaster.com/index.php?id=";
export const PRIMARY_REDIRECT_URI = "https://dev.rawcaster.com/";
export const SECONDARY_REDIRECT_URI = "https://dev.rawcaster.com/signup";
export const ENCRIPTION_STRING = "rawcaster@!@#$QWERTxcvbn";

// SECONDARY CONSTANTS
export const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";
export const PASSWORD_EXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const NAME_REGEX = /^[A-Za-z_ ]+$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const MOBILE_NUMBER_REGEX = /^[0-9\s\-\+\(\)]{5,15}$/;
export const EMAIL_REGEX =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Character Limit
export const CHARACTER_LIMIT = {
  LOGIN_ID: 150,
  FIRST_NAME: 50,
  LAST_NAME: 50,
  DISPLAY_NAME: 40,
  MOBILE_NO: 15,
  EMAIL: 50,
  GENDER: 50,
  STUDIED_AT: 50,
  WORKED_AT: 50,
  PASSWORD: 50,
  GEO_LOCATION: 100,
  DEFAULT: 50,
  CHAT_TEXT_MAX_LENGTH: 100,
  REPORT_MESSAGE: 500,
  POLL_CHOICE: 25,
  AGE: 2,
};

export const MIN_CHARACTER_LIMIT = {
  MOBILE_NO: 5,
  PASSWORD: 8,
  LOGIN_ID: 5,
  OTP: 6,
};

// export const LOGIN_ID = /^(?:\d{5,16}|\w+@\w+\.\w{2,3})$/;
// eslint-disable-next-line react-hooks/exhaustive-deps

export const IS_CHIME_ENABLE = false;

export const SHARED_TYPE = [
  { id: 1, key: 1, Value: "Public", label: "Public" },
  { id: 2, key: 2, Value: "Only me", label: "Only me" },
  { id: 3, key: 3, Value: "Groups", label: "Groups" },
  { id: 4, key: 4, Value: "Specific Connection", label: "Specific Connection" },
  { id: 6, key: 6, Value: "Connections", label: "Connections" },
  { id: 7, key: 7, Value: "My Fans", label: "My Fans" },
];

export const GENDER_TYPE = [
  // { key: 0, label: "TransGender" },
  { key: 1, label: "Male" },
  { key: 2, label: "Female" },
];

export const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    padding: 0,
    position: "relative",
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    minHeight: 285,
    maxHeight: 285,
  }),
  option: (provided, state) => ({
    ...provided,
    color: "black",
    backgroundColor: state.isSelected ? "#DEEBFF" : "transparent",
    opacity: state.isDisabled ? 1 : 1,
    marginBottom: "0px",
    padding: "0 12px !important",
    borderRadius: "0px",
    ":hover": {
      ...provided,
      backgroundColor: "#fafafa",
      cursor: "pointer",
      borderRadius: "8px",
      color: "black",
    },
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    display: "none",
  }),
};

// Chat

export const AES_IV_KEY = "CDCA735CDA8888EECDCA735CDA8888EE";
export const AES_KEY =
  "cece3a7dc9cf86aae926fd2ee520a06e5a5b616fa9e381de53600121e8aff095";
export const AES_ENCRYPT_METHOD = "aes-256-cbc";
