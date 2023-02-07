import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Signup.module.css";

const Signup = () => {
  return (
    <>
      <Row gutter={[15]}>
        <Col span={24}>
          <p className={classes.label}> Name</p>
          <Form.Item name="firstname" className="errormsg">
            <Input className={classes.textBox} placeholder="Enter your name" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <p className={classes.label}>Email Address</p>
          <Form.Item name="email" className="errormsg">
            <Input
              className={classes.textBox}
              placeholder="Enter your email address"
            />
          </Form.Item>
        </Col>
      </Row>

      <p className={classes.label}>Password</p>
      <p>
        We recommend your password to be at least 8 characters long, contain
        uppercase letter (A-Z), lowercase letter (a-z), symbol (!@#$%) and a
        number (0-9).
      </p>
      <Form.Item name="password" className="errormsg">
        <Input.Password className={classes.textBox} placeholder="Password" />
      </Form.Item>

      <Form.Item name="password" className="errormsg">
        <DateInputBox />
      </Form.Item>

      <Form.Item>
        <Button size="large" block htmlType="submit" className={classes.btn}>
          Join Rawcaster Family
        </Button>
      </Form.Item>
    </>
  );
};

export default Signup;
