import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useNuggets } from "../../../Shared/Reduxfetcher";
import { handleProfileNavigate } from "../../../Shared/Utility";
import classes from "../Profile.module.css";
import { useProfileContext } from "../../../Shared/Context";
import { useDispatch } from "react-redux";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import ConnectionModal from "../../../Modal/Connections/Connection";

const FansThumb = () => {
  const { FansList, setFansList } = useProfileContext();
  const { nuggetFormData } = useNuggets();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSeeMore, setisSeeMore] = useState(false);
  return (
    <div className={classes.fansList}>
      {FansList.connections?.map((ele) => (
        <img
          className={classes.thumbImg}
          alt="User_img"
          src={ele.profile_img ? ele.profile_img : ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = defaultprofileImg;
          }}
          onClick={() => {
            let finalData = {
              dispatch,
              navigate,
              nuggetFormData,
              user_id: ele.user_id,
            };
            handleProfileNavigate(finalData);
            setFansList({
              connections: [],
              allconnections: [],
              connectionscount: 0,
              allconnectionscount: 0,
              isLoaded: true,
            });
          }}
        />
      ))}
      {FansList.connectionscount !== 0 && (
        <div
          onClick={() => {
            setisSeeMore(true);
          }}
          className={classes.count}
        >
          +{FansList.connectionscount}
        </div>
      )}

      {isSeeMore && (
        <ConnectionModal
          type={"Fans"}
          userType={""}
          open={isSeeMore}
          filters={true}
          value={FansList}
          onSuccess={() => {
            setisSeeMore(false);
          }}
          onClose={() => {
            setisSeeMore(false);
          }}
        />
      )}
    </div>
  );
};

export default FansThumb;
