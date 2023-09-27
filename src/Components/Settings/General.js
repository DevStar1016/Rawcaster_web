/**
 * A React functional component that represents the General settings page.
 * This component displays various settings related to the user's account and allows them to make changes.
 * @returns {JSX.Element} The rendered General component.
 */
import { Button, Modal, Radio, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import { useAuth, useDashboard } from "../../Shared/Reduxfetcher";
import { getTimeZone, getlanguagelist } from "../../Shared/DropdownApis";
import { useSettingsContext } from "../../Shared/Context";
import {
  AccountStatus,
  DateTypeFormats,
  DefaultRawcasterPage,
  ProfileswitchTypes,
  SettingsList,
} from "./Constants";
import { findValidDisplayAccentData, getValidDisplayData } from "./Utility";
import { decodeHtml } from "../../Shared/Utility";
import {
  defaultGroupImg,
  defaultprofileImg,
} from "../../Shared/CommonConstants";
import { useDispatch } from "react-redux";
import {
  handleRemoveReadoutURL,
  handleRemoveTranslate,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import { toast } from "react-hot-toast";

const General = () => {
  const {
    formikvalues,
    setFieldValue,
    setupdateValue,
    updateValue,
    setValues,
    handleupdate,
  } = useSettingsContext();
  const dispatch = useDispatch();
  const [isDropdownSaveEnabled, setisDropdownSaveEnabled] = useState(false);
  const { loginUserData, userSettings } = useAuth();
  const { groupsList, friendsList } = useDashboard();
  const [TimeZones, setTimeZones] = useState([]);
  const [LanguagesList, setLanguagesList] = useState({
    default: [],
    read_out: [],
  });

  /**
   * Executes the specified effect function after the component has rendered.
   * The effect function retrieves the user's time zone and language list using
   * asynchronous API calls. Once both API calls have resolved, the retrieved
   * data is used to update the component's state variables `timeZones` and
   * `languagesList`.
   * @returns None
   */
  useEffect(() => {
    Promise.all([getTimeZone(), getlanguagelist()]).then((res) => {
      setTimeZones(res[0]);
      setLanguagesList(res[1]);
    });
  }, []);

  /**
   * Handles the update of a group list in a service.
   * @param {string} key - The key of the profile field being updated.
   * @param {any} value - The new value of the group list.
   * @param {string} type - The type of the group list (e.g. "connection" or "group").
   * @returns None
   */
  const handleGroupListUpdateService = (key, value, type) => {
    if (value?.length > 0) {
      let finalData = {
        profile_field_name: key,
        [key]: type,
        groupid: JSON.stringify(value),
      };
      setValues((pre) => ({
        ...pre,
        ...finalData,
      }));
      handleupdate(finalData);
    } else {
      toast.remove("rawcaster");
      toast.error(
        `please select atleast one ${type === 3 ? "connection" : "group"}`,
        { id: "rawcaster" }
      );
    }
  };

  /**
   * Removes duplicate elements from an array based on a specific property.
   * @param {Array} data - The array to remove duplicates from.
   * @returns {Array} - A new array with duplicate elements removed.
   */
  function RemoveDuplicates(data) {
    // Create a Set to store unique objects
    let uniqueId = [];

    const uniqueArray = data?.filter((ele) => {
      if (uniqueId?.includes(ele?.id)) {
        uniqueId = [...uniqueId, ele?.id];

        return undefined;
      }
      uniqueId = [...uniqueId, ele?.id];
      return ele;
    });
    return uniqueArray;
    // Use filter to iterate through the data and add unique objects to the Set
  }

  const CheckValuesIsValid = (value) => {
    try {
      const val = JSON.parse(value);
      return val.length !== 0;
    } catch (err) {
      return value.length !== 0;
    }
  };

  const getAccentData = (
    read_out_language_id = formikvalues.read_out_language_id
  ) => {
    return findValidDisplayAccentData(
      LanguagesList.read_out,
      read_out_language_id
    );
  };

  return (
    <div>
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

      {formikvalues && (
        <>
          <div>
            <p className={classes.smallheading}>Default Rawcaster page</p>
            <Select
              showSearch
              className={`my-2 ${classes.SelectSec} settingsSelect`}
              value={getValidDisplayData(
                DefaultRawcasterPage,
                formikvalues.mobile_default_page
              )}
              style={{ width: 200 }}
              placeholder="Search Default Rawcaster page"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={DefaultRawcasterPage}
              onChange={(val) => {
                setupdateValue("mobile_default_page", parseInt(val));
              }}
              disabled={
                updateValue.includes("mobile_default_page") ||
                userSettings?.account_active_inactive === 0
              }
            />
          </div>
          {SettingsList.map((ele) => {
            const getGroupList = () => {
              const filteredData = groupsList.filter((elem) =>
                formikvalues[ele.groupkeyword]?.includes(elem.group_id)
              );
              return filteredData.map((ele) => ele.group_id);
            };
            const getFriendList = () => {
              const filteredData = friendsList.filter((elem) =>
                formikvalues[ele.groupkeyword]?.includes(elem.user_id)
              );

              return filteredData.map((ele) => ele.user_id);
            };

            return (
              <>
                <div>
                  <p className={classes.smallheading}>{ele.title} </p>
                  <Radio.Group
                    defaultValue={formikvalues[ele.keyword]}
                    className={classes.online_status}
                    onChange={(e) => {
                      if (
                        userSettings[ele.groupkeyword]?.length !== 0 &&
                        e.target.value === ele.groupid
                      ) {
                        setFieldValue(
                          [ele.groupkeyword],
                          userSettings[ele.groupkeyword]
                        );
                      } else if (
                        userSettings[ele.groupkeyword]?.length !== 0 &&
                        e.target.value === ele.friendid
                      ) {
                        setFieldValue(
                          [ele.groupkeyword],
                          userSettings[ele.groupkeyword]
                        );
                      } else {
                        setFieldValue([ele.groupkeyword], []);
                      }
                      if (
                        e.target.value === ele.groupid ||
                        e.target.value === ele.friendid
                      ) {
                        setFieldValue([ele.keyword], parseInt(e.target.value));
                      } else {
                        setupdateValue(ele.keyword, e.target.value);
                      }
                    }}
                    disabled={
                      updateValue.includes(ele.keyword) ||
                      userSettings?.account_active_inactive === 0
                    }
                  >
                    {ele.radioValue.map((elem, index) => {
                      return (
                        <Radio
                          className={
                            (formikvalues[ele.keyword] === index
                              ? classes.radio_active
                              : null) +
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
                {formikvalues[ele.keyword] === ele.groupid ? (
                  <>
                    <Select
                      mode="multiple"
                      maxTagCount={"responsive"}
                      className={classes.connectionselectBox}
                      placeholder="Search group"
                      value={getGroupList()}
                      onChange={(val) => {
                        setisDropdownSaveEnabled(true);
                        setFieldValue([ele.groupkeyword], val);
                      }}
                      optionLabelProp="label"
                      optionFilterProp="label"
                      loading={updateValue.includes(ele.keyword)}
                    >
                      {groupsList.map(function (opt) {
                        return (
                          <Select.Option
                            key={opt.group_id + "group"}
                            value={opt.group_id}
                            label={decodeHtml(opt.group_name)}
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
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = defaultGroupImg;
                                }}
                              ></img>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  marginLeft: "10px",
                                }}
                              >
                                {decodeHtml(opt.group_name)}
                              </span>
                            </div>
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <Button
                      className={classes.savebutton}
                      disabled={
                        updateValue.includes(ele.keyword) ||
                        !isDropdownSaveEnabled ||
                        !CheckValuesIsValid(formikvalues[ele.groupkeyword])
                      }
                      onClick={() => {
                        if (
                          CheckValuesIsValid(formikvalues[ele.groupkeyword])
                        ) {
                          handleGroupListUpdateService(
                            ele.keyword,
                            formikvalues[ele.groupkeyword],
                            ele?.keyword === "public_nugget_display" ||
                              ele?.keyword === "public_event_display"
                              ? 5
                              : 3
                          );
                          setisDropdownSaveEnabled(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                  </>
                ) : null}
                {formikvalues[ele.keyword] === ele.friendid ? (
                  <>
                    <Select
                      mode="multiple"
                      maxTagCount={"responsive"}
                      className={classes.connectionselectBox}
                      placeholder="Search Connection"
                      value={getFriendList()}
                      onChange={(val) => {
                        setisDropdownSaveEnabled(true);
                        setFieldValue([ele.groupkeyword], val);
                      }}
                      optionLabelProp="label"
                      optionFilterProp="label"
                      loading={updateValue.includes(ele.keyword)}
                    >
                      {friendsList.map(function (opt) {
                        return (
                          <Select.Option
                            key={opt.user_id + "friend"}
                            value={opt.user_id}
                            label={decodeHtml(opt.display_name)}
                          >
                            <div
                              className="friends"
                              style={{
                                position: "relative",
                                padding: "10px 0px",
                              }}
                            >
                              <img
                                src={opt.profile_img ? opt.profile_img : ""}
                                alt="groupImg"
                                style={{ borderRadius: "16px" }}
                                width="32px"
                                height="32px"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = defaultprofileImg;
                                }}
                              ></img>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  marginLeft: "10px",
                                }}
                              >
                                {decodeHtml(opt.display_name)}
                              </span>
                            </div>
                          </Select.Option>
                        );
                      })}
                    </Select>
                    <Button
                      className={classes.savebutton}
                      disabled={
                        updateValue.includes(ele.keyword) ||
                        !isDropdownSaveEnabled ||
                        !CheckValuesIsValid(formikvalues[ele.groupkeyword])
                      }
                      onClick={() => {
                        if (
                          CheckValuesIsValid(formikvalues[ele.groupkeyword])
                        ) {
                          handleGroupListUpdateService(
                            ele.keyword,
                            formikvalues[ele.groupkeyword],
                            3
                          );
                          setisDropdownSaveEnabled(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                  </>
                ) : null}
              </>
            );
          })}

          <div>
            <p className={classes.smallheading}>Profile Privacy</p>
            <p className={classes.text}>
              Choose if you want to lock your Nuggets, Fans, Connections and
              Influencers list from other users
            </p>
            <div className={`mt-2 ${classes.linespace}`}>
              {ProfileswitchTypes.map((elem, i) => {
                return (
                  <div className={classes.grp_switch}>
                    <Switch
                      size="small"
                      checked={formikvalues[elem.type] === 1}
                      disabled={
                        updateValue.includes(elem.type) ||
                        userSettings?.account_active_inactive === 0
                      }
                      loading={updateValue.includes(elem.type)}
                      onChange={(e) => {
                        setupdateValue(elem.type, e ? 1 : 0);
                      }}
                    />
                    {elem?.title}
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div>
            <p className={classes.smallheading}>Preference Language</p>
            <Select
              showSearch
              style={{ width: 200 }}
              className={`mt-2 ${classes.SelectSec} settingsSelect`}
              placeholder="Search Preference Language"
              optionFilterProp="children"
              value={getValidDisplayData(
                LanguagesList.default,
                formikvalues.language_id,
                "id"
              )}
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={LanguagesList.default}
              onChange={(_, { id }) => {
                setupdateValue("language_id", id);
              }}
              disabled={
                updateValue.includes("language_id") ||
                userSettings?.account_active_inactive === 0
              }
            />
          </div> */}
          <div className="d-flex flex-row">
            <div>
              <p className={classes.smallheading}>Translation Language</p>
              <Select
                showSearch
                style={{ width: 200 }}
                className={`mt-2 ${classes.SelectSec} settingsSelect`}
                placeholder="Search Translation Language"
                optionFilterProp="children"
                value={getValidDisplayData(
                  LanguagesList.read_out,
                  formikvalues.read_out_language_id,
                  "id"
                )}
                filterOption={(input, option) =>
                  (option?.label?.toLowerCase() ?? "").includes(
                    input?.toLowerCase()
                  )
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={RemoveDuplicates(LanguagesList.read_out)}
                onChange={(_, { id }) => {
                  const GetAccentList = getAccentData(id);
                  if (GetAccentList && GetAccentList.length !== 0) {
                    setupdateValue(
                      "add_multiple",
                      {
                        read_out_language_id: id,
                        read_out_accent_id: GetAccentList[0].id,
                      },
                      "add_multiple"
                    );
                  } else {
                    setupdateValue("read_out_language_id", id);
                  }
                  dispatch(handleRemoveReadoutURL());
                  dispatch(handleRemoveTranslate());
                }}
                disabled={
                  updateValue.includes("read_out_language_id") ||
                  updateValue.includes("add_multiple") ||
                  userSettings?.account_active_inactive === 0
                }
              />
            </div>{" "}
            <div className="ms-5">
              <p className={classes.smallheading}>Readout Accent</p>
              <Select
                showSearch
                style={{ width: 200 }}
                className={`mt-2 ${classes.SelectSec} settingsSelect`}
                placeholder="Search Readout Accent"
                optionFilterProp="children"
                value={getValidDisplayData(
                  getAccentData(),
                  formikvalues.read_out_accent_id,
                  "id"
                )}
                filterOption={(input, option) =>
                  (option?.label?.toLowerCase() ?? "").includes(
                    input?.toLowerCase()
                  )
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={RemoveDuplicates(getAccentData())}
                onChange={(_, { id }) => {
                  setupdateValue("read_out_accent_id", id);
                  dispatch(handleRemoveReadoutURL());
                  dispatch(handleRemoveTranslate());
                }}
                disabled={
                  updateValue.includes("read_out_accent_id") ||
                  updateValue.includes("add_multiple") ||
                  userSettings?.account_active_inactive === 0 ||
                  !getAccentData() ||
                  getAccentData().length === 0
                }
              />
            </div>
          </div>
          <div>
            <p className={classes.smallheading}>Timezone</p>
            <Select
              showSearch
              style={{ width: 200 }}
              className={`mt-2 ${classes.SelectSec} settingsSelect`}
              placeholder="Search Timezone"
              optionFilterProp="children"
              value={formikvalues.time_zone}
              filterOption={(input, option) =>
                (option.value.toLowerCase() ?? "").includes(input.toLowerCase())
              }
              options={TimeZones}
              onChange={(_, { value }) => {
                setupdateValue("time_zone", value);
              }}
              disabled={
                updateValue.includes("time_zone") ||
                userSettings?.account_active_inactive === 0
              }
            />
          </div>

          <div>
            <p className={classes.smallheading}>Date Format</p>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              className={`mt-2 ${classes.SelectSec} settingsSelect`}
              optionFilterProp="children"
              value={formikvalues.date_format}
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={DateTypeFormats}
              onChange={(_, { label }) => {
                setupdateValue("date_format", label);
              }}
              disabled={
                updateValue.includes("date_format") ||
                userSettings?.account_active_inactive === 0
              }
            />
          </div>

          <div>
            <p className={classes.smallheading}>Rawcaster Account </p>
            <Radio.Group
              defaultValue={formikvalues?.account_active_inactive}
              value={formikvalues?.account_active_inactive}
              className={classes.online_status}
              onChange={(e) => {
                if (e.target.value === 0) {
                  Modal.confirm({
                    title: "Confirmation",
                    okText: "Yes",
                    cancelText: "No",
                    cancelButtonProps: {
                      danger: true,
                    },
                    content: (
                      <div>
                        Are you sure you want to inactivate your Rawcaster
                        Account?
                      </div>
                    ),
                    onOk: () => {
                      setupdateValue("account_active_inactive", 0);
                    },
                  });
                } else {
                  setupdateValue("account_active_inactive", e.target.value);
                }
              }}
              disabled={updateValue.includes("account_active_inactive")}
            >
              {AccountStatus.map((elem, index) => {
                return (
                  <Radio
                    className={
                      formikvalues.account_active_inactive === index
                        ? classes.radio_active
                        : null + " " + classes.radio_inactive
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
        </>
      )}
    </div>
  );
};

export default General;
