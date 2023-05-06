import React, { useEffect, useState } from "react";
import { LoginSocialApple, LoginSocialGoogle } from "reactjs-social-login";
import GoogleIcon from "../../Assets/Icons/png/google_logo.png";
import AppleIcon from "../../Assets/Icons/png/apple_logo.png";
import {
  APPLE_API_KEY,
  GOOGLE_CLIENT_ID,
  PRIMARY_REDIRECT_URI,
  SECONDARY_REDIRECT_URI,
} from "../../Shared/Constant";
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
import { useNavigate } from "react-router";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import classes from "./Signup.module.css";
import { toast } from "react-hot-toast";
import { fetchuserInfobyToken } from "../../Store/Redux/Action";

const SigninwithService = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [LocationValue, setLocationValue] = useState({
    geo_location: "",
    latitude: "",
    longitude: "",
  });

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
            if (getSessionStorageData("influencerData")) {
              navigate("/selectinfluencers");
              removeSessionStorageData("influencerData");
            } else if (res.data.first_time === 1) {
              navigate("/selectinfluencers");
            } else {
              navigate("/dashboard");
            }
            window.location.reload();
          });
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };
  return (
    <>
      <div className={classes.dividerSec}>
        <p className={classes.divider}></p>
        <p>Or</p>
        <p className={classes.divider}></p>
      </div>
      <Row className="my-2 g-2">
        <Col sm={6}>
          <LoginSocialGoogle
            client_id={GOOGLE_CLIENT_ID}
            redirect_uri={PRIMARY_REDIRECT_URI}
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            onResolve={({ provider, data }) => {
              let resultVal = {
                signin_type: 5,
                first_name: data.name,
                display_name: data.name,
                email_id: data.email,
              };
              HandleSignup(resultVal);
              dispatch(handleLoading(true));
            }}
            onReject={(err) => {
              console.log(err);
            }}
          >
            <button
              className={classes.altSignBtn}
              onClick={() => {
                // Makes sure the page reloads. Changes are only visible after you refresh.
              }}
            >
              <img src={GoogleIcon} /> {type} with Google
            </button>
          </LoginSocialGoogle>
        </Col>

        <Col sm={6}>
          {/* <AppleLogin
                    clientId={APPLE_API_KEY}
                    redirectURI={PRIMARY_REDIRECT_URI}
                    scope={"name email"}
                    responseMode="form_post"
                    render={({ onClick }) => {
                      return (
                        <button
                          className={classes.altSignBtn}
                          onClick={onClick}
                        >
                          <img src={AppleIcon} /> Signup with Apple
                        </button>
                      );
                    }}
                    callback={(value) => {
                      console.log(value, "==>value");
                    }}
                  /> */}
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
                toast.error("Something Went Wrong !!");
              }
            }}
            onReject={(err) => {
              console.log(err);
              // toast.error("Something Went Wrong !!");
            }}
          >
            <button className={classes.altSignBtn}>
              <img src={AppleIcon} /> {type} with Apple
            </button>
          </LoginSocialApple>
        </Col>
      </Row>
    </>
  );
};

export default SigninwithService;
