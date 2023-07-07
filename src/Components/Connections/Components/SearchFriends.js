import axios from "axios";
import React, { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { searchRawcasterUsersService } from "../../../Services/ApiService";
import {
  getAuthToken,
  getisAddFriend,
  getRawcaserToken,
  JSONtoformdata,
} from "../../../Shared/Utility";

import classes from "../Connections.module.css";

let isRequestCancel = false;

const SearchFriends = ({
  loadingStatus,
  onResult,
  setPages,
  setSearchData,
  SearchData,
}) => {
  const [PeopleList, setPeopleList] = useState([]);
  const source = useRef(null);
  const getToken = () => {
    const userData = getRawcaserToken();
    return userData?.token;
  };

  const getPeopleList = (page = 1) => {
    if (source.current) {
      isRequestCancel = true;
      source.current.cancel("Request Cancelled");
    }
    source.current = axios.CancelToken.source();
    let nuggetData = {
      nugget_type: 0,
      token: getToken(),
      auth_code: getAuthToken(getToken()),
      search_key: SearchData,
      page_number: page,
    };
    searchRawcasterUsersService(
      JSONtoformdata(nuggetData),
      source.current.token
    )
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.current_page_no === 1) {
            let filterList = res.data.users_list.filter((ele) =>
              getisAddFriend(ele.friend_request_status)
            );

            setPeopleList(filterList);
            onResult(filterList);
          } else {
            let result;

            setPeopleList((pre) => {
              let filterList = res.data.users_list.filter(
                (ele) => ele.friend_request_status === ""
              );
              return [...pre, ...filterList].reduce((acc, current) => {
                const x = acc.find((item) => item.user_id === current.user_id);
                if (!x) {
                  result = acc.concat([current]);
                  return acc.concat([current]);
                } else {
                  result = acc;
                  return acc;
                }
              }, []);
            });
            onResult(result);
          }

          setPages({
            page: res.data.current_page_no,
            totalpage: res.data.total_pages,
          });
        } else {
          onResult([]);
          setPeopleList([]);
        }
      })
      .catch((err) => {
        if (!isRequestCancel || !err.message.includes("Request Cancelled")) {
          toast.error(err.message);
        }
      })
      .finally(() => {
        loadingStatus(false);
      });
  };

  return (
    <div className={classes.filterSec}>
      <InputGroup className="mb-3">
        <Form.Control
          className={classes.inSearch}
          placeholder="Enter Email or Name to Search"
          aria-label="Enter Email or Name to Search"
          value={SearchData}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (SearchData !== "") {
                loadingStatus(true);
                getPeopleList();
              } else {
                onResult([]);
              }
            }
          }}
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
        />
        <InputGroup.Text
          className={classes.searchIcon}
          onClick={() => {
            if (SearchData !== "") {
              loadingStatus(true);
              getPeopleList();
            } else {
              onResult([]);
            }
          }}
        >
          <span className="material-icons">search</span>
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default SearchFriends;
