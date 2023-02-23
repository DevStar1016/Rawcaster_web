import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addNuggetCommentService,
  nuggetCommentListService,
} from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import classes from "./Nuggets.module.css";
import hearticon from "../../Assets/Images/svg/heart.svg";
import replyicon from "../../Assets/Images/svg/comment.svg";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Spin } from "antd";
import { useAuthData } from "../../Shared/Reduxfetcher";
import dayjs from "dayjs";
import { useListNuggetContext } from "../../Shared/Context";
import ReplyList from "./ReplyList";

const CommentsList = ({ index }) => {
  const {
    nugget_id,
    CommentList,
    getCommentList,
    getNuggetList,
    isCommentLoading,
  } = useListNuggetContext();
  const loginUserData = useAuthData();
  const [CommentTxt, setCommentTxt] = useState([]);
  const [isReplyEnabled, setisReplyEnabled] = useState(false);

  const AddCommentforAnugget = (id, comment, type = 1) => {
    let addComment = {
      token: loginUserData?.token,
      type: type,
      nugget_id: id,
      comment: comment,
    };
    addNuggetCommentService(JSONtoformdata(addComment))
      .then((res) => {
        if (res.data.status === 1) {
          getNuggetList();
          getCommentList(id);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <div className={classes.cmtSec}>
      {isCommentLoading ? (
        <div className="d-flex justify-content-center align-items-center py-2">
          <Spin
            size="large"
            spinning={true}
            style={{ textAlign: "center" }}
          ></Spin>
        </div>
      ) : (
        <>
          {CommentList.length !== 0 ? (
            <>
              {CommentList.map((elem, ind) => {
                return (
                  <>
                    <div className={classes.item}>
                      <div className={classes.proImg}>
                        <img src={elem?.profile_image} />
                      </div>
                      <div className={classes.rightitem}>
                        <div className="d-flex flex-row">
                          <div className={classes.cmtText}>
                            <p>{elem?.name}</p>
                            <span>{elem?.comment}</span>
                          </div>
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  label: <div>Edit</div>,
                                  key: "0",
                                },
                                {
                                  label: <div>Delete</div>,
                                  key: "1",
                                },
                              ],
                            }}
                            trigger={["click"]}
                          >
                            <div className={classes.moreBtn}>
                              <i class="material-symbols-outlined">
                                more_horiz
                              </i>
                            </div>
                          </Dropdown>
                        </div>
                        <div className="clearfix"></div>
                        <div className={classes.agree}>
                          <img src={hearticon} /> Agree
                        </div>
                        <div
                          className={classes.agree}
                          onClick={() => {
                            if (isReplyEnabled) {
                              setisReplyEnabled("");
                            } else {
                              setisReplyEnabled(elem.comment_id);
                            }
                          }}
                        >
                          <img src={replyicon} /> Reply
                        </div>
                        <div className={classes.time}>
                          {dayjs(elem?.created_date).fromNow(true)} ago
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <ReplyList
                        isReplyEnabled={isReplyEnabled}
                        comment_id={elem.comment_id}
                        index={ind}
                      />
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center py-2">
              {/* <span>Comments is Empty</span> */}
            </div>
          )}
        </>
      )}
      <div className={classes.comtArea}>
        <div className={classes.proImg}>
          <img src={loginUserData?.profile_image} />
        </div>
        <div className={classes.textBox}>
          <Input
            placeholder="Write your Comment here..."
            value={CommentTxt[index]}
            onChange={(e) => {
              let tempData = [...CommentTxt];
              tempData[index] = e.target.value;
              setCommentTxt(tempData);
            }}
          />
          <img className={classes.emojiicon} src={emoji} />
          <img
            className={classes.sendicon}
            src={sendicon}
            onClick={() => {
              AddCommentforAnugget(nugget_id, CommentTxt[index]);
              let tempData = [...CommentTxt];
              tempData[index] = "";
              setCommentTxt(tempData);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsList;
