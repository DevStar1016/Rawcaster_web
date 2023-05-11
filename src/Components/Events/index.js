import React from "react";
import { useAuth, useNuggets } from "../../Shared/Reduxfetcher";
import Eventslisting from "./Eventslisting";
import classes from "./Events.module.css";
import BeforeAuthEvents from "./BeforeAuthEvents";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import {
  handleDashboardFilterType,
  handleNuggetFormData,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import { handleloginModalShow } from "../../Store/Redux/Reducer/DashboardReducer";

const Events = () => {
  const dispatch = useDispatch();
  const { isSuccess, loginUserData } = useAuth();
  const { DashboardfilterType, nuggetFormData } = useNuggets();

  const handleFilterType = (type) => {
    let filterData = { ...nuggetFormData };

    filterData.formData = {
      page_number: 1,
      nugget_type: 0,
      filter_type: type,
    };
    dispatch(handleResetNuggets());
    dispatch(handleDashboardFilterType(type));
    dispatch(handleNuggetFormData(filterData));
    dispatch(fetchNuggetsbyId(filterData));
  };
  return (
    <div className={classes.eventSec}>
      <div className={`${classes.beforelogin} mb-3`}>
        <Link
          className={DashboardfilterType === 0 ? classes.active : ""}
          onClick={() => {
            handleFilterType(0);
          }}
        >
          <span class="material-icons">home</span> For You
        </Link>
        <Link
          className={DashboardfilterType === 1 ? classes.active : ""}
          onClick={() => {
            if (loginUserData) {
              handleFilterType(1);
            } else {
              dispatch(handleloginModalShow(true));
            }
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
