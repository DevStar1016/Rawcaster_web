import { Radio, Select } from "antd";
import React, { useState } from "react";
import classes from "./Settings.module.css";
import { useAuth } from "../../Shared/Reduxfetcher";

let primaryShare = [
  "Don’t Show",
  "Public",
  "Connections Only",
  "Specific Group",
];

let secondaryShare = [
  "Rawcaster",
  "Public",
  "All Connections",
  "Specific Connections",
  "All Groups",
  "Specific Group",
  "My Influencers",
  "Mine Only",
];

const General = () => {
  let loadingArr = [];
  const [accountStatus, setAccountStatus] = useState(1);
  const { userSettings, loginUserData } = useAuth();

  const SettingsList = [
    {
      title: "Phone",
      value: userSettings?.phone_display_status,
      radioValue: primaryShare,
    },
    {
      title: "Location",
      value: userSettings?.location_display_status,
      radioValue: primaryShare,
    },
    {
      title: "DOB",
      value: userSettings?.dob_display_status,
      radioValue: primaryShare,
    },
    {
      title: "Bio Data",
      value: userSettings?.bio_display_status,
      radioValue: primaryShare,
    },
    {
      title: "Online Status",
      value: userSettings?.online_status,
      radioValue: primaryShare,
    },
    {
      title: "Nugget Display Option",
      value: userSettings?.public_nugget_display,
      radioValue: secondaryShare,
    },
    {
      title: "Event Display Option",
      value: userSettings?.public_event_display,
      radioValue: secondaryShare,
    },
  ];

  return (
    <div className={classes.contentSec} style={{ display: "block" }}>
      <h1>General</h1>

      {loginUserData && (
        <>
          <div>
            <p>
              <span className={classes.smallheading}>User Status : </span>
              <span>{loginUserData.user_status || ""}</span>
            </p>
          </div>
          <div>
            <p>
              <span className={classes.smallheading}>User Type : </span>
              <span>{loginUserData.user_type || ""}</span>
            </p>
          </div>
        </>
      )}
      {userSettings && (
        <>
          <div>
            <p className={classes.smallheading}>Default Rawcaster page</p>
            <Select
              showSearch
              className="my-2"
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Nugget",
                },
                {
                  value: "2",
                  label: "Event",
                },
                {
                  value: "3",
                  label: "Chat",
                },
              ]}
            />
          </div>
          {SettingsList.map((ele) => {
            return (
              <div>
                <p className={classes.smallheading}>{ele.title} </p>
                <Radio.Group
                  defaultValue={ele.value}
                  className={classes.online_status}
                >
                  {ele.radioValue.map((elem, index) => {
                    return (
                      <Radio
                        className={
                          (ele.value === index ? classes.radio_active : null) +
                          " " +
                          classes.radio_inactive
                        }
                        value={index}
                        key={index}
                      >
                        {elem}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            );
          })}

          <div>
            <p className={classes.smallheading}>Preference Language</p>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              className="my-2"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Not Identified",
                },
                {
                  value: "2",
                  label: "Closed",
                },
                {
                  value: "3",
                  label: "Communicated",
                },
                {
                  value: "4",
                  label: "Identified",
                },
                {
                  value: "5",
                  label: "Resolved",
                },
                {
                  value: "6",
                  label: "Cancelled",
                },
              ]}
            />
          </div>
          <div>
            <p className={classes.smallheading}>Timezone</p>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              className="my-2"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "Not Identified",
                },
                {
                  value: "2",
                  label: "Closed",
                },
                {
                  value: "3",
                  label: "Communicated",
                },
                {
                  value: "4",
                  label: "Identified",
                },
                {
                  value: "5",
                  label: "Resolved",
                },
                {
                  value: "6",
                  label: "Cancelled",
                },
              ]}
            />
            {/* {timezoneList && userSettings && (
            <Antselect
              defaultValue={userSettings.time_zone}
              showSearch
              className={classes.selectBox}
              placeholder="Select Group"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
              onChange={(val) => {
                onChangeNotificationHandler(11, val);
              }}
              loading={loadingArr.includes(11)}
              disabled={loadingArr.includes(11)}
            >
              {timezoneList.map(function (opt, index) {
                return (
                  <Option key={"timezone" + index} value={opt.name}>
                    {opt.name.replace("_", " ")}
                  </Option>
                );
              })}
            </Antselect>
          )} */}
          </div>

          <div>
            <p className={classes.smallheading}>Date Format</p>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              className="my-2"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={[
                {
                  value: "1",
                  label: "MM/DD/YYYY",
                },
                {
                  value: "2",
                  label: "DD/MM/YYYY",
                },
                {
                  value: "3",
                  label: "DD-MM-YYYY",
                },
              ]}
            />
          </div>

          <div>
            <p className={classes.smallheading}>Rawcaster Account </p>
            <Radio.Group
              defaultValue={accountStatus}
              value={accountStatus}
              className={classes.online_status}
              loading={loadingArr.includes(25)}
            >
              <Radio
                className={
                  (accountStatus == 0 ? classes.radio_active : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
              >
                Inactive
              </Radio>
              <Radio
                className={
                  accountStatus == 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
              >
                Active
              </Radio>
            </Radio.Group>
          </div>
        </>
      )}
    </div>
  );
};

export default General;
