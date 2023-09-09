/**
 * A modal component for displaying connections based on various filters.
 * @param {string} type - The type of connections to display.
 * @param {boolean} open - Whether the modal is open or not.
 * @param {function} onSuccess - Callback function to be called when the modal is successfully closed.
 * @param {function} onClose - Callback function to be called when the modal is closed.
 * @param {object} value - The value object containing connection data.
 * @param {string} userType - The type of user.
 * @param {function} getConnectionList - Function to get the connection list.
 * @param {boolean} filters - Whether to display filters or not.
 * @returns The ConnectionModal component.
 */
import { Empty, InputNumber, Modal, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { filterValidObject } from "../../Shared/Utility";
import classes from "./Connection.module.css";
import { getCountylistService } from "../../Services/ApiService";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import _debounce from "lodash/debounce";
import { UserProfile } from "../../Components/Profile/Components/Utility";

const ConnectionModal = ({
  type,
  open,
  onSuccess,
  onClose,
  value,
  userType,
  getConnectionList,
  closeCall,
  filters,
}) => {
  const [LocationList, setLocationList] = useState([]);

  const { values, setFieldValue, resetForm, handleReset } = useFormik({
    initialValues: {
      location: "",
      gender: "",
      age: "",
    },
  });

  /**
   * Executes a side effect function to fetch the list of countries from the server and update the location list state.
   * This effect runs only once, when the component is mounted.
   * @returns None
   */
  useEffect(() => {
    getCountylistService()
      .then((res) => {
        setLocationList(res.data.country_list);
      })
      .catch(() => {});
  }, []);

  /**
   * Handles the submission of the age value.
   * @param {string} value - The value of the age input field.
   * @returns None
   */
  const HandleAgeSubmit = (value) => {
    if (value) {
      setFieldValue("age", parseInt(value));
      let finalValue = {
        ...values,
        age: parseInt(value),
      };
      getConnectionList(filterValidObject(finalValue));
    } else {
      setFieldValue("age", "");
      let finalValue = {
        ...values,
        age: "",
      };
      getConnectionList(filterValidObject(finalValue));
    }
  };

  const AgeProcess = useCallback(
    _debounce(HandleAgeSubmit, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Modal
      open={open}
      width={800}
      footer={[null]}
      onOk={() => {
        onSuccess();
      }}
      onCancel={() => {
        if (!closeCall) {
          getConnectionList(filterValidObject({}));
        }
        onClose();
      }}
    >
      <div className={classes.modalContainer}>
        {value?.filteredConnectionCount !== 0 ? (
          <h2>
            {type} - {value?.filteredConnectionCount}
          </h2>
        ) : (
          <h2>{type}</h2>
        )}
        {!filters && (
          <Row>
            <Col sm={6} className={classes.modalInput}>
              <Select
                className={`${classes.locationSec} locationSearch`}
                showSearch
                placeholder="Location"
                allowClear
                onClear={() => {
                  setFieldValue("location", "");
                  let finalValue = {
                    ...values,
                    location: "",
                  };
                  getConnectionList(filterValidObject(finalValue));
                }}
                onSelect={(value) => {
                  setFieldValue("location", value);
                  let finalValue = {
                    ...values,
                    location: value,
                  };
                  getConnectionList(filterValidObject(finalValue));
                }}
              >
                {LocationList.map((ele) => {
                  return (
                    <Select.Option key={ele.id} value={ele.name}>
                      {ele.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
            <Col sm={3} className={classes.modalInput}>
              <Select
                className={`${classes.locationSec} locationSearch`}
                showSearch
                placeholder="Gender"
                allowClear
                onClear={() => {
                  setFieldValue("gender", "");
                  let finalValue = {
                    ...values,
                    gender: "",
                  };
                  getConnectionList(filterValidObject(finalValue));
                }}
                onSelect={(val, { key }) => {
                  setFieldValue("gender", parseInt(key));
                  let finalValue = {
                    ...values,
                    gender: parseInt(key),
                  };
                  getConnectionList(filterValidObject(finalValue));
                }}
              >
                <Select.Option key={1} value={"Male"}>
                  Male
                </Select.Option>
                <Select.Option key={2} value={"Female"}>
                  Female
                </Select.Option>
              </Select>
            </Col>
            <Col sm={3}>
              <InputNumber
                min={1}
                className={`${classes.locationSec} locationSearch ${classes.ageSec}`}
                maxLength={2}
                defaultValue={values.age}
                placeholder="Age"
                onKeyDown={(e) => {
                  if (
                    !(
                      e.key === "Backspace" ||
                      e.key === "Delete" ||
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowRight"
                    )
                  ) {
                    if (e.key.match(/[0-9]/g)) {
                    } else {
                      e.preventDefault();
                    }
                  }
                }}
                onChange={(value) => {
                  // AgeProcess(value);
                  let finalValue = {
                    ...values,
                    age: value !== null ? parseInt(value) : undefined,
                  };
                  getConnectionList(filterValidObject(finalValue));
                }}
              />
            </Col>
          </Row>
        )}

        <div className={classes.listSec}>
          {value.filteredConnections?.map((ele) => {
            return (
              <UserProfile
                ele={ele}
                type={userType}
                className={classes.modalOthersIcon}
                getConnectionList={() => getConnectionList(values)}
              />
            );
          })}
        </div>
        {value.filteredConnections?.length === 0 && (
          <Empty description="No data found" />
        )}
      </div>
    </Modal>
  );
};

export default ConnectionModal;
