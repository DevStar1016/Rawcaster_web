/**
 * This module exports multiple context objects and corresponding custom hooks for accessing those contexts.
 * Each context object is created using the `createContext` function from the React library.
 * The custom hooks are created using the `useContext` hook from the React library.
 *
 * GlobalContext: A context object for global state management.
 * useGlobalContext: A custom hook for accessing the GlobalContext.
 */
import { createContext, useContext } from "react";
import { MainContextProps } from "./types/context";

export const GlobalContext = createContext({});
export const useGlobalContext: any = () => useContext(GlobalContext);

export const MainContext = createContext<MainContextProps | null>(null);
export const useMainContext = () => useContext(MainContext) as MainContextProps;

export const PostNuggetContext = createContext({});
export const usePostNuggetContext: any = () => useContext(PostNuggetContext);

export const ListNuggetContext = createContext({});
export const useListNuggetContext: any = () => useContext(ListNuggetContext);

export const SingleNuggetContext = createContext({});
export const useSingleNuggetContext: any = () =>
  useContext(SingleNuggetContext);

export const SpecificConnectionNugget = createContext({});
export const useSpecificConnectionNugget: any = () =>
  useContext(SpecificConnectionNugget);

export const ProfileContext = createContext({});
export const useProfileContext: any = () => useContext(ProfileContext);

export const SettingsContext = createContext({});
export const useSettingsContext: any = () => useContext(SettingsContext);

export const EventContext = createContext({});
export const useEventContext: any = () => useContext(EventContext);

export const AddEventContext = createContext({});
export const useAddEventContext: any = () => useContext(AddEventContext);

export const NotificationContext = createContext({});
export const useNotificationContext: any = () =>
  useContext(NotificationContext);

export const ConfigureGroupContext = createContext({});
export const useConfigureGroupContext: any = () =>
  useContext(ConfigureGroupContext);

export const ChatBotContext = createContext({});
export const useChatBotContext: any = () => useContext(ChatBotContext);

export const MeetingContext = createContext({});
export const useMeetingContext: any = () => useContext(MeetingContext);

export const ReferalContext = createContext({});
export const useReferalContext: any = () => useContext(ReferalContext);

export const ChatContext = createContext({});
export const useChatContext: any = () => useContext(ChatContext);

export const EventRoomContext = createContext({});
export const useEventRoomContext: any = () => useContext(EventRoomContext);
