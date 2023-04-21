import React, { useEffect } from "react";
import { useAuth, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import {
  JSONtoformdata,
  ReadMore,
  decodeHtml,
  getAuthToken,
} from "../../../Shared/Utility";
import { replaceBiodataHandler } from "../Utility";
import classes from "../Profile.module.css";
import { Input, Select, Skeleton } from "antd";
import { useState } from "react";
import { useFormik } from "formik";
import {
  getInfluencerCategoryService,
  updateProfileService,
} from "../../../Services/ApiService";
import { toast } from "react-hot-toast";

const BioContainer = ({ isLoginuser }) => {
  const [isAboutEdit, setisAboutEdit] = useState(false);
  const { profileData, isLinkopenModal, setisLinkopenModal } =
    useProfileContext();
  const [selectedCategory, setselectedCategory] = useState([]);
  const loginToken = useAuthToken();
  const { isSuccess, loginUserData } = useAuth();
  const [influencerCategory, setinfluencerCategory] = useState([]);

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      bio_data: "",
      influencer_category: [],
    },
    onSubmit: (values) => {
      updateBioDataHandler(values);
    },
  });

  const getBioData = () => {
    if (values?.bio_data !== "") {
      return values?.bio_data;
    } else {
      return replaceBiodataHandler(profileData);
    }
  };

  const updateBioDataHandler = (values) => {
    var formData = new FormData();
    formData.append("token", loginToken);
    formData.append("name", decodeHtml(loginUserData.name));
    formData.append("auth_code", getAuthToken(loginToken + loginUserData.name));
    formData.append("bio_data", values.bio_data);
    updateProfileService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          setisAboutEdit(false);
          toast.success("Bio data updated sucessfully");
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {});
  };

  const handleChangeOption = (value, val) => {
    // if (selectedCategory.length !== 3) {
    setselectedCategory(value);
    // }
    // let userData = [...values.influencer_category]

    // console.log(`selected ${value}`, val);
  };

  const getCategoryList = () => {
    let influencerData = {
      token: loginUserData?.token,
      auth_code: getAuthToken(loginUserData?.token),
    };
    getInfluencerCategoryService(JSONtoformdata(influencerData))
      .then((res) => {
        if (res.data.status === 1) {
          setinfluencerCategory(
            res.data.influencer_category.map((ele) => {
              return {
                ...ele,
                label: ele.name,
                value: ele.name,
                disabled: false,
              };
            })
          );
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (loginUserData) {
      getCategoryList();
    }
  }, [loginUserData]);
  return (
    <div className={classes.profileIntro}>
      <div className={classes.headingSec}>
        <h2>
          About {profileData?.first_name}{" "}
          <i class="material-icons">fiber_manual_record</i>{" "}
          <span>Entertainer</span>
        </h2>

        {isAboutEdit ? (
          <div
            className={classes.editSec}
            onClick={() => {
              handleSubmit();
            }}
          >
            <i class="material-symbols-outlined">done</i>
          </div>
        ) : (
          <div
            className={classes.editSec}
            style={{ display: isLoginuser ? "block" : "none" }}
            onClick={() => {
              setisAboutEdit(true);
              let tempData = replaceBiodataHandler(profileData);
              setFieldValue("bio_data", tempData);
            }}
          >
            <i className={classes.editIcon}></i>
          </div>
        )}
      </div>
      {isAboutEdit ? (
        <div className={classes.bioEditSec}>
          <p>Category</p>
          <Select
            mode="multiple"
            allowClear
            className={classes.categorySelect}
            value={selectedCategory}
            onClear={(e) => {
              setselectedCategory([]);
            }}
            style={{ width: "100%" }}
            placeholder="Select Category"
            onChange={handleChangeOption}
            options={influencerCategory}
          />
          <p>Bio</p>
          <Input.TextArea
            className={`${classes.textBox} ${classes.textarea}`}
            placeholder="Enter your Bio Data Here..."
            value={values.bio_data}
            onChange={handleChange("bio_data")}
            autoComplete="off"
          />
        </div>
      ) : (
        <>
          {isSuccess && profileData ? (
            <ReadMore
              maxheight={"64px"}
              isReadMore={false}
              isLinkopenModal={isLinkopenModal}
              setisLinkopenModal={setisLinkopenModal}
              isReadMoreValid={() => {
                console.log("valid");
              }}
            >
              {getBioData()}
            </ReadMore>
          ) : (
            <Skeleton active />
          )}
        </>
      )}
    </div>
  );
};

export default BioContainer;
