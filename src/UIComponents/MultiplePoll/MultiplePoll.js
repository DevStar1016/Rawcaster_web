import React, { useState, useEffect, useRef, createRef } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { pollVoteService } from "../../Services/ApiService";
import { useListNuggetContext } from "../../Shared/Context";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import {
  getAuthenticated,
  isAccountValid,
  JSONtoformdata,
} from "../../Shared/Utility";
import {
  handleloginModalShow,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import styles from "./Multiplepoll.module.css";
import { animateAnswers, manageVote } from "./Utility";

const MultiplePoll = ({
  nugget_id,
  results,
  isVoted,
  isVotedId,
  VoteTiming,
  TotalVotes = 0,
  created_date,
}) => {
  const { getNuggetList } = useListNuggetContext();
  const [voted, setVoted] = useState(false);
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const answerRefs = useRef(results.map(() => createRef()));
  const theme = {
    textColor: "black",
    backgroundColor: "rgb(255,255,255)",
    activeBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    inactiveBg: "linear-gradient(91.4deg, #F4A465 0.43%, #E88190 99.59%)",
    alignment: "center",
  };

  function calculateTimeLeft(currentTime, startTime, endTime) {
    const differenceToEnd = endTime - currentTime;
    const millisecondsPerMinute = 1000 * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;
    const remainingDays = Math.floor(differenceToEnd / millisecondsPerDay);
    const remainingHours = Math.floor(
      (differenceToEnd % millisecondsPerDay) / millisecondsPerHour
    );
    const remainingMinutes = Math.floor(
      (differenceToEnd % millisecondsPerHour) / millisecondsPerMinute
    );
    const remainingSeconds = Math.floor(
      (differenceToEnd % millisecondsPerMinute) / 1000
    );
    return {
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds,
    };
  }

  const getVotesTiming = () => {
    const isoString = created_date.replace(" ", "T") + "Z";

    const startTime = new Date(isoString);
    const now = new Date();
    const [daysval, hoursval, minutesval] = VoteTiming.split(":");
    const specifiedDate = new Date();
    specifiedDate.setDate(startTime.getDate() + parseInt(daysval));
    specifiedDate.setHours(startTime.getHours() + parseInt(hoursval));
    specifiedDate.setMinutes(startTime.getMinutes() + parseInt(minutesval));

    const timeLeft = calculateTimeLeft(
      now.getTime(),
      startTime.getTime(),
      specifiedDate.getTime()
    );
    const { remainingDays, remainingHours, remainingMinutes } = timeLeft;

    let output = "";
    if (remainingDays > 0) {
      output += `${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
    }
    if (remainingHours > 0 && remainingDays > 0) {
      output += `, `;
    }
    if (remainingHours > 0) {
      output += `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`;
    }
    if (remainingHours > 0 && remainingMinutes > 0) {
      output += `, `;
    }
    if (remainingMinutes > 0) {
      output += `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} `;
    }
    if (output !== "") {
      output += ` left`;
    }
    return output;
  };

  const handlePoll = (item, index) => {
    let pollData = {
      token: Token,
      nugget_id: nugget_id,
      poll_option_id: item.option_id,
    };
    pollVoteService(JSONtoformdata(pollData))
      .then((res) => {
        if (res.data.status === 1) {
          getNuggetList().then((res) => {
            let findData = res.nuggets_list.find(
              (ele) => ele.nugget_id === nugget_id
            );
            if (findData) {
              manageVote(findData.poll_option, index, answerRefs, theme);
              setVoted(true);
            }
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
    if (getVotesTiming() === "") {
      animateAnswers(results, answerRefs, theme, undefined, 0);
      setVoted(true);
    } else if (!isVoted) {
      const findIndex = results.findIndex((ele) => ele.option_id === isVotedId);
      if (findIndex !== -1) {
        animateAnswers(results, answerRefs, theme, undefined, findIndex);
        setVoted(true);
      }
    } else {
      animateAnswers(results, answerRefs, theme, undefined, 0);
      setVoted(true);
    }
  }, [results]);

  return (
    <>
      <article className={styles.container}>
        {results.map((result, index) => (
          <div
            key={result.option_id}
            role="button"
            id={"mulAnswer" + result.option_id}
            className={
              voted ? styles.answer : styles.answer_hover + " " + styles.answer
            }
            style={{
              backgroundColor: voted ? "#FFFFFF" : "#F2718D",
            }}
            onClick={() => {
              if (!voted) {
                if (getAuthenticated()) {
                  if (isAccountValid()) {
                    handlePoll(result, index);
                  } else {
                    dispatch(
                      handleprofileVerifyModalShow({
                        show: true,
                        msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                      })
                    );
                  }
                } else {
                  dispatch(handleloginModalShow(true));
                }
              }
            }}
          >
            <div
              ref={answerRefs?.current[index]}
              className={styles.answerInner}
              style={{
                textAlign: voted ? "start" : "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  borderRadius: 8,
                  color: voted ? "#fff" : "#FFF",
                }}
              >
                {result.option_name}
              </p>
            </div>
            {voted && (
              <span style={{ color: "#000" }}>{result.option_percentage}%</span>
            )}
          </div>
        ))}

        <div className={styles.detailSec}>
          <p>
            {TotalVotes} votes {getVotesTiming() !== "" ? "." : ""}{" "}
            {getVotesTiming()}
          </p>
        </div>
      </article>
    </>
  );
};

export default MultiplePoll;
