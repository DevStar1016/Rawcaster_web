import React from "react";
import classes from "./Membership.module.css";
import valuedMember from "../../Assets/Images/svg/valuedMember.svg";
import premiumMember from "../../Assets/Images/svg/premiumMember.png";
import diamondMember from "../../Assets/Images/svg/diamondMember.png";
import { Link } from "react-router-dom";

const Membership = () => {
  return (
    <div className={`mainWrapper ${classes.memberSec}`}>
      <h1>Plans & Pricing</h1>
      <h2>
        Whether your time-saving automation needs are large or small, we're here
        to help you scale.
      </h2>

      <div className="row">
        <div className="col-md-4">
          <div className={classes.packageSec}>
            <div className={classes.top}>
              <div className={classes.leftText}>
                <h5>Valued Member</h5>
                <h3>Free</h3>
                <p>Annually</p>
              </div>
              <img src={valuedMember} alt="valued_member_logo" />
            </div>

            <ul>
              <li>Full access to Nuggets features</li>
              <li>Full access to One-on-One chat enabled.</li>
              <li>Full access to one-on-one Video and audio call</li>
              <li>Host up to 15 participants for up to 2hrs.</li>
              <li>Record events on PC</li>
            </ul>

            <Link className={classes.upgradeBtn}>Current Plan</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className={classes.packageSec}>
            <div className={classes.top}>
              <div className={classes.leftText}>
                <h5>Premium</h5>
                <h3>$30</h3>
                <p>Annually</p>
              </div>
              <img src={premiumMember} alt="premium_member_logo" />
            </div>

            <ul>
              <li>Full access to Nuggets features</li>
              <li>Full access to chat features</li>
              <li>Full access to Events features</li>
              <li>Host up to 25 participants.</li>
              <li>Up to 4hrs meeting time per event.</li>
              <li>All event features enabled</li>
              <li>Record events on the cloud</li>
              <li>Talk-show events with interaction with audience</li>
              <li>Full access to Rawcaster video and audio call</li>
              <li>Talk-show program without co-hosts</li>
            </ul>

            <Link className={classes.upgradeBtn}>Upgrade Plan</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className={classes.packageSec}>
            <div className={classes.top}>
              <div className={classes.leftText}>
                <h5>Diamond</h5>
                <h3>$79.99</h3>
                <p>Annually</p>
              </div>
              <img src={diamondMember} alt="diamond_member_logo" />
            </div>

            <ul>
              <li>Full access to Nuggets features</li>
              <li>Full access to One-on-One chat enabled.</li>
              <li>Full access to one-on-one Video and audio call</li>
              <li>Host up to 150 participants in a meeting event.</li>
              <li>Unlimited meeting time per event.</li>
              <li>Talk-Show program with up to 3 co-hosts</li>
              <li>Full use of Rawcaster Live Events</li>
              <li>Record events on the cloud</li>
              <li>Talk-show events with interaction with audience</li>
              <li>Full access to Rawcaster video and audio call</li>
            </ul>

            <Link className={classes.upgradeBtn}>Upgrade Plan</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
