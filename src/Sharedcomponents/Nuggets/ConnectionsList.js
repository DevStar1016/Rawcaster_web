import React, { useEffect } from "react";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import SearchResult from "./SearchResult";
import classes from "./ItemsList.module.css";
import { useSpecificConnectionNugget } from "../../Shared/Context";
import { defaultprofileImg } from "../../Shared/CommonConstants";

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
      setConnectionData(
        friendsList.filter((ele) => !shareWithData.includes(ele.user_id))
      );
    }
  }, [friendsList, open, type]);

  return (
    <div className={classes.listContainer}>
      <SearchResult
        displayData={FilteredList}
        setFilteredList={setFilteredList}
        setConnectionData={setConnectionData}
        list={ConnectionData}
        type={"connection"}
        ConnectionData={ConnectionData}
        handleClose={(ele) => {
          setFilteredList((pre) =>
            pre.filter((elem) => elem.user_id !== ele.user_id)
          );
        }}
      />
      <div className={classes.listSec}>
        {ConnectionData?.map((ele) => {
          return (
            <div
              className={classes.profileData}
              onClick={() => {
                setConnectionData((pre) =>
                  pre.filter((elem) => elem.user_id !== ele.user_id)
                );
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
              }}
            >
              <div className={classes.leftSec}>
                <img
                  src={ele.profile_img}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectionsList;
