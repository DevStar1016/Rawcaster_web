import React, { useEffect, useState } from "react";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import SearchResult from "./SearchResult";
import classes from "./ItemsList.module.css";
import {
  useSpecificConnectionNugget,
  usePostNuggetContext,
} from "../../Shared/Context";

const Grouplist = () => {
  const {
    ConnectionData,
    setConnectionData,
    FilteredList,
    setFilteredList,
    type,
    shareWithData,
    share_type,
  } = useSpecificConnectionNugget();
  const { groupsList } = useDashboard();

  useEffect(() => {
    if (groupsList) {
      setConnectionData(groupsList);
      setFilteredList([]);
    }
    if (shareWithData && share_type === 3) {
      let findData = groupsList.map((ele) => {
        if (shareWithData.includes(ele.group_id)) {
          return { ...ele, listname: decodeHtml(ele.group_name) };
        }
      });
      findData = findData.filter((ele) => ele !== undefined);
      setFilteredList(findData);
      setConnectionData(
        groupsList.filter((ele) => !shareWithData.includes(ele.group_id))
      );
    }
  }, [groupsList]);

  return (
    <div className={classes.listContainer}>
      <SearchResult
        displayData={FilteredList}
        setFilteredList={setFilteredList}
        setConnectionData={setConnectionData}
        type={"group"}
        list={ConnectionData}
        ConnectionData={ConnectionData}
        handleClose={(ele) => {
          setFilteredList((pre) =>
            pre.filter((elem) => elem.group_id !== ele.group_id)
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
                  pre.filter((elem) => elem.group_id !== ele.group_id)
                );
                if (FilteredList.length !== 0) {
                  setFilteredList((pre) => [
                    ...pre,
                    { ...ele, listname: decodeHtml(ele.group_name) },
                  ]);
                } else {
                  setFilteredList([
                    { ...ele, listname: decodeHtml(ele.group_name) },
                  ]);
                }
              }}
            >
              <div className={classes.leftSec}>
                <img src={ele.group_icon} />
                <div className={classes.nameSec}>
                  <p>{decodeHtml(ele.group_name)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Grouplist;
