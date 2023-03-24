// PRIMARY CONSTANTS

export const GECODE_API_KEY = "AIzaSyBOEl17DNwCcE0sR9LGJh72rBGF_vDfk1c";
export const ENCRIPTION_STRING = "rawcaster@!@#$QWERTxcvbn";

export const GOOGLE_CLIENT_ID =
  "749429188201-u1e40oco3dejrfcnr7algubh0k0sf01e.apps.googleusercontent.com";

export const FACEBOOK_APP_ID = "501963974865826";

export const INSTAGRAM_APP_ID = "1652047128572389";

export const INSTAGRAM_APP_SECRET = "a4ccdb1961ffe87bd5f38861c7958586";

export const TWITTER_CLIENT_ID = "YTF4cTFKU25UVld2Yk1JUzFFSnU6MTpjaQ";

export const TWITTER_CLIENT_SECRET =
  "dwhNdl1A-GnBbKu63J77qSLApgyMQrnOFiKDzgcHjBQDfbENw2";

export const APPLE_API_KEY = "CR8PDZDGNZcom.rawcaster.app";

export const PRIMARY_REDIRECT_URI = "https://dev.rawcaster.com/";
export const REDIRECT_URI = "https://localhost:3000/signup/";
export const SECONDARY_REDIRECT_URI = "https://dev.rawcaster.com/signup";
export const INSTA_REDIRECT_URI = "https://dev.rawcaster.com/signup/";
// SECONDARY CONSTANTS

export const PASSWORD_EXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const NAME_REGEX = /^[A-Za-z_ ]+$/;

export const NUMBER_REGEX = /^[0-9]*$/;
export const MOBILE_NUMBER_REGEX = "";
export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// export const LOGIN_ID = /^(?:\d{5,16}|\w+@\w+\.\w{2,3})$/;
// eslint-disable-next-line react-hooks/exhaustive-deps

export const SHARED_TYPE = [
  { id: 1, key: 1, Value: "Public", label: "Public" },
  { id: 2, key: 2, Value: "Only me", label: "Only me" },
  { id: 3, key: 3, Value: "Groups", label: "Groups" },
  { id: 4, key: 4, Value: "Specific Connection", label: "Specific Connection" },
  // {
  //   id: 5,
  //   key: 5,
  //   Value: "both Group and Individual",
  //   label: "both Group and Individual",
  // },
  { id: 6, key: 6, Value: "Connections", label: "Connections" },
  { id: 7, key: 7, Value: "My Fans", label: "My Fans" },
];
