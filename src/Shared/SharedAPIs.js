import { addNuggetViewService } from "../Services/ApiService";
import { JSONtoformdata } from "./Utility";

export const addNuggetView = (data) => {
  addNuggetViewService(JSONtoformdata(data))
    .then((res) => {})
    .catch((err) => {});
};
