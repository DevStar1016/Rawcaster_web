import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import classes from "./Modal.module.css";

const Postpoll = () => {
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      poll: [...Array(2).fill({ choiceData: "" })],
      duration: "",
    },
    onSubmit: (value) => {
      console.log(value);
    },
  });

  return (
    <>
      <div className={classes.postTextcontent}>
        <textarea
          className={`${classes.postTextarea} ${classes.pollTextarea}`}
          style={{ height: "auto" }}
          placeholder={`Ask a question...`}
        />
        <div className={classes.pollContainer}>
          <div className={classes.addSec}>
            {values.poll.length !== 4 && (
              <span
                class="material-symbols-outlined"
                onClick={() => {
                  let tmpData = [...values.poll, { choiceData: "" }];
                  setFieldValue("poll", tmpData);
                }}
              >
                add
              </span>
            )}
          </div>
          <div>
            <Row>
              {values.poll.map((ele, index) => {
                return (
                  <Col sm={6}>
                    <p className={classes.label}>Choice {index + 1} </p>
                    <Form.Item>
                      <Input
                        key={index}
                        className={`${classes.textBox} ${
                          values.poll.length >= 3 && classes.choicetextBox
                        }`}
                        placeholder={`Choice ${index + 1}`}
                        maxLength={50}
                        autoComplete="off"
                        value={values.poll[index].choiceData}
                        onChangeCapture={(e) => {
                          let tmpData = [...values.poll];
                          tmpData[index].choiceData = e.target.value;
                          setFieldValue("poll", tmpData);
                        }}
                        addonAfter={
                          values.poll.length >= 3 && (
                            <div
                              className={classes.closeBtn}
                              onClick={() => {
                                let tmpData = [...values.poll];
                                tmpData = tmpData.filter((elem, ind) => {
                                  if (ind !== index) {
                                    return ele;
                                  }
                                });
                                setFieldValue("poll", tmpData);
                              }}
                            >
                              <span class="material-symbols-outlined">
                                cancel
                              </span>
                            </div>
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                );
              })}
              {/* <Col sm={6}>
                <p className={classes.label}>Choice 4 (Optional) </p>
                <Form.Item name="username">
                  <Input
                    className={`${classes.textBox} ${classes.choicetextBox}`}
                    placeholder="Choice 4 (Optional)"
                    maxLength={50}
                    autoComplete="off"
                    addonAfter={
                      <div className={classes.closeBtn}>
                        <span class="material-symbols-outlined">cancel</span>
                      </div>
                    }
                  />
                </Form.Item>
              </Col> */}
            </Row>
          </div>
        </div>
        <Button
          className={classes.btnstyle}
          onClick={() => {
            handleSubmit();
          }}
        >
          Post poll
        </Button>
      </div>
    </>
  );
};

export default Postpoll;
