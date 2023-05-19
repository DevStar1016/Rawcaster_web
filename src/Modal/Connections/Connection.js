import { InputNumber, Modal, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { filterValidObject, handleProfileNavigate } from "../../Shared/Utility";
import classes from "./Connection.module.css";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useNuggets } from "../../Shared/Reduxfetcher";
import { getCountylistService } from "../../Services/ApiService";
import { Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import _debounce from "lodash/debounce";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { UserProfile } from "../../Components/Profile/Components/Utility";

const ConnectionModal = ({
  type,
  open,
  onSuccess,
  onClose,
  value,
  userType,
  getConnectionList,
}) => {
  const [LocationList, setLocationList] = useState([]);

  const { values, setFieldValue } = useFormik({
    initialValues: {
      location: "",
      gender: "",
      age: "",
    },
  });

  useEffect(() => {
    getCountylistService()
      .then((res) => {
        setLocationList(res.data.country_list);
      })
      .catch(() => {});
  }, []);

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
        onClose();
      }}
    >
      <div className={classes.modalContainer}>
        <h2>
          {type} - {value?.filteredConnectionCount}
        </h2>
        <Row>
          <Col sm={6}>
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
          <Col sm={3}>
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
              className={`${classes.locationSec} locationSearch`}
              maxLength={2}
              defaultValue={values.age}
              onChange={(value) => {
                AgeProcess(value);
              }}
            />
          </Col>
        </Row>

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
      </div>
    </Modal>
  );
};

export default ConnectionModal;
