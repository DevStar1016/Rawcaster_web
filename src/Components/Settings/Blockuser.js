import React, { useEffect } from "react";
import classes from "./Settings.module.css";
import { Button, Select } from "antd";
import { useAuthToken, useDashboard } from "../../Shared/Reduxfetcher";
import {
  JSONtoformdata,
  decodeHtml,
  filterValidObject,
} from "../../Shared/Utility";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  blockmultipleuserService,
  blockunblockuserService,
  listallblockedusersService,
} from "../../Services/ApiService";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const Blockuser = () => {
  const { friendsList } = useDashboard();
  const token = useAuthToken();
  const [blockUserList, setblockUserList] = useState([]);
  const [blockuser, setblockuser] = useState([]);
  const [query, setQuery] = useState(null);
  const [isSearchEnabled, setisSearchEnabled] = useState(true);

  const getBlockedUserData = (search_key = null) => {
    let blockuserData = {
      token: token,
      search_key: search_key,
    };
    listallblockedusersService(JSONtoformdata(filterValidObject(blockuserData)))
      .then((res) => {
        if (res.data.status === 1) {
          setblockUserList(res.data.blocked_list);
        } else {
          setblockUserList([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisSearchEnabled(false);
      });
  };

  useEffect(() => {
    getBlockedUserData();
  }, []);

  const handleBlockMultipleuser = (user_id) => {
    let blockData = {
      token: token,
      user_id,
    };
    blockmultipleuserService(JSONtoformdata(blockData))
      .then((res) => {
        if (res.data.status === 1) {
          getBlockedUserData();
        }
      })
      .catch((err) => {})
      .finally(() => {
        setblockuser(null);
      });
  };

  const handleunblockuser = (user_id) => {
    let unblockData = {
      token: token,
      user_id,
      action: 2,
    };
    blockunblockuserService(JSONtoformdata(unblockData))
      .then((res) => {
        if (res.data.status === 1) {
          getBlockedUserData();
        }
      })
      .catch((err) => {})
      .finally(() => {
        setblockuser(null);
      });
  };

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
            className={classes.blockuserSec}
            maxTagCount={"responsive"}
            style={{
              width: "20%",
              minWidth: "200px",
              backgroundColor: "#F1F2F5",
            }}
            value={blockuser}
            dropdownStyle={{ backgroundColor: "#F1F2F5" }}
            placeholder="Search to Connection"
            optionLabelProp="label"
            optionFilterProp="label"
            onChange={(val) => {
              setblockuser(val);
            }}
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
            onClick={() => {
              handleBlockMultipleuser(JSON.stringify(blockuser));
            }}
          >
            Block
          </Button>
        </div>
      </div>

      <div className={classes.blockeduserSearch}>
        <InputGroup className="mb-3">
          <Form.Control
            className={classes.inSearch}
            placeholder="User name"
            aria-label="User name"
            value={query}
            onChange={(e) => {
              setisSearchEnabled(true);
              setQuery(e.target.value);
            }}
          />
          <InputGroup.Text
            className={classes.searchIcon}
            onClick={() => {
              if (isSearchEnabled) {
                getBlockedUserData(query);
              }
            }}
          >
            <span className="material-icons">search</span>
          </InputGroup.Text>
        </InputGroup>
        {query && (
          <div className={classes.resetSec}>
            <span
              className="material-symbols-outlined"
              onClick={() => {
                setQuery("");
                getBlockedUserData();
              }}
            >
              close
            </span>
          </div>
        )}
      </div>

      <div>
        {blockUserList.map((friend, index) => {
          return (
            <div className={classes.blockedList} key={index}>
              <div style={{ display: "flex" }}>
                <img
                  src={friend.profile_img}
                  className={classes.userimg}
                  alt={"User_img"}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = defaultprofileImg;
                  }}
                ></img>
                <span className="mr-3"></span>
                <span className={classes.display_name}>
                  {decodeHtml(friend.display_name)}
                </span>
              </div>

              <Button
                className={classes.unblkBtn}
                ghost
                type="primary"
                onClick={() => {
                  handleunblockuser(friend.user_id);
                }}
              >
                Unblock
              </Button>
            </div>
          );
        })}
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
