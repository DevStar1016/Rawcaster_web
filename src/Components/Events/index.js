import React from "react";
import { useAuth, useAuthData, useDashboard } from "../../Shared/Reduxfetcher";
import Eventslisting from "./Eventslisting";
import classes from "./Events.module.css";
import BeforeAuthEvents from "./BeforeAuthEvents";
import { handleDashboardFilterType } from "../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Events = () => {
  const dispatch = useDispatch();
  const { isSuccess, loginUserData } = useAuth();
  const { DashboardfilterType } = useDashboard();
  return (
    <div className={classes.eventSec}>
      <div className={`${classes.beforelogin} mb-3`}>
        <Link
          className={DashboardfilterType === 0 ? classes.active : ""}
          onClick={() => {
            dispatch(handleDashboardFilterType(0));
          }}
        >
          <span class="material-icons">home</span> For You
        </Link>
        <Link
          className={DashboardfilterType === 1 ? classes.active : ""}
          onClick={() => {
            dispatch(handleDashboardFilterType(1));
          }}
        >
          <span class="material-icons">people</span> Following
        </Link>
      </div>
      {/* BEFORE LOGIN START */}
      {loginUserData === null && isSuccess ? (
        <BeforeAuthEvents />
      ) : (
        <Eventslisting />
      )}
    </div>
  );
};

export default Events;
