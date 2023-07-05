import { Alert, Button, Input, Space } from "antd";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { PostNuggetContext } from "../../Shared/Context";
import PollDateinputBox from "../../Sharedcomponents/PollDateinputBox";
import classes from "../Modal.module.css";
import * as Yup from "yup";
import { isArray } from "lodash";
import LoginModal from "../Verification/LoginModal";
import { useAuthData } from "../../Shared/Reduxfetcher";

const schema = Yup.object().shape({
  content: Yup.string()
    .max(150, "Question cannot be longer than 150 characters")
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

const Postpoll = ({ setisPoll }) => {
  const context = useContext(PostNuggetContext);
  const loginUserData = useAuthData();
  const [PollData, setPollData] = useState([
    { choiceData: "" },
    { choiceData: "" },
  ]);
  const [LimitExceeds, setLimitExceeds] = useState(false);

  const { values, setFieldValue, handleSubmit, handleChange, errors, touched } =
    useFormik({
      initialValues: {
        content: "",
        poll_option: [],
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

  const getChoiceTitle = (index) => {
    if (index > 2) {
      return `Choice ${index} (optional)`;
    } else {
      return `Choice ${index}`;
    }
  };

  useEffect(() => {
    if (values?.content?.length > 149) {
      setLimitExceeds(true);
    } else {
      setLimitExceeds(false);
    }
  }, [values.content]);

  const handleLimitExceedsClose = () => setLimitExceeds(false);

  return (
    <>
      <div className={classes.postTextcontent}>
        <textarea
          className={`${classes.postTextarea} ${classes.pollTextarea}`}
          style={{ height: "auto" }}
          placeholder={`Ask a question...`}
          value={values.content}
          maxLength={150}
          onChange={handleChange("content")}
        />
        {/* {LimitExceeds && loginUserData?.user_status_id !== 4 && (
          <LoginModal
            open={LimitExceeds}
            close={handleLimitExceedsClose}
            AIclose={true}
            AIopen="Upgrade"
            AImessgae="You have reached your character limit, to increase the limit upgrade your membership!"
          />
        )} */}

        {touched.content && <p className="ErrTxt">{errors?.content}</p>}
        <div className={classes.pollContainer}>
          <div className={classes.addSec}>
            {PollData.length !== 4 && (
              <span
                class="material-symbols-outlined"
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
                            <span class="material-symbols-outlined">
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
              action={
                <Space direction="vertical">
                  <Button
                    size="small"
                    className={classes.upgradeBtn}
                    type="primary"
                    onClick={() => {
                      window.location.assign("/membership");
                    }}
                  >
                    Upgrade
                  </Button>
                  <Button
                    className={classes.LaterBtn}
                    onClick={handleLimitExceedsClose}
                    size="small"
                    danger
                    type="primary"
                  >
                    Later
                  </Button>
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
