import React, { useEffect, useState } from "react";
import classes from "./Nuggets.module.css";
import hearticon from "../Assets/Images/svg/heart.svg";
import commenticon from "../Assets/Images/svg/comment.svg";
import shareicon from "../Assets/Images/svg/share.svg";
import { useDispatch, useSelector } from "react-redux";
import { listNuggetsService } from "../Services/ApiService";
import { getDataValueById, JSONtoformdata } from "../Shared/Utility";
import { toast } from "react-hot-toast";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import dayjs from "dayjs";
import { SHARED_TYPE } from "../Shared/Constant";
import { Tooltip } from "antd";
import ImageGrid from "../UIComponents/ImageGrid";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const Nuggets = () => {
  const loginUserData = useSelector((state) => state.auth.loginUserData);
  const [NuggetList, setNuggetList] = useState([]);
  const [Pages, setPages] = useState({
    page: 1,
    totalpage: 1,
  });

  const getToken = () => {
    if (loginUserData) {
      return loginUserData?.token;
    } else {
      return "RAWCAST";
    }
  };
  const getNuggetList = (page = 1) => {
    let nuggetData = {
      nugget_type: 0,
      token: getToken(),
      page_number: page,
    };
    listNuggetsService(JSONtoformdata(nuggetData))
      .then((res) => {
        if (res.data.status === 1) {
          if (NuggetList.length === 0) {
            setNuggetList(res.data.nuggets_list);
          } else {
            setNuggetList((pre) => [...pre, ...res.data.nuggets_list]);
          }
          setPages({
            page: res.data.current_page_no,
            totalpage: res.data.total_pages,
          });
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    getNuggetList();
  }, []);

  const onEndReached = () => {
    if (Pages.page !== Pages.totalpage) {
      getNuggetList(Pages.page + 1);
    }
  };

  const scrollRef = useBottomScrollListener(onEndReached);

  return (
    <div className={classes.nuggetSec} ref={scrollRef}>
      {NuggetList?.map((ele) => {
        // let imageGallery = ele.media_list.map((ele) => {
        //   if (ele.media_type === "image") return ele.path;
        // });
        // let VideoGallery = ele.media_list.map((ele) => {
        //   if (ele.media_type === "video") return ele.path;
        // });
        // imageGallery = imageGallery.filter((ele) => ele !== undefined);
        // VideoGallery = VideoGallery.filter((ele) => ele !== undefined);
        return (
          <div className={classes.nuggetItem}>
            <div className={classes.profilePart}>
              <div className={classes.proImg}>
                <img src={ele?.original_user_image} />
                <Tooltip title="Became A Fan" color="#e26386">
                  <i className={classes.viewCount}>
                    {ele?.follow_count ? ele?.follow_count : ""}
                  </i>
                </Tooltip>
              </div>
              <p className={classes.proName}>{ele?.original_user_name}</p>
              <p className={classes.detailsRange}>
                {dayjs(ele?.created_date).fromNow(true)} ago{" "}
                <span class="material-icons">fiber_manual_record</span>
                {ele?.total_views} Views{" "}
                <span class="material-icons">fiber_manual_record</span>
                {getDataValueById(SHARED_TYPE, ele?.share_type)}
              </p>
            </div>
            <div className={classes.dropMenu}>
              <span class="material-icons">more_horiz</span>
            </div>
            <div className={classes.contentSec}>
              <div className={classes.feedsSec}>
                <p>{ele?.content}</p>
                <ImageGrid imgArray={ele.media_list} />
                {/* 
                {imageGallery.length !== 0 && (
                  <FbImageLibrary images={imageGallery} />
                )}
                {VideoGallery.length !== 0 && (
                  <Player aspectRatio={"4:3"}>
                    <source src={VideoGallery[0]} />
                  </Player>
                )} */}
                {/* {VideoGallery.length !== 0 && (
                  <ImageGrid>
                    {VideoGallery.map((ele) => (
                      <video src={ele} />
                    ))}
                  </ImageGrid>
                )} */}
                {/* <img
                  className={classes.nuggetsFeed}
                  src={require("../Assets/Images/png/nuggetfeed.png")}
                /> */}
              </div>
              <div className={classes.floattingSec}>
                <div className={classes.iconsec}>
                  <p>
                    <img src={hearticon} />
                  </p>
                  <span>82.3K</span>
                </div>
                <div className={classes.iconsec}>
                  <p>
                    <img src={commenticon} />
                  </p>
                  <span>172</span>
                </div>
                <div className={classes.iconsec}>
                  <p>
                    <img src={shareicon} />
                  </p>
                  <span>726</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Nuggets;
