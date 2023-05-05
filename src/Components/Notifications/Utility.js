import moment from "moment";
import profileImg from "../../Assets/Images/svg/profile_img.svg";
import classes from "./Notification.module.css";
import { utctoUserTimezone } from "../../Shared/Utility";
import { useAuth } from "../../Shared/Reduxfetcher";

export const getUserTimeZone = (date, format, userSettings) => {
  if (format) {
    const createdTime = utctoUserTimezone(date, userSettings.time_zone);
    return createdTime;
  } else {
    const createdTime = utctoUserTimezone(
      moment(date).format("YYYY-MM-DD HH:mm:ss"),
      userSettings.time_zone
    );
    return createdTime;
  }
};

export const FansList = (ele) => {
  const { userSettings } = useAuth();
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={profileImg} />
        <div>
          <p>Godfrey Gad</p>
          <span>Posted a new event</span>
        </div>
      </div>
      <div className={classes.rightsec}>15 min ago</div>
    </div>
  );
};

export const GroupsList = (ele) => {
  const { userSettings } = useAuth();
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={profileImg} />
        <div>
          <p>Godfrey Gad</p>
          <span>Posted a new event</span>
        </div>
      </div>
      <div className={classes.rightsec}>15 min ago</div>
    </div>
  );
};

export const ConnectionList = (ele) => {
  const { userSettings } = useAuth();
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={profileImg} />
        <div>
          <p>Godfrey Gad</p>
          <span>Posted a new event</span>
        </div>
      </div>
      <div className={classes.rightsec}>15 min ago</div>
    </div>
  );
};
export const EventsList = ({ ele }) => {
  const { userSettings } = useAuth();
  const createdTime = getUserTimeZone(
    ele?.created_datetime,
    null,
    userSettings
  );
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={ele?.userImage} />
        <div>
          <p>{ele?.userName}</p>
          <span>Posted a new event</span>
        </div>
      </div>
      <div className={classes.rightsec}>{moment(createdTime).fromNow()}</div>
    </div>
  );
};
export const NuggetsList = ({ ele }) => {
  const { userSettings } = useAuth();
  const createdTime = getUserTimeZone(
    ele?.created_datetime,
    null,
    userSettings
  );
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={ele?.userImage} />
        <div>
          <p>{ele?.userName}</p>
          <span>Posted a Nugget</span>
        </div>
      </div>
      <div className={classes.rightsec}>{moment(createdTime).fromNow()}</div>
    </div>
  );
};

export const PollResultsList = (ele) => {
  return (
    <div className={classes.fansList}>
      <div className={classes.leftsec}>
        <img src={profileImg} />
        <div>
          <p>Godfrey Gad</p>
          <span>Posted a new event</span>
        </div>
      </div>
      <div className={classes.rightsec}>15 min ago</div>
    </div>
  );
};

export const NotificationsList = ({ id, ele, userSettings }) => {
  switch (parseInt(id)) {
    case 1:
      return <NuggetsList ele={ele} />;
    case 2:
      return <EventsList ele={ele} />;
    case 3:
      return <ConnectionList ele={ele} />;
    case 4:
      return <GroupsList ele={ele} />;
    case 5:
      return <FansList ele={ele} />;
    case 6:
      return <PollResultsList ele={ele} />;
    default:
      break;
  }
};
