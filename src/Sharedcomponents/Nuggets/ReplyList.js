import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { addNuggetCommentService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import classes from "./Nuggets.module.css";
import hearticon from "../../Assets/Images/svg/heart.svg";
import sendicon from "../../Assets/Images/svg/sendicon.svg";
import emoji from "../../Assets/Images/svg/emoji.svg";
import { Dropdown, Input, Spin } from "antd";
import { useAuthData } from "../../Shared/Reduxfetcher";
import dayjs from "dayjs";
import { useListNuggetContext } from "../../Shared/Context";

const ReplyList = ({ isReplyEnabled, comment_id, index = 0 }) => {
  const {
    nugget_id,
    CommentList,
    getCommentList,
    getNuggetList,
    isCommentLoading,
  } = useListNuggetContext();
  const loginUserData = useAuthData();
  const [ReplyTxt, setReplyTxt] = useState([]);
  const [ReplyList, setReplyList] = useState([]);

  useEffect(() => {
    const findReply = CommentList.find(
      (ele) => parseInt(ele.comment_id) === parseInt(comment_id)
    );
    if (findReply) {
      setReplyList(findReply.reply);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddCommentforAnugget = (id, comment, type = 2) => {
    let addComment = {
      token: loginUserData?.token,
      type: type,
      nugget_id: id,
      comment_id: comment_id,
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
    <div className={classes.cmtSec} style={{ width: "90%" }}>
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
          {ReplyList.length !== 0 ? (
            <>
              {ReplyList.map((elem) => {
                return (
                  <div className={classes.item}>
                    <div className={classes.proImg}>
                      <img src={elem?.profile_image} alt={elem?.name} />
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
                            <i class="material-symbols-outlined">more_horiz</i>
                          </div>
                        </Dropdown>
                      </div>
                      <div className="clearfix"></div>
                      <div className={classes.agree}>
                        <img src={hearticon} alt="Agree" /> Agree
                      </div>

                      <div className={classes.time}>
                        {dayjs(elem?.created_date).fromNow(true)} ago
                      </div>
                    </div>
                  </div>
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
      {isReplyEnabled === comment_id && (
        <div className={classes.comtArea}>
          <div className={classes.proImg}>
            <img
              src={loginUserData?.profile_image}
              alt={loginUserData?.profile_image}
            />
          </div>
          <div className={classes.textBox}>
            <Input
              placeholder="Write your reply here..."
              value={ReplyTxt[index]}
              onChange={(e) => {
                let tempData = [...ReplyTxt];
                tempData[index] = e.target.value;
                setReplyTxt(tempData);
              }}
            />
            <img className={classes.emojiicon} src={emoji} alt="emoji" />
            <img
              className={classes.sendicon}
              alt="Send_icon"
              src={sendicon}
              onClick={() => {
                AddCommentforAnugget(nugget_id, ReplyTxt[index]);
                let tempData = [...ReplyTxt];
                tempData[index] = "";
                setReplyTxt(tempData);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyList;
