export const defaultVolume = 30;

/**
 * An array of dropdown items for a Event menu.
 */
export const DropdownItems = [
  {
    label: "Upcoming Events",
    key: "0",
  },
  {
    type: "divider",
  },
  {
    label: "My Events",
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "Invited Events",
    key: "2",
  },
  {
    type: "divider",
  },
  {
    label: "Public Events",
    key: "3",
  },
  {
    type: "divider",
  },
  {
    label: "Past Events",
    key: "4",
  },
];

/**
 * An array of objects representing items in a user dropdown menu.
 * Each object has a label and a key property.
 * Some objects may have a type property set to "divider" to represent a divider line.
 */
export const UserDropdownItems = [
  {
    label: "My Events",
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "Past Events",
    key: "4",
  },
];

/**
 * An array of event settings objects.
 * Each object represents a specific event setting with its title, description, type, and isprimary flag.
 * @type {Array<Object>}
 */
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
    title: "Use Sound to notify",
    description:
      "When enabled, host will hear a sound for each participant that joins the meeting.",
    type: "sound_notify",
    isprimary: false,
  },
  {
    title: "Allow participant to share screen",
    description:
      "When enabled, any participant in the event can share their screen during meeting.",
    type: "user_screenshare",
    isprimary: false,
  },
];
