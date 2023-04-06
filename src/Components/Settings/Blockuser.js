import React from "react";
import classes from "./Settings.module.css";
import { Button, Dropdown, Menu, Select } from "antd";
import InfiniteScroll from "react-infinite-scroller";
import { useDashboard } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import { useState } from "react";

const Blockuser = () => {
  const { friendsList } = useDashboard();
  const [blockUserList, setblockUserList] = useState([]);
  const [query, setQuery] = useState("");

  const searchContent = (
    <Menu className={classes.searchdropdown}>
      <input
        className={classes.textbox}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      ></input>
      <Button
        className={classes.resetbtn}
        onClick={() => {
          setQuery("");
        }}
      >
        Reset
      </Button>
      <Button className={classes.searchbtn} onClick={() => {}}>
        Search
      </Button>
    </Menu>
  );

  return (
    <div className={`frndDetails blockusermain`}>
      <div>
        <div className={`${classes.item} ${classes.mb0}`}>
          <p className={classes.smallheading}>Users Management</p>
          <p className={classes.text}>
            Search and block/unblock users in your connection list.
          </p>
        </div>
        <div className={classes.w500}>
          <Select
            mode="multiple"
            style={{ width: "20%", minWidth: "200px" }}
            placeholder="Search to Connection"
            optionLabelProp="label"
            optionFilterProp="label"
          >
            {friendsList.map(function (opt) {
              return (
                <Select.Option
                  key={opt.user_id + "friend"}
                  value={opt.user_id}
                  label={decodeHtml(opt.display_name)}
                >
                  <div
                    className="friends"
                    style={{
                      position: "relative",
                      padding: "10px 0px",
                    }}
                  >
                    <img
                      src={opt.profile_img}
                      alt="groupImg"
                      style={{ borderRadius: "16px" }}
                      width="32px"
                      height="32px"
                    ></img>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginLeft: "10px",
                      }}
                    >
                      {decodeHtml(opt.display_name)}
                    </span>
                  </div>
                </Select.Option>
              );
            })}
          </Select>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={classes.blockBtn}
          >
            Block
          </Button>
        </div>
      </div>

      <div className={classes.blockeduserSearch}>
        <p className={classes.uname}>
          <Dropdown trigger={["click"]} overlay={searchContent}>
            <p className={classes.searchbtn}>
              User Name{" "}
              <i className={`material-icons ${classes.searchicon}`}>search</i>
            </p>
          </Dropdown>
        </p>

        <p className={classes.acttionTxt}>Action</p>
      </div>

      <div>
        <InfiniteScroll initialLoad={false} pageStart={0} useWindow={true}>
          {blockUserList.map((friend, index) => {
            return (
              <div className={classes.blockedList} key={index}>
                <div style={{ display: "flex" }}>
                  <img
                    src={friend.profile_img}
                    className={classes.userimg}
                  ></img>
                  <span className="mr-3"></span>
                  <span className={classes.display_name}>
                    {decodeHtml(friend.display_name)}
                  </span>
                </div>

                <Button className={classes.unblkBtn} ghost type="primary">
                  UnBlock
                </Button>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      <div
        style={{ textAlign: "center", marginTop: "40px", maxWidth: "510px" }}
      >
        {blockUserList.length < 1 ? "No blocked user found" : null}
      </div>
    </div>
  );
};

export default Blockuser;
