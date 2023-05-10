import moment from "moment";
import { decodeHtml } from "../../Shared/Utility";

export const calculate_age = (dob) => {
  var diff_ms = Date.now() - dob;
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const replaceBiodataHandler = (data, type = "display") => {
  console.log(data);
  if (data) {
    let defaultBioDataformat = "";

    if (data.dob !== "") {
      defaultBioDataformat =
        defaultBioDataformat +
        "<first_name> <last_name> is  <age> years old, was born in <dob>. ";
    }

    if (data.geo_location !== "") {
      defaultBioDataformat =
        defaultBioDataformat +
        "<first_name> <last_name> presently resides in <location>. ";
    }

    defaultBioDataformat =
      defaultBioDataformat +
      "<first_name>’s preferred communication language is <language> . <first_name> has been a Rawcaster <user_status>  since <date_of_join> and prefers to be contacted in Rawcaster through <rawcaster_default_page>.";
    let str =
      data.bio_data !== null && type === "display" && data.bio_data !== ""
        ? decodeHtml(data.bio_data)
        : defaultBioDataformat;

    str = str.replace(/<first_name>/g, decodeHtml(data.first_name));
    str = str.replace(/<last_name>/g, decodeHtml(data.last_name));
    str = str.replace(/<age>/g, calculate_age(moment(data.dob)));
    str = str.replace(/<dob>/g, moment(data.dob).format(" MMM YYYY "));
    str = str.replace(/<location>/g, data.geo_location);
    str = str.replace(/<language>/g, data.language);
    str = str.replace(/<user_status>/g, data.user_status);
    str = str.replace(
      /<date_of_join>/g,
      "02-11-2022"
      //   utility
      //     .utctoUserTimezone(data.date_of_join, userSetting.time_zone)
      //     .format(" DD MMM YYYY ")
    );
    str = str.replace(
      /<rawcaster_default_page>/g,
      "test"
      // defaultRawcaterPage(userSetting ? userSetting.mobile_default_page : 1)
    );

    return str;
  }
  return "";
};
