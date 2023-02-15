import { Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import classes from "./Influencers.module.css";
import influencerdiamond from "../../Assets/Images/svg/influencers-diamond.svg";
import { Link, useNavigate } from "react-router-dom";
import {
  getInfluencerCategoryService,
  InfluencerListService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";

const SelectInfluencers = () => {
  const loginUserData = useSelector((state) => state.auth.loginUserData);
  const navigate = useNavigate();
  const [influencerCategory, setinfluencerCategory] = useState([]);
  const [influencerList, setinfluencerList] = useState([]);

  const getInfluencerList = (page = 1) => {
    let influencerData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
      page_number: page,
    };
    InfluencerListService(JSONtoformdata(influencerData))
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.current_page_no === 1) {
            setinfluencerList(res.data.users_list);
          } else {
            setinfluencerList((pre) => [...pre, ...res.data.users_list]);
          }
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
    // getInfluencerCategoryService()
    //   .then((res) => {
    //     if (res.data.status === 1) {
    //       setinfluencerCategory(res.data.influencer_category);
    //     } else if (res.data.status === 0) {
    //       toast.error(res.data.msg);
    //     }
    //   })
    //   .catch((err) => {
    //     toast.error(err.message);
    //   });
  };

  const getCategoryList = () => {
    getInfluencerCategoryService()
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
    getCategoryList();
    getInfluencerList();
  }, []);

  const getSelectData = (listData = []) => {
    return listData.map((value) => ({
      label: value.name,
      value: value.name,
    }));
  };

  return (
    <div className="mainWrapper innerContent">
      <div className={classes.headerSec}>
        <h1>Welcome Danii - Select your influencers</h1>
        <div className={classes.btnSec}>
          <button
            onClick={() => {
              navigate("/profile");
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
                />
                <InputGroup.Text className={classes.searchIcon}>
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
              />
            </div>
          </Col>
        </Row>
        <Row gutter={10}>
          <Col sm={12}>Selected Influencers ({influencerList.length})</Col>
          <Col sm={12} className="text-end">
            Become a Fan{" "}
            <span className={`material-icons ${classes.rightarrow}`}>
              arrow_forward
            </span>
          </Col>
        </Row>

        <Row gutter={15}>
          {influencerList.map((ele) => {
            return (
              <Col sm={8}>
                <div className={classes.influencers}>
                  <div className={classes.top}>
                    <img
                      className={classes.profileimg}
                      src={require("../../Assets/Images/png/influencer.png")}
                    />
                    <img className={classes.diamond} src={influencerdiamond} />
                    <p className={classes.counts}>10M +</p>
                  </div>
                  <p className={classes.name}>
                    David Thompson{" "}
                    <span className={classes.author}>Priest</span>
                  </p>
                  <p className={classes.desc}>
                    Lorem ipsum dolor sit amet, consectetur ipsum adipiscing
                    elit. Donec suscipit ex condim entum ante egestas suscipit
                    <span className={classes.readmore}>read more</span>
                  </p>
                  <Link className={classes.fanBtn}>
                    Become a Fan{" "}
                    <span class="material-icons">arrow_forward</span>
                  </Link>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SelectInfluencers;
