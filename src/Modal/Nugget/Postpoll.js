/**
 * A component that allows users to post a poll.
 * @param {function} setisPoll - A function to set the state of whether the poll is active or not.
 * @returns The Postpoll component.
 */
import { Alert, Button, Input, Space } from "antd";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PostNuggetContext } from "../../Shared/Context";
import PollDateinputBox from "../../Sharedcomponents/PollDateinputBox";
import classes from "../Modal.module.css";
import * as Yup from "yup";
import { isArray } from "lodash";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { HandleVerifyModal } from "../DefaultModal";
import { complementaryMembershipService } from "../../Services/ApiService";
import { useNavigate } from "react-router";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import { useDispatch } from "react-redux";

const Postpoll = ({ setisPoll }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(PostNuggetContext);
  const loginUserData = useAuthData();
  const token = useAuthToken();
  const [PollData, setPollData] = useState([
    { choiceData: "" },
    { choiceData: "" },
  ]);
  const [LimitExceeds, setLimitExceeds] = useState(false);
  const schema = Yup.object().shape({
    content: Yup.string()
      .max(
        loginUserData?.nugget_content_length,
        "Question cannot be longer than 150 characters"
      )
      .required("Question is required"),
    duration: Yup.string().required("Poll Length is required"),
    poll_option: Yup.array()
      .of(
        Yup.object().shape({
          choiceData: Yup.string()
            .trim("Choice cannot include leading and trailing spaces")
            .strict(true)
            .required("Choice is required"),
        })
      )
      .test(
        "has-required-users",
        "At least two Choice are required",
        function (value) {
          return (
            value.length >= 2 &&
            value.slice(0, 2).every((user) => user.choiceData)
          );
        }
      )
      .min(2, "At least two Choice are required"),
  });

  const { values, setFieldValue, handleSubmit, handleChange, errors, touched } =
    useFormik({
      initialValues: {
        content: "",
        poll_option: [{ choiceData: "" }, { choiceData: "" }],
        duration: "",
      },
      validateOnMount: true,
      validateOnChange: true,
      validationSchema: schema,
      onSubmit: (value) => {
        context.setPollData(value);
        context.handleSubmit();
      },
    });

  /**
   * Returns the title for a choice based on the given index.
   * If the index is greater than 2, the title will include "(optional)".
   * @param {number} index - The index of the choice.
   * @returns {string} The title for the choice.
   */
  const getChoiceTitle = (index) => {
    if (index > 2) {
      return `Choice ${index} (optional)`;
    } else {
      return `Choice ${index}`;
    }
  };

  /**
   * A useEffect hook that checks if the length of the content in the values object exceeds
   * the nugget_content_length of the loginUserData object. If it does, it sets the limitExceeds
   * state to true, otherwise it sets it to false.
   * @param {object} values - The values object containing the content.
   * @param {object} loginUserData - The loginUserData object containing the nugget_content_length.
   * @returns None
   */
  useEffect(() => {
    if (values?.content?.length > loginUserData?.nugget_content_length - 1) {
      setLimitExceeds(true);
    } else {
      setLimitExceeds(false);
    }
  }, [values.content]);

  const handleLimitExceedsClose = () => setLimitExceeds(false);

  const ComplementaryMemberShip = () => {
    let formData = new FormData();
    formData.append("token", token);
    complementaryMembershipService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          HandleVerifyModal({
            primary: "success",
            onSuccess: () => {
              handleLimitExceedsClose();
              dispatch(
                handleLoginData({
                  ...loginUserData,
                  user_status: res.data.user_status,
                  user_status_id: res.data.user_status_id,
                  complementary_status: res.data.complementary_status ?? 0,
                })
              );
            },
            isCloseAvailable: false,
            SubmitButtonTitle: "Ok",
            message: res.data.msg,
          });
        } else {
          navigate("/membership");
        }
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className={classes.postTextcontent}>
        <textarea
          className={`${classes.postTextarea} ${classes.pollTextarea}`}
          style={{ height: "auto" }}
          placeholder={`Ask a question...`}
          value={values.content}
          maxLength={loginUserData?.nugget_content_length}
          onChange={handleChange("content")}
        />

        {touched.content && <p className="ErrTxt">{errors?.content}</p>}
        <div className={classes.pollContainer}>
          <div className={classes.addSec}>
            {PollData.length !== 4 && (
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  let tmpData = [...PollData, { choiceData: "" }];
                  setFieldValue("poll_option", tmpData);
                  setPollData(tmpData);
                }}
              >
                add
              </span>
            )}
          </div>
          <div>
            <Row>
              {PollData.map((ele, index) => {
                return (
                  <Col sm={6}>
                    <p className={classes.label}>
                      {getChoiceTitle(index + 1)}{" "}
                    </p>

                    <Input
                      key={index}
                      className={`${classes.textBox} ${
                        PollData.length >= 3 && classes.choicetextBox
                      }`}
                      placeholder={getChoiceTitle(index + 1)}
                      maxLength={25}
                      autoComplete="off"
                      value={PollData[index].choiceData}
                      onChange={(e) => {
                        let tmpData = [...PollData];
                        tmpData[index].choiceData = e.target.value;
                        setPollData(tmpData);
                        setFieldValue("poll_option", tmpData);
                      }}
                      addonAfter={
                        PollData.length >= 3 && (
                          <div
                            className={classes.closeBtn}
                            onClick={() => {
                              let tmpData = [...PollData];
                              tmpData = tmpData.filter((elem, ind) => {
                                if (ind !== index) {
                                  return ele;
                                }
                              });
                              setPollData(tmpData);
                              setFieldValue("poll_option", tmpData);
                            }}
                          >
                            <span className="material-symbols-outlined">
                              cancel
                            </span>
                          </div>
                        )
                      }
                    />
                    {isArray(touched.poll_option) && (
                      <p className="ErrTxt">
                        {errors?.poll_option?.[index]?.choiceData}
                      </p>
                    )}
                  </Col>
                );
              })}
            </Row>
            {touched.poll_option && !isArray(touched.poll_option) && (
              <p className="ErrTxt">{errors?.poll_option}</p>
            )}
            <Row>
              <p className={classes.label}>Poll Length </p>
              <PollDateinputBox
                onSelectDate={(date) => {
                  if (typeof date === "object") {
                    setFieldValue(
                      "duration",
                      `${date.day}:${date.hours}:${date.minutes}`
                    );
                  } else {
                    setFieldValue("duration", "");
                  }
                }}
              />
              {touched.duration && <p className="ErrTxt">{errors?.duration}</p>}
            </Row>
            <div className={classes.deleteSec}>
              <div
                className={classes.pollDeleteSec}
                onClick={() => {
                  setisPoll(false);
                }}
              >
                <i className={classes.deleteIcon}></i>
                <p>Remove Poll</p>
              </div>
            </div>
          </div>
        </div>
        {LimitExceeds && loginUserData?.user_status_id !== 4 && (
          <div
            style={{ paddingTop: "20px" }}
            className={classes.alertContainer}
            id="Alertdiv"
          >
            <Alert
              message="Upgrade Your Plan"
              description="You have reached your character limit, to increase the limit upgrade your membership!"
              type="info"
              style={{
                alignItems:
                  loginUserData.complementary_status === 1
                    ? "flex-start"
                    : "center",
              }}
              action={
                <Space direction="vertical">
                  <Button
                    size="small"
                    className={classes.upgradeBtn}
                    type="primary"
                    onClick={() => {
                      if (loginUserData.complementary_status === 1) {
                        ComplementaryMemberShip();
                      } else {
                        handleLimitExceedsClose();
                        // navigate("/membership");
                      }
                    }}
                  >
                    {loginUserData.complementary_status === 0
                      ? "Ok"
                      : "Upgrade"}
                  </Button>

                  {loginUserData.complementary_status === 1 && (
                    <Button
                      className={classes.LaterBtn}
                      onClick={handleLimitExceedsClose}
                      size="small"
                      danger
                      type="primary"
                    >
                      {"Cancel"}
                    </Button>
                  )}
                </Space>
              }
            />
          </div>
        )}
        <Button
          className={classes.btnstyle}
          onClick={() => {
            handleSubmit();
          }}
        >
          Post Poll
        </Button>
      </div>
    </>
  );
};

export default Postpoll;
