/**
 * A React component that renders the Referral page.
 * This component displays suggested accounts, a filter section, and a list of nuggets.
 * Users can filter the nuggets based on their preferences.
 * @returns The rendered Referral page component.
 */
import React, { useRef } from "react";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import SuggestedAccounts from "./SuggestedAccounts";
import classes from "./Referel.module.css";
import InviteBox from "./InviteBox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuthData, useNuggets } from "../../Shared/Reduxfetcher";
import {
  handleDashboardFilterType,
  handleNuggetFormData,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";
import { handleloginModalShow } from "../../Store/Redux/Reducer/DashboardReducer";
import { detectMob } from "../../Shared/Utility";

const Referel = () => {
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const leftContainer = useRef();
  const rightContainer = useRef();
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
    <div className={classes.fullcontainer}>
      {detectMob() && (
        <div ref={rightContainer}>
          <InviteBox />
        </div>
      )}
      <div
        className={classes.suggestSec}
        ref={leftContainer}
        style={{
          position: detectMob() ? "relative" : "sticky",
          top: detectMob()
            ? 0
            : `calc(-${leftContainer.current?.offsetHeight / 2}px + ${
                document.getElementById("banner_container")?.offsetHeight
              }px)`,
        }}
      >
        <div className={`${classes.beforelogin} mb-2`}>
          <Link
            className={DashboardfilterType === 0 ? classes.active : ""}
            onClick={() => {
              handleFilterType(0);
            }}
          >
            <span className="material-icons">home</span> For You
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
            <span className="material-icons">people</span> Following
          </Link>
        </div>
        <SuggestedAccounts />
      </div>

      <div className={classes.inviteNone}>
        <Nuggets isUserPostAvailable={false} className={classes.NuggetSec} />
      </div>
      <div
        ref={rightContainer}
        className={classes.inviteBlock}
        style={{
          position: "sticky",
          top: `calc(-${rightContainer.current?.offsetHeight / 2}px + ${
            document.getElementById("banner_container")?.offsetHeight
          }px)`,
        }}
      >
        <InviteBox />
      </div>
    </div>
  );
};

export default Referel;
