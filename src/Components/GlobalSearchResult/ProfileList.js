import SearchProfile from "../../Sharedcomponents/Profile/SearchProfile";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useDashboard } from "../../Shared/Reduxfetcher";
import classes from "./GlobalSearch.module.css";
import { searchRawcasterUsersService } from "../../Services/ApiService";
import axios from "axios";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import {
  getAuthenticated,
  getAuthToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { getLocalStorageData } from "../../Store/Storage";
import { toast } from "react-hot-toast";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";

let isRequestCancel = false;

const ProfileList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [PeopleList, setPeopleList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = JSON.parse(getLocalStorageData("rawcaster_user_token"));
      return userData?.token;
    } else {
      return "RAWCAST";
    }
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
      search_key: params.key,
      page_number: page,
    };
    searchRawcasterUsersService(
      JSONtoformdata(nuggetData),
      source.current.token
    )
      .then((res) => {
        if (res.data.status === 1) {
          console.log("test");
          if (res.data.current_page_no === 1) {
            setPeopleList(res.data.users_list);
          } else {
            setPeopleList((pre) =>
              [...pre, ...res.data.users_list].reduce((acc, current) => {
                const x = acc.find((item) => item.user_id === current.user_id);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, [])
            );
          }
          setPages({
            page: res.data.current_page_no,
            totalpage: res.data.total_pages,
          });
        } else {
          setPeopleList([]);
        }
      })
      .catch((err) => {
        if (!isRequestCancel || !err.message.includes("Request Cancelled")) {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setisLoading(false);
        dispatch(handleLoading(false));
        dispatch(handleisGlobalSearch(false));
      });
  };

  useEffect(() => {
    if (isGlobalSearch || PeopleList.length === 0) {
      dispatch(handleLoading(true));
      getPeopleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isGlobalSearch]);

  const onEndReached = () => {
    if (Pages.page !== Pages.totalpage) {
      setisLoading(true);

      getPeopleList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  const getValidPeople = () => {
    const filteredArr = PeopleList.reduce((acc, current) => {
      const x = acc.find((item) => item.user_id === current.user_id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return filteredArr;
  };

  return (
    <div className={`mt-3 ${classes.profileSec}`} ref={scrollRef}>
      {getValidPeople().map((ele) => {
        return (
          <SearchProfile
            ele={ele}
            setPeopleList={setPeopleList}
            PeopleList={PeopleList}
          />
        );
      })}
      {isLoading && (
        <div className="text-center py-2">
          <Spinner animation="border" role="status" />
        </div>
      )}
    </div>
  );
};

export default ProfileList;
