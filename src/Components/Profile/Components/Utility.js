import { getFollowListService } from "../../../Services/ApiService";
import { JSONtoformdata } from "../../../Shared/Utility";

export const getfollowerfollowingService = (fansList) => {
  let promise = new Promise((resolve, reject) => {
    getFollowListService(JSONtoformdata(fansList))
      .then((res) => {
        if (res.data.status === 1) {
          const getFansCount = () => {
            if (parseInt(res.data.follow_count) > 8) {
              return parseInt(res.data.follow_count) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            fans: res.data.follow_list.slice(0, 8),
            count: getFansCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            fans: [],
            count: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          fans: [],
          count: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};
