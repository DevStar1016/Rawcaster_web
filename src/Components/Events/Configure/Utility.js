import { toast } from "react-hot-toast";
import { getEventTypeService } from "../../../Services/ApiService";
import { JSONtoformdata } from "../../../Shared/Utility";

export const useEventType = async (token) => {
  let eventData = {
    token: token,
  };
  try {
    const data = await getEventTypeService(JSONtoformdata(eventData));
    return data;
  } catch (error) {
    console.log(error);
  }
};
