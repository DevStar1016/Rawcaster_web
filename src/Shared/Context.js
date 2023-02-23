import { createContext, useContext } from "react";

export const PostNuggetContext = createContext();
export const usePostNuggetContext = () => useContext(PostNuggetContext);

export const ListNuggetContext = createContext();
export const useListNuggetContext = () => useContext(ListNuggetContext);
