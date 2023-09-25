import moment from "moment";
import {
  JSONtoformdata,
  decodeHtml,
  utctoUserTimezone,
} from "../../Shared/Utility";
import {
  FollowandunfollowService,
  unFriendService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useAppSelector } from "../../Store/Redux/Config/Hooks";
import { DEFAULT_DATE_FORMAT } from "../../Shared/Constant";

/**
 * Calculates the age based on the given date of birth.
 * @param {Date} dob - The date of birth.
 * @returns The calculated age.
 */
export const calculate_age = (dob) => {
  var diff_ms = Date.now() - dob;
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const defaultRawcaterPage = (val) => {
  switch (val) {
    case 1:
      return "Nugget";
    case 2:
      return "Event";
    case 3:
      return "Chat";
    default:
      return "Nugget";
  }
};

/**
 * Replaces placeholders in a biodata string with actual values from the given data object.
 * @param {object} data - The data object containing the biodata information.
 * @param {string} [type="display"] - The type of replacement to perform. Defaults to "display".
 * @returns {string} The formatted biodata string with placeholders replaced.
 */

function useReplaceBiodataHandler(data, isMyBio = false) {
  const userSettings = useAppSelector((state) => state.auth.userSettings);

  if (data) {
    function replacePlaceholder(placeholder, value) {
      // Check for null or undefined and convert them to empty string
      if (value === null || value === undefined) {
        value = "";
      }
      return `${placeholder} ${value}`;
    }

    const isValidString = (val) => {
      return val && val !== "";
    };

    const GetValidName = (isPartial = false) => {
      if (isValidString(data.first_name)) {
        if (isValidString(data.last_name) && !isPartial) {
          return `${data.first_name} ${data.last_name}`;
        } else {
          return `${data.first_name}`;
        }
      } else if (isValidString(data.last_name)) {
        return data.last_name;
      } else {
        return "";
      }
    };

    const momentDob = moment(data.dob, "YYYY-MM-DD");
    const GetAge = moment().diff(momentDob, "years");
    // Create parts of the description
    const namePart = `${GetValidName()} is ${
      !isNaN(GetAge) ? GetAge : ""
    } years old,${
      !isNaN(GetAge)
        ? ` was born in ${moment(data.dob, " YYYY-MM-DD").format(
            userSettings
              ? userSettings.default_date_format
              : DEFAULT_DATE_FORMAT
          )}.`
        : ""
    }`;
    const locationPart = `${GetValidName(true)} presently resides in ${
      data.geo_location
    }.`;
    const languagePart = replacePlaceholder(
      `${GetValidName(true)}'s preferred communication language is English`
    );
    const userStatusPart = replacePlaceholder(
      `${GetValidName(true)} has been a Rawcaster`,
      `${data.user_status} since ${
        userSettings
          ? utctoUserTimezone(data.date_of_join, userSettings.time_zone).format(
              " DD MMM YYYY "
            )
          : ""
      }`
    );
    const defaultPagePart = replacePlaceholder(
      `${GetValidName(true)} prefers to be contacted in Rawcaster through`,
      defaultRawcaterPage(userSettings ? userSettings.mobile_default_page : 1)
    );

    // Join the parts to form the description
    const descriptionParts = [
      namePart,
      locationPart,
      languagePart,
      userStatusPart,
      defaultPagePart,
    ];
    const description = descriptionParts.join(",");

    // if (userSettings?.mobile_default_page && isMyBio) {
    //   str = str.replace(
    //     /<rawcaster_default_page>/g,
    //     defaultRawcaterPage(
    //       userSettings ? userSettings?.mobile_default_page : 1
    //     )
    //   );
    // }

    return description;
  }
  return "";
}

export default useReplaceBiodataHandler;

/**
 * Handles the unfriend service by sending a request to the server to unfriend a user.
 * @param {string} token - The authentication token of the user.
 * @param {string} user_id - The ID of the user to unfriend.
 * @returns {Promise<string>} A promise that resolves with a success message if the unfriend operation is successful, or rejects if there is an error.
 */
export const handleUnFriendService = (token, user_id) => {
  return new Promise((resolve, reject) => {
    const unfriendData = {
      token,
      user_id,
    };
    unFriendService(JSONtoformdata(unfriendData))
      .then(({ data }) => {
        if (data.status === 1) {
          toast.remove("rawcaster");
          toast.success(data.msg, { id: "rawcaster" });
          resolve(data.msg);
        } else {
          reject();
          toast.remove("rawcaster");
          toast.error(data.msg, { id: "rawcaster" });
        }
      })
      .catch(() => {
        reject();
      });
  });
};

/**
 * Handles the unfollow service by sending a request to the server to unfollow a user.
 * @param {string} token - The authentication token of the user.
 * @param {string} follow_userid - The ID of the user to unfollow.
 * @returns {Promise<string>} A promise that resolves with a success message if the unfollow is successful, or rejects if there is an error.
 */
export const handleUnFollowService = (token, follow_userid) => {
  return new Promise((resolve, reject) => {
    const unfollowData = {
      token,
      follow_userid,
      type: 2,
    };
    FollowandunfollowService(JSONtoformdata(unfollowData))
      .then(({ data }) => {
        if (data.status === 1) {
          toast.remove("rawcaster");
          toast.success(data.msg, { id: "rawcaster" });
          resolve(data.msg);
        } else {
          reject();
          toast.remove("rawcaster");
          toast.error(data.msg, { id: "rawcaster" });
        }
      })
      .catch(() => {
        reject();
      });
  });
};
