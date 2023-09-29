/**
 * A React component that represents the referral dashboard.
 * This component displays a list of referrals, a referral container, and user information.
 * It also provides the functionality to copy the referral link to the clipboard.
 * @returns The referral dashboard component.
 */
import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import ReferralsList from "./ReferralsList";
import ReferContainer from "./ReferContainer";
import Connections from "../../Connections/Friends/Connections";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { Tooltip } from "antd";
import {
  JSONtoformdata,
  decodeHtml,
  handleCopyText,
} from "../../../Shared/Utility";
import copyImg from "../../../Assets/Icons/svg/copy.svg";
import { ReferalContext } from "../../../Shared/Context";
import { GetReferralListService } from "../../../Services/ApiService";

const ReferalDashboard = () => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [isCopied, setisCopied] = useState(false);
  const [ReferalData, setReferalData] = useState(null);
  const shareUrl = userData?.referral_link || "";

  /**
   * Retrieves referral data by making a request to the GetReferralListService API.
   * The request includes a token in the request body.
   * If the request is successful and the response status is true, the referral data is set.
   * @returns None
   */
  const getReferalData = () => {
    const Data = {
      token,
    };
    GetReferralListService(JSONtoformdata(Data)).then((res) => {
      if (res.data.status) {
        setReferalData(res.data);
      }
    });
  };

  /**
   * Executes the getReferalData function once when the component is mounted.
   * @returns None
   */
  useEffect(() => {
    getReferalData();
  }, []);
  return (
    <ReferalContext.Provider
      value={{
        ReferalData,
        setReferalData,
      }}
    >
      <div className={classes.fullcontainer}>
        <div className={classes.leftFull}>
          <ReferralsList />
        </div>

        <div className={classes.dashCenter}>
          <ReferContainer />
        </div>

        <div className={classes.rightFull}>
          {userData ? (
            <div className={classes.proBox}>
              <Tooltip
                placement="top"
                title={
                  isCopied ? "Text copied to clipboard" : "Copy referral link"
                }
              >
                {isCopied ? (
                  <span
                    className={`material-symbols-rounded ${classes.copyIcon}`}
                  >
                    done
                  </span>
                ) : (
                  <img
                    onClick={() => {
                      handleCopyText(shareUrl).then(() => {
                        setisCopied(true);
                        setTimeout(() => {
                          setisCopied(false);
                        }, 3000);
                      });
                    }}
                    className={classes.copyIcon}
                    src={copyImg}
                  />
                )}
              </Tooltip>
              <img
                style={{ width: "100px", borderRadius: "50px" }}
                src={userData.profile_image}
              />

              <Tooltip placement="bottom" title={decodeHtml(userData.name)}>
                <p onClick={() => {}} className={classes.name}>
                  {decodeHtml(userData.name)?.length > 20
                    ? `${decodeHtml(userData.name)?.slice(0, 17)}...`
                    : decodeHtml(userData.name)}
                </p>
              </Tooltip>
              <p className={classes.email}>{userData.email_id}</p>
              {/* <div className={classes.userBlockRight}>
                    <Tooltip title="Events">
                      <div className={classes.eventBtn}>
                        <i className="material-icons">local_activity</i>
                        <span>{userData.event_count}</span>
                      </div>
                    </Tooltip>

                    <Tooltip title="Nuggets">
                      <div className={classes.nuggetBtn}>
                        <i className="material-icons">chat_bubble</i>
                        <span>{userData.nugget_count}</span>
                      </div>
                    </Tooltip>

                    <Tooltip title="Fans">
                      <div className={classes.followersBtn}>
                        <i className="material-icons">auto_awesome</i>
                        <span>{userData.followers_count}</span>
                      </div>
                    </Tooltip>

                    <Tooltip title="Influencers">
                      <div className={classes.influencersBtn}>
                        <i className="material-icons">add_reaction</i>
                        <span>{0}</span>
                      </div>
                    </Tooltip>
                  </div> */}
            </div>
          ) : null}
          <Connections referral={true} maxHeight={"50vh"} />
        </div>
      </div>
    </ReferalContext.Provider>
  );
};

export default ReferalDashboard;
