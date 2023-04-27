import React from "react";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import SuggestedAccounts from "./SuggestedAccounts";
import classes from "./Referel.module.css";
import InviteBox from "./InviteBox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth, useNuggets } from "../../Shared/Reduxfetcher";
import {
  handleDashboardFilterType,
  handleNuggetFormData,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";

const Referel = () => {
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
    <div className="d-none d-sm-block">
      <div className={classes.fullcontainer}>
        <div className={classes.suggestSec}>
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
                handleFilterType(1);
              }}
            >
              <span class="material-icons">people</span> Following
            </Link>
          </div>
          <SuggestedAccounts />
        </div>

        <Nuggets isUserPostAvailable={false} />
        <InviteBox />
      </div>
    </div>
  );
};

export default Referel;
