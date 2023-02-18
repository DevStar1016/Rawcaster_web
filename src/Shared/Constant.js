// PRIMARY CONSTANTS

export const GECODE_API_KEY = "AIzaSyBOEl17DNwCcE0sR9LGJh72rBGF_vDfk1c";

export const GOOGLE_CLIENT_ID =
  "307641306325-8tf2v7n1ojhbb55fcphff06gvp1dgg2e.apps.googleusercontent.com";

export const FACEBOOK_APP_ID = "501963974865826";

export const INSTAGRAM_APP_ID = "1652047128572389";

export const INSTAGRAM_APP_SECRET = "a4ccdb1961ffe87bd5f38861c7958586";

export const TWITTER_CLIENT_ID = "YTF4cTFKU25UVld2Yk1JUzFFSnU6MTpjaQ";

export const TWITTER_CLIENT_SECRET =
  "dwhNdl1A-GnBbKu63J77qSLApgyMQrnOFiKDzgcHjBQDfbENw2";

export const APPLE_API_KEY = "CR8PDZDGNZcom.rawcaster.app";

export const PRIMARY_REDIRECT_URI = "https://dev.rawcaster.com";
export const REDIRECT_URI = "https://localhost:3000";

// SECONDARY CONSTANTS

export const PASSWORD_EXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const NAME_REGEX = /^[A-Za-z_ ]+$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SHARED_TYPE = [
  { id: 1, Value: "Public" },
  { id: 2, Value: "Only me" },
  { id: 3, Value: "Groups" },
  { id: 4, Value: "Individual" },
  { id: 5, Value: "both Group and Individual" },
];
