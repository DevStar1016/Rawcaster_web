/**
 * A component that allows users to sign in with social media services like Google and Apple.
 * @param {string} type - The type of sign-in service (e.g., "Sign in", "Sign up").
 * @returns The SigninwithService component.
 */
import { useEffect, useState } from "react";
import { LoginSocialApple } from "reactjs-social-login";
import GoogleIcon from "../../Assets/Icons/png/google_logo.png";
import AppleIcon from "../../Assets/Icons/png/apple_logo.png";
import { APPLE_API_KEY, SECONDARY_REDIRECT_URI } from "../../Shared/Constant";
import jwt_decode from "jwt-decode";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  JSONtoformdata,
  getAuthToken,
  getGeocodeData,
} from "../../Shared/Utility";
import { SocialMediaLoginService } from "../../Services/ApiService";
import {
  getSessionStorageData,
  removeSessionStorageData,
  setCookieData,
} from "../../Store/Storage";
import { useParams } from "react-router";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import classes from "./Signup.module.css";
import { toast } from "react-hot-toast";
import { fetchuserInfobyToken } from "../../Store/Redux/Action";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleSigninService } from "../../Shared/SharedAPIs";

const SigninwithService = ({ type }) => {
  const { nugget_id } = useParams();
  const dispatch = useDispatch();
  const [LocationValue, setLocationValue] = useState({
    geo_location: "",
    latitude: "",
    longitude: "",
  });

  /**
   * Executes the specified callback function after the component has rendered.
   * Retrieves geocode data and updates the location value state with the retrieved data.
   * @returns None
   */
  useEffect(() => {
    getGeocodeData()
      .then((res) => {
        setLocationValue((pre) => ({
          ...pre,
          geo_location: res.address,
          latitude: res.location.lat,
          longitude: res.location.lng,
        }));
      })
      .catch((err) => {
        setLocationValue((pre) => ({
          ...pre,
          geo_location: "",
          latitude: "",
          longitude: "",
        }));
      });
  }, []);

  /**
   * Handles the signup process by sending the user's data to the server for authentication.
   * @param {object} values - The user's signup data.
   * @returns None
   */
  const HandleSignup = (values) => {
    let finalData = {
      ...values,
      ...LocationValue,
      auth_code: getAuthToken(values.email_id),
    };
    SocialMediaLoginService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          let finalVal = {
            ...res.data,
          };
          delete finalVal["name"];
          setCookieData("rawcaster_user_token", finalVal);
          dispatch(fetchuserInfobyToken(res.data.token)).then(({ payload }) => {
            if (nugget_id) {
              window.location.assign(`/view/${nugget_id}`);
            } else if (res.data.first_time === 1) {
              window.location.assign("/selectinfluencers");
            } else if (getSessionStorageData("influencerData")) {
              window.location.assign("/selectinfluencers");
              removeSessionStorageData("influencerData");
            } else if (res.data.first_time === 1) {
              window.location.assign("/selectinfluencers");
            } else {
              window.location.assign("/dashboard");
            }
          });
        } else if (res.data.status === 0) {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      dispatch(handleLoading(true));
      GoogleSigninService(codeResponse.access_token)
        .then((data) => {
          if (data && data.email) {
            let resultVal = {
              signin_type: 5,
              first_name: data.name,
              display_name: data.name,
              email_id: data.email,
            };
            HandleSignup(resultVal);
          }
        })
        .catch(() => {
          dispatch(handleLoading(false));
        });
    },
    enable_serial_consent: true,
    flow: "implicit",
  });

  return (
    <>
      <div className={classes.dividerSec}>
        <p className={classes.divider}></p>
        <p>Or</p>
        <p className={classes.divider}></p>
      </div>
      <Row className="my-2 g-2">
        <Col sm={6}>
          <button
            className={classes.altSignBtn}
            onClick={() => {
              login();
              // Makes sure the page reloads. Changes are only visible after you refresh.
            }}
          >
            <img src={GoogleIcon} alt={`${type} with Google`} /> {type} with
            Google
          </button>
          {/* </LoginSocialGoogle> */}
        </Col>

        <Col sm={6}>
          <LoginSocialApple
            client_id={APPLE_API_KEY}
            scope={"name email"}
            redirect_uri={SECONDARY_REDIRECT_URI}
            onResolve={({ provider, data }) => {
              var decoded = jwt_decode(data.authorization.id_token);
              if (decoded?.email && decoded?.email !== "") {
                let resultVal = {
                  signin_type: 2,
                  first_name: data?.user?.name?.firstName || decoded.email,
                  display_name: data?.user?.name?.firstName || decoded.email,
                  email_id: decoded.email,
                };
                HandleSignup(resultVal);
              } else {
                console.log(data, "");
                dispatch(handleLoading(false));
                toast.remove("Error");
                toast.error("Something Went Wrong !", {
                  id: "Error",
                });
              }
            }}
            onReject={(err) => {
              // toast.error("Something Went Wrong !!");
            }}
          >
            <button className={classes.altSignBtn}>
              <img src={AppleIcon} alt={`${type} with Apple`} /> {type} with
              Apple
            </button>
          </LoginSocialApple>
        </Col>
      </Row>
    </>
  );
};

export default SigninwithService;
