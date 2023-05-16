import React, { useEffect, useState } from "react";
import { getNuggetDetailService } from "../../Services/ApiService";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { DecryptionString, JSONtoformdata } from "../../Shared/Utility";
import { useNavigate, useParams } from "react-router";
import Post from "./Post";
import classes from "./Nuggets.module.css";
import { Spinner } from "react-bootstrap";
const ViewNugget = () => {
  const { nugID } = useParams();
  const navigate = useNavigate();
  const nugget_id = nugID ? DecryptionString(nugID) : null;
  const Token = useAuthToken();
  const [NuggetData, setNuggetData] = useState();

  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: nugget_id,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        if (res.data.status === 1) {
          setNuggetData(res.data.nugget_detail);
        } else {
          navigate(-1);
        }
      })
      .catch((err) => {
        navigate(-1);
      });
  };

  useEffect(() => {
    if (Token) {
      getNuggetDetail();
    }
  }, [Token]);
  return (
    <div className={classes.viewDetailNugget}>
      <div className={classes.mainPost}>
        {NuggetData ? (
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
        ) : (
          <div className={classes.LoadingSec}>
            <Spinner animation="border" color="#563662" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewNugget;
