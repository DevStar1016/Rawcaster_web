import { Button, Modal } from "antd";
import React from "react";
import classes from "./ReportGroup.module.css";
import TextArea from "antd/es/input/TextArea";
import { useFormik } from "formik";
import * as yup from "yup";
const validationSchema = yup.object().shape({
  message: yup
    .string()
    .trim("* Report Message cannot include leading and trailing spaces")
    .strict(true)
    .required(`Please input your Report Message!`),
});

const ReportGroup = ({ open, close, onSuccess }) => {
  const { values, handleChange, handleSubmit, resetForm, touched, errors } =
    useFormik({
      initialValues: {
        message: "",
      },
      validationSchema,
      onSubmit: (val) => {
        resetForm();
        onSuccess(val);
      },
    });
  return (
    <Modal
      title="Report this group to Rawcaster"
      open={open}
      footer={[null]}
      closable
      onCancel={() => {
        close();
        resetForm();
      }}
    >
      <div className={classes.ReportSec}>
        <TextArea
          rows={4}
          placeholder="Enter your message"
          value={values.message}
          onChange={handleChange("message")}
        />
        {touched.message && (
          <p className="ErrTxt my-1 text-center">{errors?.message}</p>
        )}
      </div>
      <div className={classes.actionBtn} style={{ marginTop: "12px" }}>
        <Button
          type="primary"
          onClick={() => {
            handleSubmit();
          }}
          style={{ marginLeft: "10px" }}
          htmlType="Continue"
          size="middle"
          className={classes.reportBtn}
        >
          Report
        </Button>
      </div>
    </Modal>
  );
};

export default ReportGroup;
