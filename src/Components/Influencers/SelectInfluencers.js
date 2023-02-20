import { Col, Row, Select, Spin } from "antd";
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
import { getUserData } from "../../Shared/Reduxfetcher";

const SelectInfluencers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserData = getUserData();

  const [influencerCategory, setinfluencerCategory] = useState([]);
  const [influencerList, setinfluencerList] = useState([]);
  const [SelectedInfluencersList, setSelectedInfluencersList] = useState([]);
  const [isLoadMore, setisLoadMore] = useState(null);

  const [SearchValues, setSearchValues] = useState({
    search_key: "",
    category: "",
    pageNum: 1,
    total_page: 1,
  });

  const getInfluencerList = (page = 1, calegory = "", search_key = "") => {
    let influencerData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
      page_number: page,
      calegory: calegory,
      search_key: search_key,
    };
    InfluencerListService(JSONtoformdata(filterValidObject(influencerData)))
      .then((res) => {
        if (res.data.status === 1) {
          setSearchValues((pre) => ({
            ...pre,
            pageNum: res.data.current_page_no,
            total_page: res.data.total_pages,
          }));
          if (res.data.current_page_no === 1) {
            setinfluencerList(res.data.users_list);
          } else {
            setinfluencerList((pre) => [...pre, ...res.data.users_list]);
          }
        } else {
          setinfluencerList([]);
          setSearchValues((pre) => ({
            ...pre,
            pageNum: 1,
            total_page: 1,
          }));
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
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
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (loginUserData !== null) {
      getCategoryList();
      getInfluencerList();
    }
  }, [loginUserData]);

  const getSelectData = (listData = []) => {
    return listData.map((value) => ({
      ...value,
      label: value.name,
      value: value.name,
    }));
  };

  const HandleupdateFans = (selectedFansList = SelectedInfluencersList) => {
    let becameFanData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
      follow_userid: JSON.stringify(selectedFansList),
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
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
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
              navigate("/dashboard");
            }}
          >
            Skip this
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
                />
                <InputGroup.Text
                  className={classes.searchIcon}
                  onClick={() => {
                    dispatch(handleLoading(true));
                    getInfluencerList(
                      1,
                      SearchValues.category,
                      SearchValues.search_key
                    );
                  }}
                >
                  <span class="material-icons">search</span>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Col>
          <Col md={8} xs={24}>
            <div className="influencerSelect">
              <Select
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
              />
            </div>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col sm={12}>
            Selected Influencers ({SelectedInfluencersList.length})
          </Col>
          <Col sm={12} className="text-end">
            <p
              className={
                SelectedInfluencersList.length !== 0
                  ? classes.activebecameFanBtn
                  : classes.becameFanBtn
              }
              onClick={() => {
                if (SelectedInfluencersList.length !== 0) {
                  dispatch(handleLoading(true));
                  HandleupdateFans();
                }
              }}
            >
              Become a Fan{" "}
              <span className={`material-icons ${classes.rightarrow}`}>
                arrow_forward
              </span>
            </p>
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
                        Badgetype={8}
                      />

                      <p className={classes.counts}>{ele.followers}</p>
                    </div>

                    <img
                      className={classes.checked_icon}
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
                  <p className={classes.name}>
                    {ele.display_name}
                    <span className={classes.author}>
                      {ele.category.toString()}
                    </span>
                  </p>
                  <p className={classes.desc}>
                    Lorem ipsum dolor sit amet, consectetur ipsum adipiscing
                    elit. Donec suscipit ex condim entum ante egestas suscipit
                    <span className={classes.readmore}>read more</span>
                  </p>
                  {SelectedInfluencersList.includes(ele?.user_ref_id) ? (
                    <Link className={classes.selectedBtn}>
                      Selected{" "}
                      <span class="material-symbols-outlined">done</span>
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
                          <span class="material-icons">arrow_forward</span>
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
                <span class="material-symbols-outlined">arrow_forward</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectInfluencers;
