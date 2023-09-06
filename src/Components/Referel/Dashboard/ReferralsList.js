/**
 * A React component that displays a list of referrals.
 * @returns JSX element
 */
import React, { useState } from "react";
import classes from "./Dashboard.module.css";
import { decodeHtml } from "../../../Shared/Utility";
import moment from "moment";
import { Empty } from "antd";
import { useReferalContext } from "../../../Shared/Context";

const ReferralsList = () => {
  const { ReferalData } = useReferalContext();
  return (
    <div className={classes.refSec}>
      <h1>Referals List</h1>
      {ReferalData?.referral_list === undefined && (
        <Empty
          className={classes.emptyRefmsg}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No referals found!!"
        />
      )}
      {ReferalData?.referral_list?.map((ele, ind) => (
        <div key={ind} className={classes.list}>
          <img
            className={classes.topicon}
            src={
              ele.account_verified
                ? require("../../../Assets/Icons/png/circle-check.png")
                : require("../../../Assets/Icons/png/circle-pending.png")
            }
          />
          <img src={ele.profile_img} />
          <p className={classes.name}>{decodeHtml(ele.display_name)}</p>
          <div className={classes.clearfix}></div>
          <p className={classes.mail}>{ele.email_id}</p>
          {ele.invited_date && ele.invited_date !== "" && (
            <p className={classes.date}>
              <span>Invited Date</span>
              <br />
              {moment(ele.invited_date, "YYYY-MM_DD HH:mm:ss").format(
                "D MMM YYYY"
              )}
            </p>
          )}
          <p className={classes.date}>
            <span>Signed up</span>
            <br />
            {moment(ele.signedup_date, "YYYY-MM_DD HH:mm:ss").format(
              "D MMM YYYY"
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReferralsList;
