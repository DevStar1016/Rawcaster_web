import React, { useState } from "react";
import { useDashboard } from "../../../Shared/Reduxfetcher";
import classes from "../Connections.module.css";
import Group from "../Components/Group";
import { Skeleton } from "antd";

const Groups = () => {
  const { groupsList, isGroupLoading } = useDashboard();
  const [searchInput, setsearchInput] = useState("");

  const getValidData = () => {
    if (groupsList && groupsList.length !== 0) {
      const filteredArr = groupsList.reduce((acc, current) => {
        const x = acc.find((item) => item.group_id === current.group_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return filteredArr;
    } else {
      return [];
    }
  };

  return (
    <div className={classes.myconnectioin}>
      <input
        className={classes.textBox}
        onChange={(e) => setsearchInput(e.target.value)}
        value={searchInput}
        placeholder="Search Groups"
        autoComplete="off"
      />
      <h2>
        My Groups <span>({groupsList.length})</span>
        {getValidData()?.length !== 0 && !isGroupLoading ? (
          <i class="material-symbols-outlined">add</i>
        ) : null}
      </h2>

      <div
        className={
          getValidData()?.length === 0 && !isGroupLoading
            ? classes.connectionsEmpty
            : classes.connectionsLists
        }
      >
        {getValidData()?.map((group) => {
          return <Group group={group} searchInput={searchInput} />;
        })}
        {isGroupLoading ? (
          <>
            {[...Array(4)].map((ele) => (
              <Skeleton avatar paragraph={{ rows: 0 }} />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Groups;
