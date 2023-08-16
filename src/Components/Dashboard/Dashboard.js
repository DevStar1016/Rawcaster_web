import React, { useEffect } from "react";
import {
  Link,
  useActionData,
  useBeforeUnload,
  useLocation,
} from "react-router-dom";
import {
  useAuth,
  useAuthData,
  useAuthToken,
  useDashboard,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import DashboardSignup from "../../Sharedcomponents/DashboardSignup";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import { removeSessionStorageData } from "../../Store/Storage";
import classes from "./Dashboard.module.css";
import Events from "../Events";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import {
  handleNuggetFormData,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import Notification from "../Notifications";
import * as rdd from "react-device-detect";
import { useWindowWidth } from "../../Shared/Utility";

const Dashboard = () => {
  const loginUserData = useAuthData();
  const { isSuccess } = useAuth();
  const loginToken = useAuthToken();
  const { pathname } = useLocation();
  const { dashboardMenu } = useDashboard();
  const { nuggetFormData } = useNuggets();
  const dispatch = useDispatch();
  const WINDOW_WIDTH = useWindowWidth();

  useEffect(() => {
    if (loginToken === null) {
      removeSessionStorageData("influencerData");
    }
    let filterData = { ...nuggetFormData };
    if (filterData?.formData?.search_key || filterData?.formData?.user_id) {
      filterData.formData = {
        page_number: 1,
        nugget_type: 0,
      };
      dispatch(handleResetNuggets());
      dispatch(handleNuggetFormData(filterData));
      // dispatch(fetchNuggetsbyId(filterData));
    }
  }, [pathname]);
  console.log(window.innerWidth);
  return (
    <div>
      {isSuccess && loginUserData === null && (
        <div className={classes.ribbon}>
          <Link
            to="/login"
            onClick={() => {
              removeSessionStorageData("influencerData");
            }}
          >
            <img
              className={classes.smlogo}
              alt="Rawcaster"
              src={require("../../Assets/Images/png/mob-rlogo.png")}
            />
            Log in/Sign up to explore Rawcaster features{" "}
            <span className="material-icons">arrow_forward</span>
          </Link>
        </div>
      )}

      <rdd.CustomView condition={WINDOW_WIDTH >= 1100}>
        <div className={classes.fullcontainer}>
          <Events />
          <Nuggets />
          <DashboardSignup />
        </div>
      </rdd.CustomView>

      <rdd.CustomView condition={WINDOW_WIDTH <= 1100}>
        <div className={classes.fullcontainer}>
          {dashboardMenu === "event" && <Events />}
          {dashboardMenu === "notification" && (
            <Notification
              onReadCountChange={() => {
                console.log("test");
              }}
            />
          )}
          {dashboardMenu === "nugget" && <Nuggets />}
          {dashboardMenu === "usermenu" && <DashboardSignup />}
        </div>
      </rdd.CustomView>
    </div>
  );
};

export default Dashboard;
