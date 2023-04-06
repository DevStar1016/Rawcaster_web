// General

const primaryShare = [
  "Don’t Show",
  "Public",
  "Connections Only",
  "Specific Group",
];

const secondaryShare = [
  "Rawcaster",
  "Public",
  "All Connections",
  "Specific Connections",
  "All Groups",
  "Specific Group",
  "My Influencers",
  "Mine Only",
];

export const AccountStatus = ["Inactive", "Active"];

export const SettingsList = [
  {
    title: "Phone",
    keyword: "phone_display_status",
    groupkeyword: "phone_group_list",
    radioValue: primaryShare,
    groupid: 3,
    friendid: null,
  },
  {
    title: "Location",
    keyword: "location_display_status",
    groupkeyword: "location_group_list",
    radioValue: primaryShare,
    groupid: 3,
    friendid: null,
  },
  {
    title: "DOB",
    keyword: "dob_display_status",
    groupkeyword: "dob_group_list",
    radioValue: primaryShare,
    groupid: 3,
    friendid: null,
  },
  {
    title: "Bio Data",
    keyword: "bio_display_status",
    groupkeyword: "bio_group_list",
    radioValue: primaryShare,
    groupid: 3,
    friendid: null,
  },
  {
    title: "Online Status",
    keyword: "online_status",
    groupkeyword: "online_group_list",
    radioValue: primaryShare,
    groupid: 3,
    friendid: null,
  },
  {
    title: "Nugget Display Option",
    keyword: "public_nugget_display",
    groupkeyword: "nugget_display_list",
    radioValue: secondaryShare,
    groupid: 5,
    friendid: 3,
  },
  {
    title: "Event Display Option",
    keyword: "public_event_display",
    groupkeyword: "event_display_list",
    radioValue: secondaryShare,
    groupid: 5,
    friendid: 3,
  },
];

export const DefaultRawcasterPage = [
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
];

export const DateTypeFormats = [
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
];

// Notifications

export const switchTypes = [
  { title: "Email", id: 1, value: "010" },
  { title: "SMS", id: 2, value: "001" },
  { title: "Push", id: 0, value: "101" },
];

export const NotificationTypes = [
  {
    title: "Connection Requests",
    type: "friend_request",
    description:
      "These are notifications for when someone sends you a connection request, or when a request you’ve sent is accepted.",
  },
  {
    title: "Nuggets",
    type: "nuggets",
    description:
      "Choose how you want to be notified when you receive a new nugget",
  },
  {
    title: "Events",
    type: "events",
    description:
      "Choose how you want to be notified when you receive a new meeting invitation.",
  },
];

// Events

export const EventSettings = [
  {
    title: "Waiting Room",
    description:
      "Allow participants to be placed in a waiting room until the host admits them individually.",
    type: "waiting_room",
    isprimary: true,
  },
  {
    title: "Join before host",
    description:
      "Allow participants to join the meeting event before the host arrives. This will disable the waiting room feature.",
    type: "join_before_host",
    isprimary: true,
  },
  {
    title:
      "Use sound to notify host when a participant joins or exits the meeting",
    description:
      "When enabled, host will hear a sound for each participant that joins the meeting.",
    type: "participant_join_sound",
    isprimary: false,
  },
  {
    title: "Allow any participant to share their screen during meeting",
    description:
      "When enabled, any participant in the event can share their screen during meeting.",
    type: "screen_share_status",
    isprimary: false,
  },
];
