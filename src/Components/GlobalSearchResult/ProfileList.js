import SearchProfile from "../../Sharedcomponents/Profile/SearchProfile";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useDashboard } from "../../Shared/Reduxfetcher";
import classes from "./GlobalSearch.module.css";
import { searchRawcasterUsersService } from "../../Services/ApiService";
import axios from "axios";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import {
  DecryptionString,
  getAuthenticated,
  getAuthToken,
  getRawcaserToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import {
  handleisGlobalSearch,
  handleLoading,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Skeleton } from "antd";
import InfiniteScrollerComponent from "../../Sharedcomponents/InfiniteScrollerComponent";

let isRequestCancel = false;

const ProfileList = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const searchKey = params?.key ? DecryptionString(params?.key) : "";
  const { pathname } = useLocation();
  const { isGlobalSearch } = useDashboard();
  const source = useRef(null);
  const [PeopleList, setPeopleList] = useState([]);
  const [isFetching, setisFetching] = useState(true);
  const [Pages, setPages] = useState({
    page: null,
    totalpage: null,
  });

  const getToken = () => {
    if (getAuthenticated()) {
      const userData = getRawcaserToken();
      return userData?.token;
    } else {
      return "RAWCAST";
    }
  };

  const getPeopleList = (page = 1) => {
    return new Promise((resolve, reject) => {
      if (source.current) {
        isRequestCancel = true;
        source.current.cancel("Request Cancelled");
      }
      source.current = axios.CancelToken.source();
      let nuggetData = {
        nugget_type: 0,
        token: getToken(),
        auth_code: getAuthToken(getToken()),
        search_key: searchKey,
        page_number: page,
      };
      searchRawcasterUsersService(
        JSONtoformdata(nuggetData),
        source.current.token
      )
        .then((res) => {
          if (res.data.status === 1) {
            if (res.data.current_page_no === 1) {
              setPeopleList(res.data.users_list);
            } else {
              setPeopleList((pre) =>
                [...pre, ...res.data.users_list].reduce((acc, current) => {
                  const x = acc.find(
                    (item) => item.user_id === current.user_id
                  );
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
          dispatch(handleLoading(false));
          dispatch(handleisGlobalSearch(false));
          setTimeout(() => {
            setisFetching(false);
          }, 1000);
        });
    });
  };

  useEffect(() => {
    if (isGlobalSearch || PeopleList?.length === 0) {
      dispatch(handleLoading(true));
      setisFetching(true);
      getPeopleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getValidPeople = () => {
    if (PeopleList && PeopleList.length !== 0) {
      const filteredArr = PeopleList.reduce((acc, current) => {
        const x = acc.find((item) => item.user_id === current.user_id);
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
    // <BottomScrollListener
    //   offset={100}
    //   onBottom={() => {
    //     console.log("test");
    //   }}
    // >
    <div className={` ${classes.profileSec}`}>
      {getValidPeople()?.length === 0 ? (
        <>
          {isFetching ? (
            <div className="mt-5 w-100">
              {[...Array(6)].map((ele) => (
                <Skeleton active />
              ))}
            </div>
          ) : (
            <div className={classes.DisplayMsg}>We didn't find any results</div>
          )}
        </>
      ) : null}

      {getValidPeople()?.length !== 0 && (
        <>
          {isFetching && Pages.totalpage ? (
            <div className="mt-5 w-100">
              {[...Array(6)].map((ele) => (
                <Skeleton active />
              ))}
            </div>
          ) : (
            <>
              <InfiniteScrollerComponent
                Component={() => {
                  return (
                    <>
                      {getValidPeople().map((ele) => {
                        return (
                          <SearchProfile
                            ele={ele}
                            setPeopleList={setPeopleList}
                            PeopleList={PeopleList}
                          />
                        );
                      })}
                    </>
                  );
                }}
                totalPages={Pages.totalpage}
                onNextPage={getPeopleList}
                Loader={() => {
                  return (
                    <div className="text-center py-2">
                      <Skeleton active />
                    </div>
                  );
                }}
              />
            </>
          )}
        </>
      )}
    </div>
    // </BottomScrollListener>
  );
};

export default ProfileList;
