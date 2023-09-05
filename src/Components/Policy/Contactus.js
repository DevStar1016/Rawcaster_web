/**
 * A React component that renders a contact form for users to submit their inquiries, bug reports,
 * feedback, and feature requests. The form includes fields for the user's name, email address,
 * subject, and message. Upon submission, the form data is sent to the server using the contactusService
 * function from the ApiService module. The form data is validated using the yup validation schema.
 * If the submission is successful, a success message is displayed using the toast component from the
 * react-hot-toast library. If there is an error, an error message is displayed. The form also includes
 * error messages for each field if they are not filled out correctly. The form is styled using CSS
 * modules.
 * @returns
 */

import { Form, Input, Button } from "antd";
import classes from "./Contactus.module.css";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAuthToken, JSONtoformdata } from "../../Shared/Utility";
import { contactusService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { handleLoading } from "../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";

const validationSchema = yup.object().shape({
  name: yup.string().required(`Please input your Name!`),
  email_id: yup
    .string()
    .email("The input is not valid E-mail!")
    .required(`Please input your Email Address!`),
  subject: yup.string().required(`Please input your Subject!`),
  message: yup.string().required(`Please input your Message!`),
});

const Contactus = () => {
  const dispatch = useDispatch();
  const { values, touched, errors, handleChange, handleSubmit, resetForm } =
    useFormik({
      initialValues: {
        name: "",
        email_id: "",
        subject: "",
        message: "",
      },
      validationSchema,
      onSubmit: (values) => {
        ContactusSubmit(values);
      },
    });

  /**
   * Submits a contact form with the provided values.
   * @param {object} values - The values of the contact form fields.
   * @returns None
   */
  const ContactusSubmit = (values) => {
    dispatch(handleLoading(true));
    let contactValue = {
      ...values,
      auth_code: getAuthToken(values.email_id),
    };
    contactusService(JSONtoformdata(contactValue))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          resetForm();
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(handleLoading(false));
      });
  };

  return (
    <div className={classes.contactBg}>
      <div className="bodycontentdiv">
        <h1 className={classes.heading_h1}>How can we help?</h1>
        <p className={classes.subhead}>
          Questions, bug reports, feedback, feature requests – we’re here for it
          all.<br></br>Visit our{" "}
          <span>
            <Link to="/faq">FAQ</Link>
          </span>{" "}
          page for instant help
        </p>

        <div className={classes.contactBox}>
          <Form name="normal_login" className="login-form">
            <p className={classes.label}>Full Name</p>
            <Form.Item name="name">
              <Input
                className={classes.textBox}
                placeholder="Full Name"
                value={values.name}
                onChange={handleChange("name")}
                status={touched.name && errors.name ? "error" : ""}
                maxLength={50}
                autoComplete="off"
              />
              {touched.name && <p className="ErrTxt">{errors?.name}</p>}
            </Form.Item>

            <p className={classes.label}>Email Address</p>
            <Form.Item name="email_id">
              <Input
                className={classes.textBox}
                placeholder="Email Address"
                value={values.email_id}
                onChange={handleChange("email_id")}
                status={touched.email_id && errors.email_id ? "error" : ""}
                maxLength={50}
                autoComplete="off"
              />
              {touched.email_id && <p className="ErrTxt">{errors?.email_id}</p>}
            </Form.Item>

            <p className={classes.label}>Subject</p>
            <Form.Item name="subject">
              <Input
                className={classes.textBox}
                placeholder="Subject"
                value={values.subject}
                onChange={handleChange("subject")}
                status={touched.subject && errors.subject ? "error" : ""}
                maxLength={50}
                autoComplete="off"
              />
              {touched.subject && <p className="ErrTxt">{errors?.subject}</p>}
            </Form.Item>

            <p className={classes.label}>Message</p>
            <Form.Item name="message">
              <Input.TextArea
                className={`${classes.textBox} ${classes.textarea}`}
                placeholder="Message"
                value={values.message}
                onChange={handleChange("message")}
                status={touched.message && errors.message ? "error" : ""}
                maxLength={50}
                autoComplete="off"
              />
              {touched.message && <p className="ErrTxt">{errors?.message}</p>}
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                className={classes.btn}
                onClickCapture={() => {
                  handleSubmit();
                }}
              >
                SUBMIT REQUEST
              </Button>
            </Form.Item>
          </Form>
          {/* <Recaptcha
          ref={(ref) => (recaptcha = ref)}
          sitekey={utility.Recaptcha_sitekey}
          onResolved={onResolvedHandler}
        /> */}
        </div>
      </div>
    </div>
  );
};

export default Contactus;
