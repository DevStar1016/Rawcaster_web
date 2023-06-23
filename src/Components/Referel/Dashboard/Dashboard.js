import React from "react";
import classes from "./Dashboard.module.css";
import ReferralsList from "./ReferralsList";
import ReferContainer from "./ReferContainer";
import Connections from "../../Connections/Friends/Connections";
import { Col, Row } from "react-bootstrap";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { Tooltip } from "antd";
import { decodeHtml } from "../../../Shared/Utility";
import copyImg from "../../../Assets/Icons/svg/copy.svg";

const ReferalDashboard = () => {
  const userData = useAuthData();
  return (
    <div className={classes.fullcontainer}>
      <Row>
        <Col sm={3}>
          <div className={classes.leftFull}>
            <ReferralsList />
          </div>
        </Col>
        <Col>
          <div>
            <ReferContainer />
          </div>
        </Col>
        <Col sm={3}>
          <div>
            {userData ? (
              <div className={classes.proBox}>
                <Tooltip placement="top" title={"Copy referral link"}>
                  <img
                    onClick={() => {}}
                    className={classes.copyIcon}
                    src={copyImg}
                  />
                </Tooltip>
                <img
                  style={{ width: "100px", borderRadius: "50px" }}
                  src={userData.profile_image}
                />
                <p className={classes.name}>{decodeHtml(userData.name)}</p>
                <p className={classes.email}>{userData.email_id}</p>
                <div className={classes.userBlockRight}>
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
                </div>
              </div>
            ) : null}
            <Connections />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReferalDashboard;
