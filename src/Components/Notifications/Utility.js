import moment from "moment";
import profileImg from "../../Assets/Images/svg/profile_img.svg";
import classes from "./Notification.module.css";
import {
  EncryptionString,
  JSONtoformdata,
  decodeHtml,
  utctoUserTimezone,
  utctoUserTimezonewithAbbr,
} from "../../Shared/Utility";
import { useAuth, useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import MultiplePoll from "../../UIComponents/MultiplePoll/MultiplePoll";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { toast } from "react-hot-toast";
import { sendMessage } from "../../Services/SocketService";
import { respondToFriendRequestsService } from "../../Services/ApiService";
import { useNavigate } from "react-router";

const HomePageIds = [2, 4];
const UserPageIds = [5, 3];
const NuggetPageIds = [1, 6];

export const getNotificationMessage = (type) => {
  switch (parseInt(type)) {
    case 1:
      return "Posted a new Nugget";
    case 2:
      return "Edited the Nugget";
    case 3:
      return "Commented on your Nugget";
    case 4:
      return "Replied on your comment";
    case 5:
      return "Agreed your Nugget";
    case 6:
      return "Agreed your Comment";
    case 7:
      return "Agreed your reply";
    case 8:
      return "Shared your Nugget";
    case 9:
      return "Posted a new Event";
    case 10:
      return "Updated the Event";
    case 11:
      return "Sent a connection request";
    case 12:
      return "Accepted your connection request";
    case 13:
      return "Posted a talkshow";
    case 14:
      return "Live now";
    case 16:
      return "Poll Results";
    default:
      return "";
  }
};

export const getUserTimeZone = (date, format, userSettings) => {
  if (format) {
    const createdTime = utctoUserTimezone(date, userSettings?.time_zone);
    return createdTime;
  } else {
    const createdTime = utctoUserTimezone(
      moment(date).format("YYYY-MM-DD HH:mm:ss"),
      userSettings?.time_zone
    );
    return createdTime;
  }
};

export const NotificationsList = ({
  ele,
  type,
  handleUpdate,
  handleDelete,
  handleView,
}) => {
  const token = useAuthToken();
  const navigate = useNavigate();
  const profileData = useAuthData();
  const { userSettings } = useAuth();
  const createdTime = getUserTimeZone(
    ele?.created_datetime,
    null,
    userSettings
  );

  const handleRequest = (formData) => {
    let respondData = {
      token: token,
      ...formData,
    };
    respondToFriendRequestsService(JSONtoformdata(respondData))
      .then((res) => {
        if (res.data.status === 1) {
          if (formData.action === 1) {
            let data = {
              friend_request_id: ele.friend_request_id,
              user_id: profileData.user_id,
              email_id: profileData.email_id,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              display_name: profileData.name,
              gender: profileData.gender,
              profile_img: profileData.profile_image,
              online: 1,
              last_seen: "",
              typing: 0,
              unreadmsg: 0,
              login_from_app: 0,
              login_from_web: 1,
              login_from: 1,
            };
            const socketMes = {
              event: "friendresponse",
              receiverId: parseInt(ele.user_id),
              data: data,
            };
            sendMessage(socketMes, "message");
            toast.success(
              `You and ${decodeHtml(
                res.data.friend_details.display_name
              )} connected`
            );
          } else {
            toast.success(`Sucessfully rejected`);
          }
          handleUpdate(ele.notification_id);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  return (
    <div
      className={`${classes.fansContainer} ${
        ele?.is_read === 0 && classes.unreadContainer
      }`}
    >
      <div className={classes.fansList}>
        <div
          className={`${classes.leftsec}`}
          onClick={() => {
            handleView(ele);
            if (NuggetPageIds.includes(parseInt(type))) {
              navigate(`/view/${EncryptionString(ele.nugget_id)}`);
            } else if (UserPageIds.includes(parseInt(type))) {
              navigate(`/viewprofile/${EncryptionString(ele.user_id)}`);
            } else if (HomePageIds.includes(parseInt(type))) {
              navigate(`/dashboard`);
            }
          }}
        >
          <img
            src={ele?.userImage ? ele?.userImage : ""}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultprofileImg;
            }}
          />
          <div>
            <p className={classes.userName}>{ele?.userName}</p>
            <span>{getNotificationMessage(ele?.type)}</span>
            <p className={classes.headingContent}>{ele?.content}</p>
            {ele.event_start_time && (
              <div className={classes.iconsec}>
                <i class="material-symbols-outlined">calendar_today</i>{" "}
                {moment(
                  utctoUserTimezone(
                    ele.event_start_time,
                    userSettings?.time_zone
                  )
                ).format("DD MMM YYYY")}
                <i class="material-symbols-outlined">schedule</i>{" "}
                {moment(
                  utctoUserTimezone(
                    ele.event_start_time,
                    userSettings?.time_zone
                  )
                ).format("hh:mm A") +
                  " - (" +
                  utctoUserTimezonewithAbbr(
                    ele.event_start_time,
                    userSettings?.time_zone
                  ) +
                  ")"}
              </div>
            )}
          </div>
        </div>
        <div className="flex-column">
          <div className={classes.rightsec}>
            <p className={classes.timeAgo}>{moment(createdTime).fromNow()}</p>
            <span
              class="material-symbols-outlined"
              style={{ display: ele.poll_option ? "none" : "" }}
              onClick={() => {
                handleDelete(ele);
              }}
            >
              close
            </span>
          </div>
          <div
            className="mt-1"
            style={{
              display:
                ele.type === 1 && ele?.friend_request_status === 0
                  ? "block"
                  : "none",
            }}
          >
            <div
              className={classes.greenicon}
              onClick={() => {
                let sendData = {
                  friend_request_id: ele.friend_request_id,

                  response: 1,
                };
                handleRequest(sendData);
              }}
            >
              <i class="material-symbols-outlined">done</i>
            </div>
            <div
              className={classes.redicon}
              onClick={() => {
                let sendData = {
                  friend_request_id: ele.friend_request_id,

                  response: 2,
                };
                handleRequest(sendData);
              }}
            >
              <i class="material-symbols-outlined">close</i>
            </div>
          </div>
        </div>
      </div>

      {ele && ele.poll_option && (
        <MultiplePoll
          nugget_id={ele.nugget_id}
          results={ele.poll_option}
          TotalVotes={ele?.total_vote}
          isVoted
          created_date={ele.created_datetime}
          VoteTiming={"0:0:0"}
        />
      )}
    </div>
  );
};
