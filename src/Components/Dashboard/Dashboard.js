/**
 * A React component that represents the dashboard page.
 * @returns The rendered dashboard page.
 */
import React, { useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  handleNuggetList,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import Notification from "../Notifications";
import * as rdd from "react-device-detect";
import { useWindowWidth } from "../../Shared/Utility";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { debounce } from "lodash";

const Dashboard = () => {
  const loginUserData = useAuthData();
  const { isSuccess } = useAuth();
  const loginToken = useAuthToken();
  const { pathname, state } = useLocation();
  const { dashboardMenu } = useDashboard();
  const { nuggetFormData } = useNuggets();
  const dispatch = useDispatch();
  const WINDOW_WIDTH = useWindowWidth();
  /**
   * Executes a side effect when the value of `pathname` changes.
   * If `loginToken` is `null`, removes the "influencerData" from session storage.
   * Creates a copy of `nuggetFormData` and checks if any of its properties (`search_key`, `user_id`, `saved`)
   * are truthy. If so, updates `filterData.formData` with `page_number` set to 1 and `nugget_type` set to 0.
   * Dispatches `handleResetNuggets` action to reset the nuggets state.
   * Dispatches `handleNuggetFormData` action to update the nugget form data with `filterData`.
   * Dispatches `fetchNuggets
   */
  useEffect(() => {
    if (loginToken === null) {
      removeSessionStorageData("influencerData");
    }
    let filterData = { ...nuggetFormData };
    if (
      filterData?.formData?.search_key ||
      filterData?.formData?.user_id ||
      filterData?.formData?.saved
    ) {
      getDashboardDetails(filterData);
    }
  }, [pathname]);

  useEffect(() => {
    let filterData = { ...nuggetFormData };
    if (state?.isLogoPress) {
      handleDashboardApi(filterData);
    }
  }, [state?.isLogoPress]);

  useEffect(() => {
    return () => {
      dispatch(handleNuggetList([]));
    };
  }, []);

  const getDashboardDetails = (filterData) => {
    filterData.token = loginToken;
    filterData.formData = {
      filter_type: filterData?.formData?.filter_type ?? 0,
      page_number: 1,
      nugget_type: 0,
    };
    dispatch(handleResetNuggets());
    dispatch(handleNuggetFormData(filterData));
    dispatch(fetchNuggetsbyId(filterData));
  };

  const handleDashboardApi = useCallback(
    debounce(getDashboardDetails, 500),
    []
  );

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
            Login/Signup to explore Rawcaster features{" "}
            <span className="material-icons">arrow_forward</span>
          </Link>
        </div>
      )}

      <rdd.CustomView condition={WINDOW_WIDTH >= 1100}>
        <div className={classes.fullcontainer}>
          <Events />
          <Nuggets />
          <GoogleOAuthProvider
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          >
            <DashboardSignup />
          </GoogleOAuthProvider>
        </div>
      </rdd.CustomView>

      <rdd.CustomView condition={WINDOW_WIDTH <= 1100}>
        <div className={classes.fullcontainer}>
          {dashboardMenu === "event" && <Events />}
          {dashboardMenu === "notification" && (
            <Notification onReadCountChange={() => {}} />
          )}
          {dashboardMenu === "nugget" && <Nuggets />}
          {dashboardMenu === "usermenu" && (
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            >
              <DashboardSignup />
            </GoogleOAuthProvider>
          )}
        </div>
      </rdd.CustomView>
    </div>
  );
};

export default Dashboard;
