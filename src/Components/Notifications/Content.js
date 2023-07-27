import React, { useEffect, useRef, useState } from "react";
import classes from "./Notification.module.css";
import { useNotificationContext } from "../../Shared/Context";
import {
  useAuth,
  useAuthToken,
  useNotification,
} from "../../Shared/Reduxfetcher";
import { NotificationsList } from "./Utility";
import { DeleteNotificationService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { Empty, Skeleton } from "antd";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { fetchNotificationList } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import {
  handleUpdateNotification,
  handleViewUpdateNotification,
} from "../../Store/Redux/Reducer/NotificationsReducer";

const Content = ({ elem }) => {
  const { Notifications, isLoading, isTabChange } = useNotification();
  const containerRef = useRef();
  const dispatch = useDispatch();
  const [isReachedEnd, setisReachedEnd] = useState(false);
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const { handleViewNotification } = useNotificationContext();

  const getFansData = (page = 1) => {
    if (userSettings && token) {
      let formData = {
        page_number: page,
        notification_type: elem.id,
      };
      dispatch(fetchNotificationList({ token, ...formData }));
    }
  };

  const handleDeleteNotification = (notification_id) => {
    const DeleteData = {
      token,
      notification_id,
    };
    DeleteNotificationService(JSONtoformdata(DeleteData))
      .then(({ data }) => {
        if (data.status === 1) {
          dispatch(handleUpdateNotification(notification_id));
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {});
  };

  const ViewNotification = (notification_id, mark_all_as_read = null) => {
    handleViewNotification(notification_id, mark_all_as_read).then(() => {
      dispatch(handleViewUpdateNotification(notification_id));
    });
  };

  const loadMore = () => {
    if (!getHasNextPage()) {
      setisReachedEnd(false);
    } else if (isReachedEnd && getHasNextPage() && !isLoading) {
      getFansData(Notifications.current_page_no + 1);
    }
  };

  const getHasNextPage = () => {
    return (
      Notifications.total_pages &&
      Notifications.current_page_no < Notifications.total_pages
    );
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setisReachedEnd(true);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
      if (containerRef.current) {
        containerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      Notifications?.total_pages > Notifications.current_page_no &&
      Notifications?.older?.length +
        Notifications.today.length +
        Notifications.yesterday.length <
        9
    ) {
      getFansData(Notifications.current_page_no);
    }
  }, [Notifications]);

  return (
    <div className={classes.listSec} ref={containerRef}>
      {!isTabChange &&
        !isLoading &&
        Notifications?.older?.length +
          Notifications.today.length +
          Notifications.yesterday.length ===
          0 && (
          <div className={classes.noResultSec}>
            <Empty description="No Notifications" />
          </div>
        )}
      {!isTabChange && Notifications.today.length !== 0 && (
        <>
          <h3>Today</h3>
          {Notifications.today.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                dispatch(handleUpdateNotification(id));
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
                dispatch(handleUpdateNotification(ele.notification_id));
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      {!isTabChange && Notifications.yesterday.length !== 0 && (
        <>
          <h3>Yesterday</h3>
          {Notifications.yesterday.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                dispatch(handleUpdateNotification(id));
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
                dispatch(handleUpdateNotification(ele.notification_id));
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      {!isTabChange && Notifications.older.length !== 0 && (
        <>
          <h3>Older</h3>
          {Notifications.older.map((ele) => (
            <NotificationsList
              ele={ele}
              type={elem.id}
              handleUpdate={(id) => {
                dispatch(handleUpdateNotification(id));
              }}
              handleDelete={(ele) => {
                handleDeleteNotification(ele.notification_id);
                dispatch(handleUpdateNotification(ele.notification_id));
              }}
              handleView={(ele) => {
                ViewNotification(ele.notification_id);
              }}
            />
          ))}
        </>
      )}
      {isLoading || getHasNextPage() || isTabChange ? (
        <div className="text-center py-2" ref={sentryRef}>
          <Skeleton active />
        </div>
      ) : null}
    </div>
  );
};

export default Content;
