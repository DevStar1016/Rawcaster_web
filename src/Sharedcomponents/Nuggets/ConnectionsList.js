/**
 * A React component that displays a list of connections.
 * @returns The ConnectionsList component.
 */
import React, { useEffect } from "react";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import SearchResult from "./SearchResult";
import classes from "./ItemsList.module.css";
import { useSpecificConnectionNugget } from "../../Shared/Context";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { Empty } from "antd";

const ConnectionsList = () => {
  const {
    ConnectionData,
    setConnectionData,
    FilteredList,
    setFilteredList,
    open,
    type,
    shareWithData,
    share_type,
  } = useSpecificConnectionNugget();
  const { friendsList } = useDashboard();
  /**
   * useEffect hook that updates the connection data and filtered list based on changes in friendsList, open, type, and shareWithData.
   * @param {Array} friendsList - The list of friends.
   * @param {boolean} open - The state of the component being open or closed.
   * @param {number} type - The type of share.
   * @param {Array} shareWithData - The list of users to share data with.
   * @returns None
   */
  useEffect(() => {
    if (friendsList) {
      setConnectionData(friendsList);
      setFilteredList([]);
    }

    if (shareWithData && share_type === 4) {
      let findData = friendsList.map((ele) => {
        if (shareWithData.includes(ele.user_id)) {
          return { ...ele, listname: decodeHtml(ele.display_name) };
        }
      });
      findData = findData.filter((ele) => ele !== undefined);
      setFilteredList(findData);
      setConnectionData(friendsList);
    }
  }, [friendsList, open, type, shareWithData]);

  /**
   * Checks if a connection with the given user ID is selected.
   * @param {number} user_id - The user ID to check.
   * @returns {object | undefined} - The connection object if found, otherwise undefined.
   */
  const isSelectedConnection = (user_id) => {
    const findData = FilteredList.find(
      (ele) => parseInt(ele.user_id) === parseInt(user_id)
    );
    return findData;
  };

  return (
    <div className={classes.listContainer}>
      <SearchResult
        allList={friendsList}
        setConnectionData={setConnectionData}
        type={"connection"}
      />
      {ConnectionData.length !== 0 ? (
        <div className={classes.listSec}>
          {ConnectionData?.map((ele) => {
            return (
              <div
                className={`${classes.profileData} ${
                  isSelectedConnection(ele.user_id) ? classes.selectedItem : ""
                }`}
                onClick={() => {
                  if (isSelectedConnection(ele.user_id)) {
                    setFilteredList((pre) =>
                      pre.filter((elem) => elem.user_id !== ele.user_id)
                    );
                  } else {
                    if (FilteredList.length !== 0) {
                      setFilteredList((pre) => [
                        ...pre,
                        { ...ele, listname: decodeHtml(ele.display_name) },
                      ]);
                    } else {
                      setFilteredList([
                        { ...ele, listname: decodeHtml(ele.display_name) },
                      ]);
                    }
                  }
                }}
              >
                <div className={classes.leftSec}>
                  <img
                    src={ele.profile_img ? ele.profile_img : ""}
                    alt={decodeHtml(ele.display_name)}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultprofileImg;
                    }}
                  />
                  <div className={classes.nameSec}>
                    <p>{decodeHtml(ele.display_name)}</p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined ${classes.selectedIcon}`}
                >
                  done
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-5">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default ConnectionsList;
