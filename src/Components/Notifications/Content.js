import React, { useEffect, useRef, useState } from "react";
import classes from "./Notification.module.css";
import { useNotificationContext } from "../../Shared/Context";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { NotificationsList } from "./Utility";
import { DeleteNotificationService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { Empty, Skeleton } from "antd";
import useInfiniteScroll from "react-infinite-scroll-hook";

const Content = ({ elem }) => {
  const containerRef = useRef();
  const pageRef = useRef(1);
  const [loading, setloading] = useState(false);
  const [isReachedEnd, setisReachedEnd] = useState(false);
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const { getNotificationList, handleViewNotification, markallAsRead } =
    useNotificationContext();
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
      getNotificationList(formData)
        .then((res) => {
          const { today, yesterday, older, total_pages, current_page_no, msg } =
            res;
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
          pageRef.current = current_page_no;
          setPages({
            Page: current_page_no,
            totalPages: total_pages,
          });
        })
        .finally(() => {
          setisReachedEnd(false);
          setloading(false);
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

  const loadMore = () => {
    if (!getHasNextPage()) {
      setloading(false);
      setisReachedEnd(false);
    } else if (isReachedEnd && getHasNextPage() && !loading) {
      setloading(true);
      pageRef.current = pageRef.current + 1;
      getFansData(pageRef.current);
    }
  };

  const getHasNextPage = () => {
    console.log(Pages.totalPages, pageRef.current);
    return Pages.totalPages && pageRef.current !== Pages.totalPages;
  };

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: loading,
    hasNextPage: getHasNextPage(),
    onLoadMore: loadMore,
  });

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        console.log("Reached End");
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
    };
  }, []);

  return (
    <div className={classes.listSec} ref={containerRef}>
      {Pages.totalPages === 0 && (
        <div className={classes.noResultSec}>
          <Empty description="No Notifications" />
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
      {loading || getHasNextPage() ? (
        <div className="text-center py-2" ref={sentryRef}>
          <Skeleton active />
        </div>
      ) : null}
    </div>
  );
};

export default Content;
