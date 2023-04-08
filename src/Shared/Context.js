import { createContext, useContext } from "react";

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
