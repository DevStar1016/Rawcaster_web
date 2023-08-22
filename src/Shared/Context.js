import { createContext, useContext } from "react";

export const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const MainContext = createContext();
export const useMainContext = () => useContext(MainContext);

export const PostNuggetContext = createContext();
export const usePostNuggetContext = () => useContext(PostNuggetContext);

export const ListNuggetContext = createContext();
export const useListNuggetContext = () => useContext(ListNuggetContext);

export const SingleNuggetContext = createContext();
export const useSingleNuggetContext = () => useContext(SingleNuggetContext);

export const SpecificConnectionNugget = createContext();
export const useSpecificConnectionNugget = () =>
  useContext(SpecificConnectionNugget);

export const ProfileContext = createContext();
export const useProfileContext = () => useContext(ProfileContext);

export const SettingsContext = createContext();
export const useSettingsContext = () => useContext(SettingsContext);

export const EventContext = createContext();
export const useEventContext = () => useContext(EventContext);

export const AddEventContext = createContext();
export const useAddEventContext = () => useContext(AddEventContext);

export const NotificationContext = createContext();
export const useNotificationContext = () => useContext(NotificationContext);

export const ConfigureGroupContext = createContext();
export const useConfigureGroupContext = () => useContext(ConfigureGroupContext);

export const ChatBotContext = createContext();
export const useChatBotContext = () => useContext(ChatBotContext);

export const MeetingContext = createContext();
export const useMeetingContext = () => useContext(MeetingContext);

export const ReferalContext = createContext();
export const useReferalContext = () => useContext(ReferalContext);

export const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

export const EventRoomContext = createContext();
export const useEventRoomContextContext = () => useContext(EventRoomContext);
