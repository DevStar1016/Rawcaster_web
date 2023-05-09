import React, { useEffect, useState } from "react";
import classes from "./Notification.module.css";
import { useNotificationContext } from "../../Shared/Context";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { NotificationsList } from "./Utility";
import {
  DeleteNotificationService,
  ViewNotificationService,
} from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";

const Content = ({ elem }) => {
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const { getNotificationList, handleViewNotification, markallAsRead } =
    useNotificationContext();
  const [NoResultMsg, setNoResultMsg] = useState("");
  const [Pages, setPages] = useState({
    Page: 0,
    totalPages: 0,
  });
  const [NotificationList, setNotificationList] = useState({
    today: [],
    yesterday: [],
    older: [],
  });

  const getFansData = (page = 1) => {
    if (userSettings && token) {
      let formData = {
        page_number: page,
        notification_type: elem.id,
      };
      getNotificationList(formData).then((res) => {
        const { today, yesterday, older, total_pages, current_page_no, msg } =
          res;
        setNoResultMsg(msg);
        if (current_page_no === 1) {
          setNotificationList({ today, yesterday, older });
        } else if (current_page_no !== 0) {
          if (today.length !== 0) {
            setNotificationList((pre) => ({
              ...pre,
              today: [...pre.today, ...today],
            }));
          }
          if (yesterday.length !== 0) {
            setNotificationList((pre) => ({
              ...pre,
              yesterday: [...pre.yesterday, ...yesterday],
            }));
          }
          if (older.length !== 0) {
            setNotificationList((pre) => ({
              ...pre,
              older: [...pre.older, ...older],
            }));
          }
        }
        setPages({
          Page: current_page_no,
          totalPages: total_pages,
        });
      });
    }
  };
  useEffect(() => {
    getFansData(1);
  }, [userSettings, markallAsRead, token]);

  const handleDeleteNotification = (notification_id) => {
    const DeleteData = {
      token,
      notification_id,
    };
    DeleteNotificationService(JSONtoformdata(DeleteData))
      .then(({ data }) => {
        if (data.status === 1) {
          setNotificationList((pre) => ({
            older: pre.older.filter(
              (ele) => ele.notification_id !== notification_id
            ),
            yesterday: pre.yesterday.filter(
              (ele) => ele.notification_id !== notification_id
            ),
            today: pre.today.filter(
              (ele) => ele.notification_id !== notification_id
            ),
          }));
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {});
  };

  const viewUpdate = (array, id) => {
    let findIndex = array.findIndex((ele) => ele.notification_id === id);
    if (findIndex !== -1) {
      let tempArray = [...array];
      tempArray[findIndex].is_read = 1;
      return tempArray;
    } else {
      return array;
    }
  };

  const ViewNotification = (notification_id, mark_all_as_read = null) => {
    handleViewNotification(notification_id, mark_all_as_read).then(() => {
      setNotificationList((pre) => ({
        older: viewUpdate(pre.older, notification_id),
        yesterday: viewUpdate(pre.yesterday, notification_id),
        today: viewUpdate(pre.today, notification_id),
      }));
    });
  };

  return (
    <div className={classes.listSec}>
      {Pages.totalPages === 0 && (
        <div className={classes.noResultSec}>
          <p>{NoResultMsg}</p>
        </div>
      )}
      {NotificationList.today.length !== 0 && (
        <>
          <h3>Today</h3>
          {NotificationList.today.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                let filteredList = NotificationList.filter(
                  (ele) => ele.notification_id !== id
                );
                setNotificationList(filteredList);
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      {NotificationList.yesterday.length !== 0 && (
        <>
          <h3>Yesterday</h3>
          {NotificationList.yesterday.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                let filteredList = NotificationList.filter(
                  (ele) => ele.notification_id !== id
                );
                setNotificationList(filteredList);
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      {NotificationList.older.length !== 0 && (
        <>
          <h3>Older</h3>
          {NotificationList.older.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                let filteredList = NotificationList.filter(
                  (ele) => ele.notification_id !== id
                );
                setNotificationList(filteredList);
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      <div
        className={classes.seemoreSec}
        style={{
          display: Pages.Page < Pages.totalPages ? "" : "none",
        }}
        onClick={() => {
          getFansData(Pages.Page + 1);
        }}
      >
        Load More <span class="material-icons">arrow_forward</span>
      </div>
    </div>
  );
};

export default Content;
