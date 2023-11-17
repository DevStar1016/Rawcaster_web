/**
 * A React component that displays and allows editing of the user's bio information.
 * @param {boolean} isLoginuser - Indicates whether the user is the logged-in user.
 * @returns The BioContainer component.
 */
import React, { useEffect } from "react";
import { useAuth, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import {
  JSONtoformdata,
  ReadMore,
  decodeHtml,
  getAuthToken,
  getAuthenticated,
} from "../../../Shared/Utility";
import useReplaceBiodataHandler from "../Utility";
import classes from "../Profile.module.css";
import {
  Alert,
  Button,
  Input,
  Select,
  Skeleton,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { useState } from "react";
import { useFormik } from "formik";
import {
  getInfluencerCategoryService,
  updateProfileService,
} from "../../../Services/ApiService";
import { toast } from "react-hot-toast";
import shieldIcon from "../../../Assets/Icons/svg/claim_account_white.svg";
import { useNavigate } from "react-router";
import LoginModal from "../../../Modal/Verification/LoginModal";
import { handleloginModalShow } from "../../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";

const BioContainer = ({ isLoginuser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAboutEdit, setisAboutEdit] = useState(false);
  const {
    profileData,
    isLinkopenModal,
    setisLinkopenModal,
    handleBecameFan,
    DiamondVerifyType,
  } = useProfileContext();
  const [selectedCategory, setselectedCategory] = useState([]);
  const loginToken = useAuthToken();
  const { isSuccess, loginUserData } = useAuth();
  const [influencerCategory, setinfluencerCategory] = useState([]);
  const [BecameFanStatus, setBecameFanStatus] = useState("");
  const [verifyProfilePopup, setverifyProfilePopup] = useState(false);
  const BioData = useReplaceBiodataHandler(
    profileData,
    loginUserData && profileData?.user_id === loginUserData?.user_id
  );
  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      bio_data:
        typeof profileData?.bio_data === "string" ? profileData?.bio_data : "",
      influencer_category: [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateBioDataHandler(values);
    },
  });

  /**
   * useEffect hook that runs when the profileData or influencerCategory changes.
   * If profileData and influencerCategory are both truthy, it sets isAboutEdit to false.
   * If profileData has a non-empty influencer_category property, it splits the string into an array.
   * It then filters the influencerCategory array based on the values in the profileData array.
   * The filtered array is then set as the selectedCategory state.
   * @param {Object} profileData - The profile data object.
   * @param {Array} influencerCategory - The array of influencer categories.
   * @returns None
   */
  useEffect(() => {
    if (profileData && influencerCategory.length !== 0) {
      setisAboutEdit(false);
      if (profileData?.influencer_category) {
        let givenArray = profileData?.influencer_category.split(",");
        let filterData = influencerCategory.filter((ele) => {
          return givenArray.find((item) => parseInt(item) === parseInt(ele.id));
        });
        setselectedCategory(filterData);
      }
    }

    if (profileData && profileData?.bio_data === "") {
      setFieldValue("bio_data", BioData);
    }
  }, [profileData, influencerCategory, BioData]);

  /**
   * Handles the update of bio data for a user profile.
   * @param {object} values - The updated values for the bio data.
   * @returns None
   */
  const updateBioDataHandler = (values) => {
    var formData = new FormData();
    formData.append("token", loginToken);
    formData.append("name", decodeHtml(loginUserData.name));
    formData.append("auth_code", getAuthToken(loginToken + loginUserData.name));
    formData.append("bio_data", values.bio_data);
    if (selectedCategory.length !== 0) {
      let filterIDs = selectedCategory.map((ele) => parseInt(ele.id));
      formData.append("influencer_category", filterIDs.toString());
    }

    updateProfileService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          setisAboutEdit(false);
          toast.remove("rawcaster");
          toast.success("Bio data updated successfully", { id: "rawcaster" });
        } else {
          toast.remove("rawcaster");
          toast.error(response.data.msg, { id: "rawcaster" });
        }
      })
      .catch(() => {});
  };

  /**
   * Handles the change event of an option in a select input.
   * @param {any} value - The selected value from the select input.
   * @param {any} val - Additional value to handle the change event.
   * @returns None
   */
  const handleChangeOption = (value, val) => {
    let finalResult = influencerCategory.map((ele) => {
      let findValue = value.find((item) => item === ele.label);
      if (findValue) {
        return ele;
      }
      return null;
    });
    finalResult = finalResult.filter((ele) => ele !== null);
    setselectedCategory(finalResult);
  };

  /**
   * Retrieves the list of influencer categories from the server and sets the state
   * with the received data.
   * @returns None
   */
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
              };
            })
          );
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Executes the getCategoryList function when the loginUserData state changes.
   * @returns None
   */
  useEffect(() => {
    if (loginUserData) {
      getCategoryList();
    }
  }, [loginUserData]);

  /**
   * Retrieves the value of the selected category from the `selectedCategory` array.
   * @returns An array of values from the selected category.
   */
  const getLabelValue = () => {
    return selectedCategory.map((ele) => ele.value);
  };
  const handleVerifyPopupClose = () => setverifyProfilePopup(false);

  return (
    <div className={classes.profileIntro}>
      <div className={classes.headingSec}>
        <h2>
          About {profileData?.first_name}{" "}
          {selectedCategory.length !== 0 && (
            <i className="material-icons">fiber_manual_record</i>
          )}
          <Tooltip title={getLabelValue().toString()}>
            <span>{getLabelValue().toString()}</span>
          </Tooltip>
        </h2>

        {isAboutEdit ? (
          <div
            className={classes.editSec}
            onClick={() => {
              handleSubmit();
            }}
          >
            <i className="material-symbols-outlined">done</i>
          </div>
        ) : (
          <div
            className={classes.editSec}
            style={{ display: isLoginuser ? "block" : "none" }}
            onClick={() => {
              setisAboutEdit(true);

              //  setFieldValue("bio_data", BioData);
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
            className={`${classes.categorySelect} categorySelect`}
            value={selectedCategory}
            style={{ width: "100%" }}
            placeholder="Select Category"
            onChange={handleChangeOption}
          >
            {influencerCategory.map((ele) => {
              return (
                <Select.Option
                  style={{ borderRadius: "10px" }}
                  key={ele.value}
                  disabled={
                    selectedCategory.length > 2
                      ? selectedCategory.find(
                          (elem) => parseInt(elem.id) === ele.id
                        )
                        ? false
                        : true
                      : false
                  }
                >
                  {ele.label}
                </Select.Option>
              );
            })}
          </Select>
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
              isReadMoreValid={() => {}}
            >
              {/**
               * Retrieves the bio data from the values object. If the bio data is not available,
               * it calls the useReplaceBiodataHandler function to generate the bio data from the profileData.
               * @returns The bio data string.
               */}
              {values?.bio_data !== "" ? values?.bio_data : BioData}
            </ReadMore>
          ) : (
            <Skeleton active />
          )}
          {profileData?.last_verify_status !== null &&
          (DiamondVerifyType === 3 || DiamondVerifyType === 2) ? (
            <div className={classes.verifyAccountOutlineContainer}>
              <div className="d-flex align-items-center">
                <span class="material-symbols-outlined text-danger">
                  cancel
                </span>
                <p className="text-danger ms-2 mb-1">
                  {profileData?.last_verify_status || ""}
                </p>
              </div>
              <Button
                className={`${classes.becomeafanbtn} ${classes.verifyAccount}`}
                style={{
                  display: "flex",
                  background: "#E26386",
                }}
                onClickCapture={() => {
                  if (
                    DiamondVerifyType === 3 &&
                    loginUserData?.user_status_id === 4
                  ) {
                    navigate("/verifyaccount");
                  }
                }}
              >
                <div className={classes.becomeSec}>
                  <img src={shieldIcon} />
                  <p>Verify my Account</p>
                </div>
              </Button>
            </div>
          ) : (
            <>
              {(DiamondVerifyType === 3 || DiamondVerifyType === 2) && (
                <Button
                  className={`${classes.becomeafanbtn} ${
                    classes.verifyAccount
                  } ${
                    DiamondVerifyType === 2 ? classes.disabledverifyAccount : ""
                  }`}
                  onClickCapture={() => {
                    if (
                      DiamondVerifyType === 3 &&
                      loginUserData?.user_status_id === 4
                    ) {
                      navigate("/verifyaccount");
                    } else {
                      setverifyProfilePopup((pre) => !pre);
                    }
                  }}
                  disabled={DiamondVerifyType === 2}
                  style={{
                    display: "flex",
                    background: "#E26386",
                  }}
                >
                  {DiamondVerifyType === 3 ? (
                    <div className={classes.becomeSec}>
                      <img src={shieldIcon} />
                      <p>Verify my Account</p>
                    </div>
                  ) : (
                    DiamondVerifyType === 2 && (
                      <div className={classes.becomeSec}>
                        <img src={shieldIcon} />
                        <p>Approval Pending</p>
                      </div>
                    )
                  )}
                </Button>
              )}
            </>
          )}
          {verifyProfilePopup && (
            <LoginModal
              open={verifyProfilePopup}
              close={handleVerifyPopupClose}
              AIclose={true}
              AIopen="Get Diamond"
              AImessgae="Verified account feature is only for Diamond members and Influencers"
            />
          )}

          {!profileData || isLoginuser || profileData?.follow ? null : (
            <Button
              className={classes.becomeafanbtn}
              onClickCapture={() => {
                if (getAuthenticated()) {
                  if (BecameFanStatus === "") {
                    setBecameFanStatus("pending");
                    handleBecameFan().then(() => {
                      setBecameFanStatus("");
                    });
                  }
                } else {
                  dispatch(handleloginModalShow(true));
                }
              }}
              style={{
                display: isLoginuser || profileData?.follow ? "none" : "flex",
              }}
            >
              {BecameFanStatus === "" ? (
                <div className={classes.becomeSec}>
                  <p>Become a Fan </p>
                  <i className="material-symbols-outlined">arrow_forward</i>
                </div>
              ) : (
                BecameFanStatus === "pending" && (
                  <div className={classes.loadingSec}>
                    <p>Please wait</p>

                    <Spin className={classes.loader} />
                  </div>
                )
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default BioContainer;
