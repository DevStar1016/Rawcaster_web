import React, { useEffect } from "react";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import SearchResult from "./SearchResult";
import classes from "./ItemsList.module.css";
import { useSpecificConnectionNugget } from "../../Shared/Context";
import { Empty } from "antd";
import { defaultGroupImg } from "../../Shared/CommonConstants";

const Grouplist = () => {
  const {
    ConnectionData,
    setConnectionData,
    FilteredList,
    setFilteredList,
    shareWithData,
    share_type,
  } = useSpecificConnectionNugget();
  const { groupsList } = useDashboard();

  /**
   * useEffect hook that updates the connection data and filtered list based on the groups list.
   * @param {Array} groupsList - The list of groups.
   * @param {boolean} shareWithData - Indicates whether there is shared data.
   * @param {number} share_type - The type of sharing.
   * @returns None
   */
  useEffect(() => {
    if (groupsList) {
      setConnectionData(groupsList);
      setFilteredList([]);
    }
    if (shareWithData && share_type === 3) {
      let findData = groupsList.map((ele) => {
        if (shareWithData.includes(ele.group_id) && ele.my_group === 1) {
          return { ...ele, listname: decodeHtml(ele.group_name) };
        }
      });
      findData = findData.filter((ele) => ele !== undefined);
      setFilteredList(findData);
      const filterGroupList = groupsList.filter((ele) => ele.my_group === 1);
      setConnectionData(filterGroupList);
    }
  }, [groupsList]);

  /**
   * Checks if a group with the given group_id is selected in the FilteredList.
   * @param {number} group_id - The ID of the group to check.
   * @returns {object | undefined} - The selected group object if found, otherwise undefined.
   */
  const isSelectedGroup = (group_id) => {
    const findData = FilteredList.find(
      (ele) => parseInt(ele.group_id) === parseInt(group_id)
    );
    return findData;
  };

  return (
    <div className={classes.listContainer}>
      <SearchResult
        allList={groupsList}
        setConnectionData={setConnectionData}
        type={"group"}
      />
      {ConnectionData.length !== 0 ? (
        <div className={classes.listSec}>
          {ConnectionData?.map((ele, index) => {
            return (
              <div
                key={index+ele.group_id}
                className={`${classes.profileData} ${
                  isSelectedGroup(ele.group_id) ? classes.selectedItem : ""
                }`}
                onClick={() => {
                  if (isSelectedGroup(ele.group_id)) {
                    setFilteredList((pre) =>
                      pre.filter((elem) => elem.group_id !== ele.group_id)
                    );
                  } else {
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
                  }
                }}
              >
                <div className={classes.leftSec}>
                  <img
                    src={ele.group_icon}
                    alt={decodeHtml(ele.group_name)}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = defaultGroupImg;
                    }}
                  />
                  <div className={classes.nameSec}>
                    <p>{decodeHtml(ele.group_name)}</p>
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

export default Grouplist;
