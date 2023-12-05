import {
  LIMIT_MESSAGE,
  LIMIT_MESSAGE_EQUAL_OR_ABOVE_DIAMOND,
} from "./ReduxCustomConstants";
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

  const useUpgradeDisplayMessage = () => {
    //@ts-ignore
    if (loginData && loginData.user_status_id < 4) {
      return { upgrade_message: LIMIT_MESSAGE, isUpgradable: true };
    }
    return {
      upgrade_message:
        LIMIT_MESSAGE_EQUAL_OR_ABOVE_DIAMOND +
        (loginData?.nugget_content_length ?? 0),
      isUpgradable: false,
    };
  };

  return {
    usePartialDisplayName,
    useUpgradeDisplayMessage,
  };
};

export default useDataHandler;
