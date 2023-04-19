import React, { useEffect, useState } from "react";
import { getNuggetDetailService } from "../../Services/ApiService";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../Shared/Utility";
import { useParams } from "react-router";
import Post from "./Post";
import classes from "./Nuggets.module.css";
const ViewNugget = () => {
  const { nugID } = useParams();
  const Token = useAuthToken();
  const [NuggetData, setNuggetData] = useState();

  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: nugID,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        if (res.data.status === 1) {
          setNuggetData(res.data.nugget_detail);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (Token) {
      getNuggetDetail();
    }
  }, [Token]);
  return (
    <div className={classes.viewDetailNugget}>
      <div className={classes.mainPost}>
        {NuggetData && (
          <Post
            index={0}
            isCommentShow={true}
            ele={NuggetData}
            muted={false}
            setmuted={(status) => {
              console.log(status);
            }}
            handleLike={(like) => {
              let tempData = { ...NuggetData };
              tempData = {
                ...tempData,
                liked: like === 1 ? true : false,
                total_likes:
                  like === 1
                    ? tempData.total_likes + 1
                    : tempData.total_likes - 1,
              };
              setNuggetData(tempData);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ViewNugget;
