/**
 * A React functional component that displays a list of groups.
 * @returns {JSX.Element} - The rendered component.
 */
import React, { useState } from "react";
import { useDashboard } from "../../../Shared/Reduxfetcher";
import classes from "../Connections.module.css";
import Group from "../Components/Group";
import { Skeleton } from "antd";
import ConfigureGroup from "./ConfigureGroup";

const Groups = () => {
  const { groupsList, isGroupLoading } = useDashboard();
  const [isConfigureGroup, setisConfigureGroup] = useState({
    show: false,
    group_id: null,
  });
  const [searchInput, setsearchInput] = useState("");

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
        {groupsList?.length !== 0 && !isGroupLoading ? (
          <i
            className="material-symbols-outlined"
            onClick={() => {
              setisConfigureGroup({ show: true, group_id: null });
            }}
          >
            add
          </i>
        ) : null}
      </h2>

      <div
        className={
          groupsList?.length === 0 && !isGroupLoading
            ? classes.connectionsEmpty
            : classes.connectionsLists
        }
      >
        {groupsList?.map((group) => {
          return (
            <Group
              group={group}
              searchInput={searchInput}
              onClick={() => {
                setisConfigureGroup({ show: true, group_id: group.group_id });
              }}
            />
          );
        })}
        {isGroupLoading ? (
          <>
            {[...Array(4)].map((ele) => (
              <Skeleton avatar paragraph={{ rows: 0 }} />
            ))}
          </>
        ) : null}
      </div>
      {isConfigureGroup.show && (
        <ConfigureGroup
          open={isConfigureGroup.show}
          groupId={isConfigureGroup.group_id}
          close={() => {
            setisConfigureGroup({ show: false, group_id: null });
          }}
        />
      )}
    </div>
  );
};

export default Groups;
