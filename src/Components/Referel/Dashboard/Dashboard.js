import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import ReferralsList from "./ReferralsList";
import ReferContainer from "./ReferContainer";
import Connections from "../../Connections/Friends/Connections";
import { Col, Row } from "react-bootstrap";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { Tooltip } from "antd";
import {
  JSONtoformdata,
  decodeHtml,
  handleCopyText,
} from "../../../Shared/Utility";
import copyImg from "../../../Assets/Icons/svg/copy.svg";
import { toast } from "react-hot-toast";
import { ReferalContext } from "../../../Shared/Context";
import { GetReferralListService } from "../../../Services/ApiService";

const ReferalDashboard = () => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [isCopied, setisCopied] = useState(false);
  const [ReferalData, setReferalData] = useState(null);

  const shareUrl = userData?.referral_link || "";

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
                <p
                  onClick={() => {
                    console.log(
                      decodeHtml(userData.name)?.length,
                      "decodeHtml(userData.name)"
                    );
                  }}
                  className={classes.name}
                >
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
