/**
 * A React component that renders the content of a notification.
 * @param {Object} elem - The notification object.
 * @returns The rendered content of the notification.
 */
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
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const { handleViewNotification } = useNotificationContext();
  const isFetching = useRef(false);
  const isEndReached = useRef(false);

  /**
   * Retrieves fans data from the server.
   * @param {number} [page=1] - The page number to retrieve.
   * @returns None
   */
  const getFansData = (page = 1) => {
    if (userSettings && token) {
      isFetching.current = true;
      let formData = {
        page_number: page,
        notification_type: elem.id,
      };
      dispatch(fetchNotificationList({ token, ...formData })).finally(() => {
        isFetching.current = false;
      });

      //   .then((res) => {
      //     isFetching.current = null;
      //   })
      //   .finally(() => {
      //     isFetching.current = null;
      //   });
    }
  };

  /**
   * Handles the deletion of a notification.
   * @param {number} notification_id - The ID of the notification to delete.
   * @returns None
   */
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
          toast.remove("rawcaster");
          toast.error(data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * View a notification and update its status as read.
   * @param {number} notification_id - The ID of the notification to view.
   * @param {boolean} [mark_all_as_read=null] - Optional parameter to mark all notifications as read.
   * @returns None
   */
  const ViewNotification = (notification_id, mark_all_as_read = null) => {
    handleViewNotification(notification_id, mark_all_as_read).then(() => {
      dispatch(handleViewUpdateNotification(notification_id));
    });
  };

  /**
   * Loads more data if there is a next page available and the end has not been reached.
   * @returns None
   */
  const loadMore = () => {
    if (!getHasNextPage()) {
      isEndReached.current = false;
    } else if (isEndReached.current && getHasNextPage() && !isLoading) {
      getFansData(Notifications.current_page_no + 1);
    }
  };

  /**
   * Checks if there is a next page available in the notifications.
   * @returns {boolean} - True if there is a next page, false otherwise.
   */
  const getHasNextPage = () => {
    return (
      Notifications.total_pages &&
      Notifications.current_page_no < Notifications.total_pages &&
      !isFetching.current
    );
  };

  /**
   * Uses the `useInfiniteScroll` hook to implement infinite scrolling functionality.
   * @param {boolean} isLoading - Indicates whether the data is currently being loaded.
   * @param {function} getHasNextPage - A function that returns a boolean indicating whether there are more pages to load.
   * @param {function} loadMore - A function that is called when more data needs to be loaded.
   * @returns A reference to the `sentryRef` element.
   */
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
        isEndReached.current = true;
      }
    }
  };

  /**
   * Adds a scroll event listener to the container element and removes it when the component is unmounted.
   * @returns None
   */
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

  /**
   * Executes a side effect when the value of the Notifications object changes.
   * If there are more pages of notifications to fetch and the total number of notifications
   * from older, today, and yesterday is less than 9, it calls the getFansData function
   * to fetch more data.
   * @param {function} getFansData - The function to fetch more data.
   * @param {object} Notifications - The Notifications object containing the current page number,
   * total pages, and arrays of older, today, and yesterday notifications.
   * @returns None
   */
  useEffect(() => {
    if (
      Notifications?.total_pages > Notifications.current_page_no &&
      Notifications?.older?.length +
        Notifications.today.length +
        Notifications.yesterday.length <
        9
    ) {
      // getFansData(Notifications.current_page_no);
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
          {Notifications.today.map((ele, index) => (
            <NotificationsList
              key={index}
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
          {Notifications.yesterday.map((ele, index) => (
            <NotificationsList
              key={index}
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
          {Notifications.older.map((ele, index) => (
            <NotificationsList
              key={index}
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
