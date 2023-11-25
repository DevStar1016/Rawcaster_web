import { useAuthData } from "./Reduxfetcher";

const useDataHandler = () => {
  const loginData = useAuthData();

  const usePartialDisplayName = (length: number = 20) => {
    if (loginData && loginData.name) {
      if (loginData.name.length > length) {
        return loginData.name.substring(0, length) + "...";
      }
      return loginData?.name;
    }
    return "User";
  };

  return {
    usePartialDisplayName,
  };
};

export default useDataHandler;
