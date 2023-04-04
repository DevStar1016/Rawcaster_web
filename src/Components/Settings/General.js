import { Button, Radio, Select } from "antd";
import React, { useState } from "react";
import classes from "./Settings.module.css";
import { useAuth } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";

const General = () => {
  let loadingArr = [];
  const [accountStatus, setAccountStatus] = useState(1);
  const { userSettings, loginUserData } = useAuth();
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
            {/* {userSettings && (
          <Antselect
            defaultValue={userSettings.mobile_default_page}
            showSearch
            className={classes.selectBox}
            placeholder="Select Group"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            loading={loadingArr.includes(13)}
            disabled={loadingArr.includes(13)}
          >
            <Option key="defaultpage1" value={1}>
              Nugget
            </Option>
            <Option key="defaultpage2" value={2}>
              Event
            </Option>
            <Option key="defaultpage3" value={3}>
              Chat
            </Option>
          </Antselect>
        )} */}
          </div>
          <div>
            <p className={classes.smallheading}>Phone </p>

            <Radio.Group
              defaultValue={userSettings?.phone_display_status}
              className={classes.online_status}
            >
              <Radio
                className={
                  (userSettings?.phone_display_status === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
              >
                Don’t Show
              </Radio>
              <Radio
                className={
                  userSettings?.phone_display_status === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.phone_display_status === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
              >
                Connections Only
              </Radio>

              <Radio
                className={
                  userSettings?.phone_display_status === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
              >
                Specific Group
              </Radio>
            </Radio.Group>
            {userSettings?.phone_display_status === 3 ? (
              <>
                {/* <Antselect
                mode="multiple"
                style={{ width: "20%", minWidth: "200px" }}
                placeholder="Search to group"
                value={phoneGroupList}
                // defaultValue={phoneGroupList}
                onChange={(val) => {
                  if (val !== null) setPhoneGroupList(val);
                  else setPhoneGroupList([]);
                }}
                loading={loadingArr.includes(16)}
                disabled={loadingArr.includes(16)}
                optionLabelProp="label"
                optionFilterProp="label"
              >
                {groupList.map(function (opt) {
                  return (
                    <Option
                      key={opt.group_id + "group"}
                      value={opt.group_id}
                      label={utility.decodeHtml(opt.group_name)}
                    >
                      <div
                        className="friends"
                        style={{
                          position: "relative",
                          padding: "10px 0px",
                        }}
                      >
                        <img
                          src={opt.group_icon}
                          alt="groupImg"
                          style={{ borderRadius: "16px" }}
                          width="32px"
                          height="32px"
                        ></img>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            marginLeft: "10px",
                          }}
                        >
                          {utility.decodeHtml(opt.group_name)}
                        </span>
                      </div>
                    </Option>
                  );
                })}
              </Antselect> */}
                <Button
                  className={classes.savebutton}
                  // onClick={() => {
                  //   GroupUpdateHandler(16, "phone_display_status", phoneGroupList);
                  // }}
                  loading={loadingArr.includes(16)}
                  disabled={loadingArr.includes(16)}
                >
                  Save
                </Button>
              </>
            ) : null}
          </div>
          <div>
            <p className={classes.smallheading}>Location </p>

            <Radio.Group
              defaultValue={userSettings?.location_display_status}
              className={classes.online_status}
              loading={loadingArr.includes(17)}
            >
              <Radio
                className={
                  (userSettings?.location_display_status === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(17)}
              >
                Don’t Show
              </Radio>
              <Radio
                className={
                  userSettings?.location_display_status === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(17)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.location_display_status === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(17)}
              >
                Connections Only
              </Radio>

              <Radio
                className={
                  userSettings?.location_display_status === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(17)}
              >
                Specific Group
              </Radio>
            </Radio.Group>
            {/* {userSettings.location_display_status === 3 ? (
            <>
              <Antselect
                mode="multiple"
                style={{ width: "20%", minWidth: "200px" }}
                placeholder="Search to group"
                value={locationGroupList}
                // defaultValue={locationGroupList}
                onChange={(val) => {
                  if (val !== null) setLocationGroupList(val);
                  else setLocationGroupList([]);
                }}
                loading={loadingArr.includes(18)}
                disabled={loadingArr.includes(18)}
                optionLabelProp="label"
                optionFilterProp="label"
              >
                {groupList.map(function (opt) {
                  return (
                    <Option
                      key={opt.group_id + "groupList2"}
                      value={opt.group_id}
                      label={utility.decodeHtml(opt.group_name)}
                    >
                      <div
                        className="friends"
                        style={{
                          position: "relative",
                          padding: "10px 0px",
                        }}
                      >
                        <img
                          src={opt.group_icon}
                          alt="groupImg"
                          style={{ borderRadius: "16px" }}
                          width="32px"
                          height="32px"
                        ></img>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            marginLeft: "10px",
                          }}
                        >
                          {utility.decodeHtml(opt.group_name)}
                        </span>
                      </div>
                    </Option>
                  );
                })}
              </Antselect>
              <Button
                className={classes.savebutton}
                onClick={() => {
                  GroupUpdateHandler(
                    18,
                    "location_display_status",
                    locationGroupList
                  );
                }}
                loading={loadingArr.includes(18)}
                disabled={loadingArr.includes(18)}
              >
                Save
              </Button>
            </>
          ) : null} */}
          </div>
          <div>
            <p className={classes.smallheading}>DOB </p>

            <Radio.Group
              defaultValue={userSettings?.dob_display_status}
              className={classes.online_status}
              loading={loadingArr.includes(19)}
            >
              <Radio
                className={
                  (userSettings?.dob_display_status === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(19)}
              >
                Don’t Show
              </Radio>
              <Radio
                className={
                  userSettings?.dob_display_status === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(19)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.dob_display_status === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(19)}
              >
                Connections Only
              </Radio>

              <Radio
                className={
                  userSettings?.dob_display_status === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(19)}
              >
                Specific Group
              </Radio>
            </Radio.Group>
          </div>
          <div>
            <p className={classes.smallheading}>Bio Data </p>

            <Radio.Group
              defaultValue={userSettings.bio_display_status}
              className={classes.online_status}
              loading={loadingArr.includes(21)}
            >
              <Radio
                className={
                  (userSettings?.bio_display_status === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(21)}
              >
                Don’t Show
              </Radio>
              <Radio
                className={
                  userSettings?.bio_display_status === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(21)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.bio_display_status === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(21)}
              >
                Connections Only
              </Radio>

              <Radio
                className={
                  userSettings?.bio_display_status === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(21)}
              >
                Specific Group
              </Radio>
            </Radio.Group>
          </div>

          <div>
            <p className={classes.smallheading}>Online Status</p>

            <Radio.Group
              defaultValue={userSettings?.online_status}
              // value={userSettings.online_status}
              className={classes.online_status}
              loading={loadingArr.includes(4)}
            >
              <Radio
                className={
                  (userSettings?.online_status === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(4)}
              >
                Don’t Show
              </Radio>
              <Radio
                className={
                  userSettings?.online_status === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(4)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.online_status === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(4)}
              >
                Connections Only
              </Radio>

              <Radio
                className={
                  userSettings?.online_status === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(4)}
              >
                Specific Group
              </Radio>
            </Radio.Group>

            {/* {userSettings.online_status === 3 ? (
          <>
            <Antselect
              mode="multiple"
              style={{ width: "20%", minWidth: "200px" }}
              placeholder="Select Group"
              value={onlineGroupList}
              // defaultValue={onlineGroupList}

              loading={loadingArr.includes(14)}
              disabled={loadingArr.includes(14)}
              optionLabelProp="label"
              optionFilterProp="label"
            >
              {groupList.map(function (opt) {
                return (
                  <Option
                    key={opt.group_id}
                    value={opt.group_id}
                    label={utility.decodeHtml(opt.group_name)}
                  >
                    <div
                      className="friends"
                      style={{
                        position: "relative",
                        padding: "10px 0px",
                      }}
                    >
                      <img
                        src={opt.group_icon}
                        alt="groupImg"
                        style={{ borderRadius: "16px" }}
                        width="32px"
                        height="32px"
                      ></img>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "10px",
                        }}
                      >
                        {utility.decodeHtml(opt.group_name)}
                      </span>
                    </div>
                  </Option>
                );
              })}
            </Antselect>
            <Button
              className={classes.savebutton}
              loading={loadingArr.includes(14)}
              disabled={loadingArr.includes(14)}
            >
              Save
            </Button>
          </>
        ) : null} */}
          </div>

          <div>
            <p className={classes.smallheading}>Nugget Display Option</p>

            <Radio.Group
              defaultValue={userSettings?.public_nugget_display}
              className={classes.online_status}
              loading={loadingArr.includes(26)}
            >
              <Radio
                className={
                  (userSettings?.public_nugget_display === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(26)}
              >
                Rawcaster
              </Radio>
              <Radio
                className={
                  userSettings?.public_nugget_display === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(26)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.public_nugget_display === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(26)}
              >
                All Connections
              </Radio>

              <Radio
                className={
                  userSettings?.public_nugget_display === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(26)}
              >
                Specific Connections
              </Radio>
              <Radio
                className={
                  userSettings?.public_nugget_display === 4
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={4}
                key={4}
                disabled={loadingArr.includes(26)}
              >
                All Groups
              </Radio>

              <Radio
                className={
                  userSettings?.public_nugget_display === 5
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={5}
                key={5}
                disabled={loadingArr.includes(26)}
              >
                Specific Group
              </Radio>
              <Radio
                className={
                  userSettings?.public_nugget_display === 6
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={6}
                key={6}
                disabled={loadingArr.includes(26)}
              >
                My Influencers
              </Radio>

              <Radio
                className={
                  userSettings?.public_nugget_display === 7
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={7}
                key={7}
                disabled={loadingArr.includes(26)}
              >
                Mine Only
              </Radio>
            </Radio.Group>
          </div>

          <div>
            <p className={classes.smallheading}>Event Display Option</p>

            <Radio.Group
              defaultValue={userSettings?.public_event_display}
              className={classes.online_status}
              loading={loadingArr.includes(27)}
            >
              <Radio
                className={
                  (userSettings?.public_event_display === 0
                    ? classes.radio_active
                    : null) +
                  " " +
                  classes.radio_inactive
                }
                value={0}
                key={0}
                disabled={loadingArr.includes(27)}
              >
                Rawcaster
              </Radio>
              <Radio
                className={
                  userSettings?.public_event_display === 1
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={1}
                key={1}
                disabled={loadingArr.includes(27)}
              >
                Public
              </Radio>
              <Radio
                className={
                  userSettings?.public_event_display === 2
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={2}
                key={2}
                disabled={loadingArr.includes(27)}
              >
                All Connections
              </Radio>

              <Radio
                className={
                  userSettings?.public_event_display === 3
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={3}
                key={3}
                disabled={loadingArr.includes(27)}
              >
                Specific Connections
              </Radio>
              <Radio
                className={
                  userSettings?.public_event_display === 4
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={4}
                key={4}
                disabled={loadingArr.includes(27)}
              >
                All Groups
              </Radio>

              <Radio
                className={
                  userSettings.public_event_display === 5
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={5}
                key={5}
                disabled={loadingArr.includes(27)}
              >
                Specific Group
              </Radio>
              <Radio
                className={
                  userSettings.public_event_display === 6
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={6}
                key={6}
                disabled={loadingArr.includes(27)}
              >
                My Influencers
              </Radio>

              <Radio
                className={
                  userSettings.public_event_display === 7
                    ? classes.radio_active
                    : null + " " + classes.radio_inactive
                }
                value={7}
                key={7}
                disabled={loadingArr.includes(27)}
              >
                Mine Only
              </Radio>
            </Radio.Group>
          </div>

          <div>
            <p className={classes.smallheading}>Preference Language</p>
            <Select
              showSearch
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
            {/* {languageList && userSettings && (
          <Antselect
            defaultValue={userSettings.language_id}
            showSearch
            className={classes.selectBox}
            placeholder="Select Group"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            loading={loadingArr.includes(10)}
            disabled={loadingArr.includes(10)}
          >
            {languageList.map(function (opt) {
              return (
                <Option key={"language" + opt.id} value={opt.id}>
                  {opt.name}
                </Option>
              );
            })}
          </Antselect>
        )} */}
          </div>
          <div>
            <p className={classes.smallheading}>Timezone</p>
            <Select
              showSearch
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
            {/* {userSettings && (
          <Antselect
            defaultValue={userSettings.default_date_format}
            showSearch
            className={classes.selectBox}
            placeholder="Select Group"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            loading={loadingArr.includes(12)}
            disabled={loadingArr.includes(12)}
          >
            <Option key="date1" value="MM/DD/YYYY">
              MM/DD/YYYY
            </Option>
            <Option key="date2" value="DD/MM/YYYY">
              DD/MM/YYYY
            </Option>
            <Option key="date3" value="DD-MM-YYYY">
              DD-MM-YYYY
            </Option>
          </Antselect>
        )} */}
          </div>

          <div>
            <p className={classes.smallheading}>Rawcaster Account </p>

            <Radio.Group
              defaultValue={accountStatus}
              value={accountStatus}
              className={classes.online_status}
              // onChange={(e) => {
              //   if (e.target.value == 0) {
              //     setAccountInactiveModal(true);
              //   } else {
              //     onChangeNotificationHandler(25, e.target.value);
              //   }
              // }}
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
                disabled={loadingArr.includes(25)}
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
                disabled={loadingArr.includes(25)}
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
