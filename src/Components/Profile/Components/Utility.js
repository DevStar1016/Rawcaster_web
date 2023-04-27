import {
  getFollowListService,
  listAllFriendsService,
  listClaimAccountService,
} from "../../../Services/ApiService";
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
            connections: res.data.follow_list.slice(0, 8),
            allconnections: res.data.follow_list,
            allconnectionscount: parseInt(res.data.follow_count),
            connectionscount: getFansCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};

export const getUnclaimedInfluencerData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let listData = {
      token: token,
    };
    listClaimAccountService(JSONtoformdata(listData))
      .then(({ data }) => {
        if (data.status === 1) {
          let contactlist = data.unclaim_accounts;

          const getCount = () => {
            if (parseInt(contactlist) > 8) {
              return parseInt(contactlist) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            connections: contactlist.slice(0, 8),
            allconnections: contactlist,
            allconnectionscount: contactlist.length,
            connectionscount: getCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};

export const getConnectionData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let listData = {
      token: token,
      allfriends: 1,
    };
    listAllFriendsService(JSONtoformdata(listData))
      .then(({ data }) => {
        if (data.status === 1) {
          let contactlist = data.friends_list;
          contactlist.sort((a, b) => {
            return b.online - a.online;
          });

          contactlist.sort((a, b) => {
            return (
              new Date(b.last_msg_datetime).getTime() -
              new Date(a.last_msg_datetime).getTime()
            );
          });
          const getCount = () => {
            if (parseInt(contactlist) > 8) {
              return parseInt(contactlist) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            connections: contactlist.slice(0, 8),
            allconnections: data.friends_list,
            allconnectionscount: data.friends_count,
            connectionscount: getCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};
