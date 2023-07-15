import { Col, Row, Select, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import classes from "./Influencers.module.css";
import influencerdiamond from "../../Assets/Images/svg/influencers-diamond.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  getInfluencerCategoryService,
  InfluencerFollowService,
  InfluencerListService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  getAuthToken,
  JSONtoformdata,
  filterValidObject,
} from "../../Shared/Utility";
import Checked from "../../Assets/Images/svg/Checked.svg";
import unChecked from "../../Assets/Images/svg/UnChecked.svg";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import ProfileImg from "../../UIComponents/ProfileImg";
import { useAuthData } from "../../Shared/Reduxfetcher";

const SelectInfluencers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserData = useAuthData();

  const [influencerCategory, setinfluencerCategory] = useState([]);
  const [influencerList, setinfluencerList] = useState([]);
  const [previousInfluencerList, setpreviousInfluencerList] = useState([]);
  const [SelectedInfluencersList, setSelectedInfluencersList] = useState([]);
  const [isLoadMore, setisLoadMore] = useState(null);
  const [SelectAllInfluencer, setSelectAllInfluencer] = useState(false);
  const [influencersCount, setinfluencersCount] = useState(0);

  const [SearchValues, setSearchValues] = useState({
    search_key: "",
    category: "",
    pageNum: 1,
    total_page: 1,
  });

  const getInfluencerList = (page = 1, category = "", search_key = "") => {
    let influencerData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
      page_number: page,
      category: category,
      search_key: search_key,
    };
    setpreviousInfluencerList(influencerList);
    InfluencerListService(JSONtoformdata(filterValidObject(influencerData)))
      .then((res) => {
        if (res.data.status === 1) {
          setSearchValues((pre) => ({
            ...pre,
            pageNum: res.data.current_page_no,
            total_page: res.data.total_pages,
          }));
          setinfluencersCount(res?.data?.total_influencer_count);
          if (res.data.current_page_no === 1) {
            setinfluencerList(res.data.users_list);
          } else {
            setinfluencerList((pre) => [...pre, ...res.data.users_list]);
          }
        } else {
          setinfluencerList([]);
          setinfluencersCount(0);
          setSearchValues((pre) => ({
            ...pre,
            pageNum: 1,
            total_page: 1,
          }));
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
        setisLoadMore(null);
      });
  };

  const getCategoryList = () => {
    let influencerData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
    };
    getInfluencerCategoryService(JSONtoformdata(influencerData))
      .then((res) => {
        if (res.data.status === 1) {
          setinfluencerCategory(res.data.influencer_category);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (loginUserData !== null) {
      getCategoryList();
      getInfluencerList();
    }
  }, [loginUserData]);

  useEffect(() => {
    if (SelectAllInfluencer) {
      const tempPreviousInfluencersList = [...previousInfluencerList];
      const tempInfluencersList = [...influencerList];
      const tempSelectedInfluencers = tempPreviousInfluencersList?.filter(
        (item, index) => {
          const find = SelectedInfluencersList?.findIndex((item1) =>
            item?.user_ref_id?.includes(item1)
          );
          if (find === -1) {
            return item;
          }
          return undefined;
        }
      );
      if (tempSelectedInfluencers?.length > 0) {
        const tempSelectedInfluencers1 = tempInfluencersList?.filter(
          (item, index) => {
            const find = tempSelectedInfluencers?.findIndex((item1) =>
              item?.user_ref_id?.includes(item1?.user_ref_id)
            );
            if (find === -1) {
              return item;
            }
            return undefined;
          }
        );
        setSelectedInfluencersList(
          tempSelectedInfluencers1?.map((ele) => ele?.user_ref_id)
        );
      } else {
        setSelectedInfluencersList(
          tempInfluencersList?.map((ele) => ele?.user_ref_id)
        );
      }
    }
  }, [influencerList]);

  const handleSelectAllInfluencers = (type) => {
    if (type) {
      const tempInfluencersList = [...influencerList];
      const tempSelectedInfluencers = tempInfluencersList?.map(
        (ele) => ele?.user_ref_id
      );
      setSelectedInfluencersList(tempSelectedInfluencers);
      setSelectAllInfluencer(true);
    } else {
      setSelectedInfluencersList([]);
      setSelectAllInfluencer(false);
    }
  };

  const getSelectData = (listData = []) => {
    return listData.map((value) => ({
      ...value,
      label: value.name,
      value: value.name,
    }));
  };

  const HandleupdateFans = (selectedFansList = SelectedInfluencersList) => {
    let promise = new Promise((resolve, reject) => {
      let becameFanData = {
        token: loginUserData?.token,
        auth_code: getAuthToken(loginUserData?.token),
        follow_userid: JSON.stringify(selectedFansList),
        select_all:
          SelectedInfluencersList?.length === influencerList?.length ? 1 : 0,
        category: SearchValues?.category,
      };
      InfluencerFollowService(JSONtoformdata(becameFanData))
        .then((res) => {
          if (res.data.status === 1) {
            getInfluencerList(
              SearchValues.pageNum,
              SearchValues.category,
              SearchValues.search_key
            );
            setSelectedInfluencersList([]);
            resolve(true);
          } else if (res.data.status === 0) {
            toast.error(res.data.msg);
            reject(false);
          }
        })
        .catch((err) => {
          reject(false);
        });
    });

    return promise;
  };

  return (
    <div className="mainWrapper innerContent">
      <div className={classes.headerSec}>
        <h1>
          Welcome {loginUserData?.name || "User"}- Select your influencers
        </h1>
        <div className={classes.btnSec}>
          <button
            onClick={() => {
              if (SelectedInfluencersList.length === 0) {
                navigate("/dashboard");
              } else {
                HandleupdateFans()
                  .then((res) => {
                    navigate("/dashboard");
                  })
                  .catch((err) => {});
              }
            }}
          >
            {SelectedInfluencersList.length === 0 ? "Skip this" : "Next"}
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
      <div className={classes.influencerContainer}>
        <Row>
          <Col md={16} xs={24}>
            <div className={classes.filterSec}>
              <InputGroup className="mb-3">
                <Form.Control
                  className={classes.inSearch}
                  placeholder="Search Influencer by name"
                  aria-label="Search Influencer by name"
                  onChange={(e) => {
                    setSearchValues((pre) => ({
                      ...pre,
                      search_key: e.target.value,
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      document.getElementById("searchInfluencer").click();
                    }
                  }}
                />
                <InputGroup.Text
                  className={classes.searchIcon}
                  id="searchInfluencer"
                  onClick={() => {
                    dispatch(handleLoading(true));
                    getInfluencerList(
                      1,
                      SearchValues.category,
                      SearchValues.search_key
                    );
                  }}
                >
                  <span className="material-icons">search</span>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="influencerSelect">
              <Select
                allowClear
                placeholder="Select Category"
                className={classes.selectCategory}
                options={getSelectData(influencerCategory)}
                onSelect={(value, val) => {
                  setSearchValues((pre) => ({
                    ...pre,
                    category: val.id,
                  }));
                  getInfluencerList(1, val.id, SearchValues.search_key);
                }}
                onClear={getInfluencerList}
                clearIcon={
                  <span style={{}} className={classes.clearIcon}>
                    <span class="material-symbols-outlined">close</span>
                  </span>
                }
              />
            </div>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col sm={12} className={classes.selectInfluencerText}>
            Selected Influencers (
            {SelectAllInfluencer
              ? influencersCount -
                (influencerList?.length - SelectedInfluencersList?.length)
              : SelectedInfluencersList.length}
            )
          </Col>
          <Col className={classes.selectAllContainer} sm={12}>
            <Col>
              {SelectedInfluencersList?.length !== influencerList?.length ? (
                <p
                  onClick={() => {
                    handleSelectAllInfluencers(true);
                  }}
                >
                  Select All
                </p>
              ) : (
                <p
                  onClick={() => {
                    handleSelectAllInfluencers(false);
                  }}
                >{`UnSelect All`}</p>
              )}
            </Col>
            <Col className="text-end">
              <p
                className={
                  SelectedInfluencersList.length !== 0
                    ? classes.activebecameFanBtn
                    : classes.becameFanBtn
                }
                onClick={() => {
                  if (SelectedInfluencersList.length !== 0) {
                    dispatch(handleLoading(true));
                    HandleupdateFans()
                      .then((res) => {
                        navigate("/dashboard");
                      })
                      .catch((err) => {});
                  }
                }}
              >
                Become a Fan{" "}
                {/* <span className={`material-icons ${classes.rightarrow}`}>
                  arrow_forward
                </span> */}
              </p>
            </Col>
          </Col>
        </Row>

        <Row gutter={15}>
          {influencerList.map((ele) => {
            return (
              <Col sm={8}>
                <div className={classes.influencers}>
                  <div className="d-flex flex-row w-100">
                    <div className={classes.top}>
                      <ProfileImg
                        src={ele.profile_img}
                        imgClassName={classes.profileimg}
                        badgeClassName={classes.diamond}
                        Badgetype={ele?.user_status_id}
                      />

                      <p className={classes.counts}>{ele.followers}</p>
                    </div>

                    <img
                      className={classes.checked_icon}
                      alt="Checked"
                      src={
                        SelectedInfluencersList.includes(ele?.user_ref_id)
                          ? Checked
                          : unChecked
                      }
                      onClick={() => {
                        if (
                          SelectedInfluencersList.includes(ele?.user_ref_id)
                        ) {
                          setSelectedInfluencersList((pre) =>
                            pre.filter((elem) => elem !== ele?.user_ref_id)
                          );
                        } else {
                          if (SelectedInfluencersList.length === 0) {
                            setSelectedInfluencersList([ele?.user_ref_id]);
                          } else {
                            setSelectedInfluencersList((pre) => [
                              ...pre,
                              ele?.user_ref_id,
                            ]);
                          }
                        }
                      }}
                    ></img>
                  </div>
                  <Tooltip placement="topLeft" title={ele.display_name}>
                    <p className={classes.name}>
                      <p>{ele.display_name}</p>

                      <span className={classes.author}>
                        {ele.category.toString()}
                      </span>
                    </p>
                  </Tooltip>
                  <p className={classes.desc}>
                    Lorem ipsum dolor sit amet, consectetur ipsum adipiscing
                    elit. Donec suscipit ex condim entum ante egestas suscipit
                    <span className={classes.readmore}>read more</span>
                  </p>
                  {SelectedInfluencersList.includes(ele?.user_ref_id) ? (
                    <Link className={classes.selectedBtn}>
                      Selected{" "}
                      <span className="material-symbols-outlined">done</span>
                    </Link>
                  ) : (
                    <>
                      {isLoadMore === ele.user_ref_id ? (
                        <Spin />
                      ) : (
                        <Link
                          className={classes.fanBtn}
                          onClick={() => {
                            dispatch(handleLoading(true));
                            HandleupdateFans([ele?.user_ref_id]);
                          }}
                        >
                          Become a Fan{" "}
                          <span className="material-icons">arrow_forward</span>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
        {SearchValues.pageNum !== SearchValues.total_page && (
          <div className={classes.loadmoreSec}>
            {isLoadMore === "load_more" ? (
              <Spin />
            ) : (
              <p
                onClick={() => {
                  getInfluencerList(
                    SearchValues.pageNum + 1,
                    SearchValues.category,
                    SearchValues.search_key
                  );
                }}
              >
                View more
                <span className="material-symbols-outlined">arrow_forward</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInfluencers;
