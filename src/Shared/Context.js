import { createContext, useContext } from "react";

export const PostNuggetContext = createContext();
export const useServiceRequest = () => useContext(PostNuggetContext);
