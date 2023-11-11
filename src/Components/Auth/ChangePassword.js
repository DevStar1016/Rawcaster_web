/**
 * A React component that renders a form for changing the user's password.
 * @returns The ChangePassword component.
 */
import classes from "./ChangePassword.module.css";
import { Button, Form, Input } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata, getAuthToken } from "../../Shared/Utility";
import { changePasswordService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useState } from "react";

const validationSchema = yup.object().shape({
  old_password: yup
    .string()
    .trim("The Current Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "Current Password must be at least 8 characters long")
    .required("Please input your Current Password!"),
  new_password: yup
    .string()
    .trim("New Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "New Password must be at least 8 characters long")
    .required("Please input your New Password!"),
  confirm_password: yup
    .string()
    .trim("The Confirm Password cannot include leading and trailing spaces")
    .strict(true)
    .min(8, "Confirm Password must be at least 8 characters long")
    .oneOf(
      [yup.ref("new_password"), null],
      "New Password and Confirm Password must match"
    )
    .required("Please input your Confirm Password!"),
});

const ChangePassword = () => {
  const token = useAuthToken();
  const [form] = Form.useForm();
  const [isDisable, setisDisable] = useState(false);
  const {
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    resetForm,
    setFieldError,
  } = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: (val) => {
      handleChangePassword(val);
    },
  });

  /**
   * Handles the change password functionality.
   * @param {object} value - The new password value.
   * @returns None
   */

  const handleChangePassword = (value) => {
    setisDisable(true);
    let finalData = {
      ...value,
      token: token,
      auth_code: getAuthToken(token),
    };
    changePasswordService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          resetForm();
          form.resetFields();
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else {
          setFieldError("old_password", res.data.msg);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisDisable(false);
      });
  };

  return (
    <div className={classes.chgPassword}>
      <Form
        form={form}
        name="change_password"
        className="rawcaster_change_password"
        onSubmitCapture={handleSubmit}
      >
        <p className={classes.labeltxt}>Current Password</p>
        <Form.Item
          name="old_password"
          colon={false}
          className={classes.labeltxt}
        >
          <Input.Password
            size="large"
            className={classes.textbox}
            value={values.old_password}
            onChange={handleChange("old_password")}
            autoComplete="new-password"
            maxLength={50}
            status={touched.old_password && errors.old_password ? "error" : ""}
          />
          {touched.old_password && (
            <p className="ErrTxt">{errors?.old_password}</p>
          )}
        </Form.Item>
        <p className={classes.labeltxt}>New Password</p>
        <Form.Item name="new_password" className={classes.labeltxt}>
          <Input.Password
            size="large"
            className={classes.textbox}
            value={values.new_password}
            autoComplete="new-password"
            onChange={handleChange("new_password")}
            status={touched.new_password && errors.new_password ? "error" : ""}
          />
          {touched.new_password && (
            <p className="ErrTxt">{errors?.new_password}</p>
          )}
        </Form.Item>
        <p className={classes.labeltxt}>Confirm Password</p>
        <Form.Item name="confirm_password" className={classes.labeltxt}>
          <Input.Password
            size="large"
            className={classes.textbox}
            value={values.confirm_password}
            autoComplete="new-password"
            onChange={handleChange("confirm_password")}
            status={
              touched.confirm_password && errors.confirm_password ? "error" : ""
            }
          />
          {touched.confirm_password && (
            <p className="ErrTxt">{errors?.confirm_password}</p>
          )}
        </Form.Item>
        <Form.Item>
          <div className={classes.agreeTxt}>
            We recommend your password to be at least 8 characters long, contain
            uppercase letter(A-Z),lowercase letter (a-z), symbol(!@#$%) and a
            number (0-9).
          </div>
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            block
            htmlType="submit"
            className={classes.savebtn}
            disabled={isDisable}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
